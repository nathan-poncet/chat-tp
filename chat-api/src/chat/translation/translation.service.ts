// translation.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Message } from 'types/message';
import { LanguageCode } from 'types/translation';

@Injectable()
export class TranslationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async translateMessages(
    messages: Message[],
    languages: LanguageCode[],
  ): Promise<Message[]> {
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

    return messagesTranslated;
  }
}
