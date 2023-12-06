import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Message } from 'types/message';
import { LanguageCode } from 'types/translation';

@Injectable()
export class TranslationService {
  constructor(private readonly openai: OpenAI) {}

  async translateMessages(
    messages: Message[],
    languages: LanguageCode[],
  ): Promise<Message[]> {
    const prompt = `
      You are a skilled translator proficient in multiple languages.
    
      A user will provide you with two JSON objects. The first one is a list of Message objects, and the second one is a list of LanguageCode values.
      
      Here are the types you need to be aware of:
      
      ---
      enum LanguageCode {
        EN = 'en',
        FR = 'fr',
        // Add more language codes if needed
      }
      
      type Translation {
        languageCode: LanguageCode;
        content: string;
      }
    
      type Message {
        id: string;
        translations: Translation[];
        content: string;
      }
      ---
    
      Your task is to translate all the messages into the specified languages and provide a JSON list of Message objects with their translations included. Here's an example of the expected result:
    
      ---
      "messages": [
        {
          "id": "1",
          "translations": [
            {
              "languageCode": "en",
              "content": "Hello world"
            },
            {
              "languageCode": "fr",
              "content": "Bonjour le monde"
            },
            // Add translations for other languages as needed
          ],
          "content": "Hello world"
        }
      ]
      ---
    
      If the messages passed as parameters already have translations, you should only add the missing translations or update the existing ones.
    `;

    const formatedMessages = messages.map((message) => {
      return {
        id: message.id,
        translations: message.translations,
        content: message.content,
      };
    });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: JSON.stringify({ messages: formatedMessages, languages }),
        },
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

    // merge the translations with the original messages
    return messages.map((message) => {
      const messageTranslated = messagesTranslated.find(
        (messageTranslated) => messageTranslated.id === message.id,
      );

      if (messageTranslated) {
        message.translations = messageTranslated.translations;
      } else {
        throw 'Missing some translations';
      }

      return message;
    });
  }
}
