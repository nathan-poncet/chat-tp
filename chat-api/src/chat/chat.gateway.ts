import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Message, MessageType, MessageVerificationStatus } from 'types/message';
import { LanguageCode } from 'types/translation';
import { MessageService } from './message/message.service';
import { UserService } from './user/user.service';
import { TranslationService } from './translation/translation.service';
import { VerificationService } from './verification/verification.service';
import { TranscriptionService } from './transcription/transcription.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Socket;

  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly translationService: TranslationService,
    private readonly verificationService: VerificationService,
    private readonly transcriptionService: TranscriptionService,
  ) {}

  @SubscribeMessage('chat-audio')
  async handleAudio(client: Socket, audio: Buffer) {
    try {
      const { buffer, content } =
        await this.transcriptionService.transcriptAudio(audio);

      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: MessageType.AUDIO,
        user: this.userService.getUserByClientId(client.id),
        translations: [],
        buffer,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        verificationStatus: MessageVerificationStatus.UNVERIFIED,
      };

      this.messageService.addMessages([newMessage]);

      this.server.emit('chat-audio', { data: newMessage });
    } catch (error) {
      console.error(error);

      this.server.to(client.id).emit('chat-audio', {
        error: 'Failed to transcript audio',
      });
    }
  }

  @SubscribeMessage('chat-message')
  handleMessage(client: Socket, payload: string) {
    const user = this.userService.getUserByClientId(client.id);

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: MessageType.TEXT,
      user,
      translations: [],
      content: payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verificationStatus: MessageVerificationStatus.UNVERIFIED,
    };

    this.messageService.addMessages([newMessage]);

    this.server.emit('chat-message', newMessage);
  }

  @SubscribeMessage('chat-messages-translates')
  async handleMessagesTranslates(
    client: Socket,
    payload: { messages: Message[]; languages: LanguageCode[] },
  ) {
    const { messages, languages } = payload;

    try {
      const messagesTranslated =
        await this.translationService.translateMessages(messages, languages);

      this.messageService.updateMessages(messagesTranslated);

      this.server.emit('chat-messages-translates', {
        data: messagesTranslated,
      });
    } catch (error) {
      this.server.to(client.id).emit('chat-messages-translates', {
        error: 'Failed to translate message',
      });
    }
  }

  @SubscribeMessage('chat-messages-verifications')
  async handleMessagesVerifications(
    client: Socket,
    payload: { messages: Message[] },
  ) {
    const { messages } = payload;

    try {
      const messagesVerified =
        await this.verificationService.verifyMessagesInformation(messages);

      this.messageService.updateMessages(messagesVerified);

      this.server.emit('chat-messages-verifications', {
        data: messagesVerified,
      });
    } catch (error) {
      this.server.to(client.id).emit('chat-messages-verifications', {
        error: 'Failed to verify messages',
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

    if (typeof username !== 'string') {
      this.server
        .to(client.id)
        .emit('response', { error: 'Username must be a string' });
      client.disconnect();
      return;
    }

    const usernameTaken = this.userService.isUsernameTaken(username);

    if (usernameTaken) {
      this.server
        .to(client.id)
        .emit('response', { error: 'Username already taken' });
      client.disconnect();
      return;
    }

    // add connected client to the list
    this.userService.addUser({
      clientId: client.id,
      username,
    });

    const users = this.userService.getAllUsers();
    const messages = this.messageService.getAllMessages();

    // notify all users about the new list of connected users
    this.server.emit('chat-client', users);

    // Notify the connected client successful registration
    this.server.to(client.id).emit('response', { data: { users, messages } });
  }

  handleDisconnect(client: Socket) {
    // remove connected client from the list
    this.userService.removeUser(client.id);

    const users = this.userService.getAllUsers();

    // notify all users about the new list of connected users
    this.server.emit('chat-client', users);
  }
}
