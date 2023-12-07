import { Injectable } from '@nestjs/common';
import { OpenAIService } from 'src/openai/openai.service';
import { Message } from 'types/message';

@Injectable()
export class VerificationService {
  constructor(private readonly openaiService: OpenAIService) {}

  async verifyMessagesInformation(messages: Message[]): Promise<Message[]> {
    const prompt = `
      You are a chat message verifier with access to information.
      
      A user has provided you with a list of messages that need to be verified.
      Your goal is to determine if the information in each message is accurate.
      
      You should review each message and provide a verification result for each one.
      You have to be very careful about who send the message and the context of the conversation.
      If you see that some messages is linked to a previous message, you should take that into account.

      Moreover, you should provide a reason for each verification result.
      The reason should be a short sentence that explain why the message is accurate or not and it should be in the message language.

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

      Here's an exemple of the messages list you need to verify:

      ---

      [
        {
          "id": "1",
          "user": {
            "clientId": "1",
            "username": "John Doe"
          },
          "content": "Earth is flat!",
          "verificationStatus": "UNVERIFIED",
          "createdAt": "2021-10-01T00:00:00.000Z",
        },
        {
          "id": "2",
          "user": {
            "clientId": "2",
            "username": "Jane Doe"
          },
          "content": "No it's a sphere!",
          "verificationStatus": "UNVERIFIED",
          "createdAt": "2021-10-02T00:00:00.000Z",
        },
        {
          "id": "3",
          "user": {
            "clientId": "3",
            "username": "John Doe"
          },
          "content": "No i'm sure it's flat!",
          "verificationStatus": "UNVERIFIED",
          "createdAt": "2021-10-03T00:00:00.000Z",
        }
      ]

      ---

      Here's an example of the expected result messages list:

      ---

      "messages": [
        {
          "id": "1",
          "verificationStatus": "REJECTED",
          "reason": "The Earth is a sphere, not flat!"
        },
        {
          "id": "2",
          "verificationStatus": "VERIFIED",
          "reason": "The Earth is a sphere!"
        },
        {
          "id": "3",
          "verificationStatus": "REJECTED",
          "reason": "The Earth is a sphere, not flat!"
        }
      ]

      ---

      You can't unverify a message

      Respond with only a JSON list of Message objects with their verification status included.
    `;

    const formatedMessages = messages.map((message) => ({
      id: message.id,
      user: message.user,
      content: message.content,
      verificationStatus: message.verificationStatus,
      createdAt: message.createdAt,
    }));

    const sortedMessages = formatedMessages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const response = await this.openaiService.chatCompletionsJSON(
      prompt,
      JSON.stringify({ messages: sortedMessages }),
    );

    const messagesVerified = JSON.parse(response).messages;

    // merge the translations with the original messages
    return messages.map((message) => {
      const messageVerified = messagesVerified.find(
        (messageVerified) => messageVerified.id === message.id,
      );

      if (messageVerified) {
        message.verificationStatus = messageVerified.verificationStatus;
        message.reason = messageVerified.reason;
      } else {
        throw 'Missing some verifications';
      }

      return message;
    });
  }
}
