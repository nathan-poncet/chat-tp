import { Translation } from './translation';
import { User } from './user';

export enum MessageVerificationStatus {
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  UNVERIFIED = 'UNVERIFIED',
}

export type Message = {
  id: string;
  user: User;
  translations: Translation[];
  content: string;
  createdAt: string;
  updatedAt: string;
  verificationStatus: MessageVerificationStatus;
};
