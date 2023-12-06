import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Message } from 'types/message';

@Injectable()
export class VerificationService {
  constructor(private readonly openai: OpenAI) {}

  async verifyMessagesInformation(messages: Message[]): Promise<Message[]> {
    const prompt = `
      You are a message verifier with access to information.
      
      A user has provided you with a list of messages that need to be verified.
      Your goal is to determine if the information in each message is accurate.
      
      You should review each message and provide a verification result for each one.

      Here are the types you need to be aware of:

      ---

      type User = {
        clientId: string;
        username: string;
      };
      
      enum MessageVerificationStatus {
        VERIFIED = 'VERIFIED',
        REJECTED = 'REJECTED',
        UNVERIFIED = 'UNVERIFIED',
      }
      
      type Message = {
        id: string;
        user: User;
        content: string;
        verificationStatus: MessageVerificationStatus;
      };

      ---

      Here's an example of the expected result messages list:

      ---

      "messages": [
        {
          "id": "1",
          "verificationStatus": "VERIFIED"
        },
        {
          "id": "2",
          "verificationStatus": "REJECTED"
        },
        {
          "id": "3",
          "verificationStatus": "VERIFIED"
        }
      ]

      ---

      You can't unverify a message

      Respond with only a JSON list of Message objects with their verification status included.
    `;

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
          content: JSON.stringify({ messages }),
        },
      ],
    });

    const messagesVerified = JSON.parse(
      response.choices[0].message.content,
    ).messages;

    // merge the translations with the original messages
    return messages.map((message) => {
      const messageVerified = messagesVerified.find(
        (messageVerified) => messageVerified.id === message.id,
      );

      if (messageVerified) {
        message.verificationStatus = messageVerified.verificationStatus;
      } else {
        throw 'Missing some verifications';
      }

      return message;
    });
  }
}
