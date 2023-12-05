import { Translation } from './translation';
import { User } from './user';

export type Message = {
  id: string;
  user: User;
  translations: Translation[];
  content: string;
  createdAt: string;
  updatedAt: string;
};
