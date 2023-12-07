import { Message } from "@/types/message";
import { LanguageCode } from "@/types/translation";
import { User } from "@/types/user";
import { Dispatch, SetStateAction, createContext } from "react";
import { Socket } from "socket.io-client";

export const ChatContext = createContext<{
  user: User | null;
  socket: Socket | null;
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  selectedMessages: Message[];
  setSelectedMessages: Dispatch<SetStateAction<Message[]>>;
  selectedLanguages: LanguageCode[];
  setSelectedLanguages: Dispatch<SetStateAction<LanguageCode[]>>;
}>({
  user: null,
  socket: null,
  users: [],
  setUsers: () => {},
  messages: [],
  setMessages: () => {},
  selectedMessages: [],
  setSelectedMessages: () => {},
  selectedLanguages: [],
  setSelectedLanguages: () => {},
});
