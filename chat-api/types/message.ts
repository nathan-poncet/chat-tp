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

export type Message = {
  id: string;
  type: MessageType;
  user: User;
  translations: Translation[];
  content: string;
  createdAt: string;
  updatedAt: string;
  verificationStatus: MessageVerificationStatus;
};
