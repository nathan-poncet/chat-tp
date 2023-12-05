import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Message } from 'types/message';
import { User } from 'types/user';
import OpenAI from 'openai';
import { LanguageCode } from 'types/translation';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Socket;

  openai: OpenAI;

  users: User[] = [];
  messages: Message[] = [];

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  @SubscribeMessage('chat-message')
  handleMessage(client: Socket, payload: string) {
    const user = this.users.find((user) => user.clientId === client.id);

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      user,
      translations: [],
      content: payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // add message to the list
    this.messages = [...this.messages, newMessage];

    this.server.emit('chat-message', newMessage);
  }

  @SubscribeMessage('chat-messages-translates')
  async handleMessageTranslate(
    client: Socket,
    payload: { messages: Message[]; languages: LanguageCode[] },
  ) {
    const { messages, languages } = payload;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "you're a translator with a perfect command of all languages.",
        },
        {
          role: 'system',
          content: `a user will provide you two JSON objects, the first one is a list of Message, the second one is a list of LanguageCode.
          Here is all types you need to know:
          
          enum LanguageCode {
            EN = 'en',
            FR = 'fr',
          }
          
          type Translation = {
            language_code: LanguageCode;
            content: string;
          };

          type User = {
            clientId: string;
            username: string;
          };

          type Message = {
            id: string;
            user: User;
            translations: Translation[];
            content: string;
            createdAt: string;
            updatedAt: string;
          };          
          `,
        },
        {
          role: 'system',
          content: 'your goal is to translate all messages in all languages',
        },
        {
          role: 'system',
          content: `the result must only be a JSON list of Message with all translations inside, this is an example of the expected result:
          [
            {
              "id": "1",
              "user": {
                "clientId": "1",
                "username": "user1"
              },
              "translations": [
                {
                  "language_code": "en",
                  "content": "Hello world"
                },
                {
                  "language_code": "fr",
                  "content": "Bonjour le monde"
                }
              ],
              "content": "Hello world",
              "createdAt": "2021-09-08T09:22:58.000Z",
              "updatedAt": "2021-09-08T09:22:58.000Z"
            },
            {
              "id": "2",
              "user": {
                "clientId": "2",
                "username": "user2"
              },
              "translations": [
                {
                  "language_code": "en",
                  "content": "Hello world"
                },
                {
                  "language_code": "fr",
                  "content": "Bonjour le monde"
                }
              ],
              "content": "Bonjour le monde",
              "createdAt": "2021-09-08T09:22:58.000Z",
              "updatedAt": "2021-09-08T09:22:58.000Z"
            }
            `,
        },
        {
          role: 'system',
          content:
            'if the messages passed in parameter already have translations, you must only add the missing translations or update the existing ones',
        },
        { role: 'user', content: JSON.stringify({ messages, languages }) },
      ],
    });

    try {
      const messagesTranslated: Message[] = JSON.parse(
        response.choices[0].message.content,
      ).messages;

      // Is there a missing translation?
      const missingTranslations = messagesTranslated.some((message) => {
        return message.translations.length < languages.length;
      });

      if (missingTranslations) {
        throw 'Missing some translations';
      }

      this.messages = messagesTranslated;

      this.server.emit('chat-messages-translates', {
        data: messagesTranslated,
      });
    } catch (error) {
      this.server.to(client.id).emit('chat-messages-translates', {
        error: 'Failed to translate message',
      });
    }
  }

  handleConnection(client: Socket) {
    const username = client.handshake.query.username;

    if (username == null || username == '') {
      this.server.to(client.id).emit('response', { error: 'Username not set' });
      client.disconnect();
      return;
    }

    // allow to register username only if it is not taken
    const usernameTaken = this.users.find((user) => user.username === username);
    if (usernameTaken) {
      this.server
        .to(client.id)
        .emit('response', { error: 'Username already taken' });
      client.disconnect();
      return;
    }

    // add connected client to the list
    this.users = [
      ...this.users,
      { clientId: client.id, username: String(username) },
    ];

    // notify all users about the new list of connected users
    this.server.emit('chat-client', this.users);

    // Notify the connected client successful registration
    this.server.to(client.id).emit('response', {
      data: { users: this.users, messages: this.messages },
    });
  }

  handleDisconnect(client: Socket) {
    // remove connected client from the list
    this.users = this.users.filter((user) => user.clientId !== client.id);

    // notify all users about the new list of connected users
    this.server.emit('chat-client', this.users);

    console.log('client disconnected', client.id);
  }
}
