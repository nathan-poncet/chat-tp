import { Translation } from './translation';
import { User } from './user';

export enum MessageVerificationStatus {
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  UNVERIFIED = 'UNVERIFIED',
}

export enum MessageType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
}

export type Message =
  | {
      id: string;
      type: MessageType.TEXT;
      user: User;
      translations: Translation[];
      content: string;
      createdAt: string;
      updatedAt: string;
      verificationStatus: MessageVerificationStatus;
      reason: string;
    }
  | {
      id: string;
      type: MessageType.AUDIO;
      user: User;
      translations: Translation[];
      buffer: Buffer;
      content: string;
      createdAt: string;
      updatedAt: string;
      verificationStatus: MessageVerificationStatus;
      reason: string;
    };
