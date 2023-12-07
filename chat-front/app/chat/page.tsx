"use client";

import { Message } from "@/types/message";
import { User } from "@/types/user";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Socket, io } from "socket.io-client";
import ChatUsers from "@/libs/components/chat/Users";
import ChatForm from "@/libs/components/chat/Form";
import ChatMessages from "@/libs/components/chat/Messages";
import ChatTranslator from "@/libs/components/chat/Translator";
import ChatVerificator from "@/libs/components/chat/Verificator";
import { LanguageCode } from "@/types/translation";
import ChatLanguagesSelector from "@/libs/components/chat/LanguagesSelector";

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
  translationLoading: boolean;
  setTranslationLoading: Dispatch<SetStateAction<boolean>>;
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
  translationLoading: false,
  setTranslationLoading: () => {},
});

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>(
    []
  );
  const [translationLoading, setTranslationLoading] = useState<boolean>(false);

  const connect_to_chat = (username: string) => {
    const socket = io("http://localhost:3000", { query: { username } });
    setSocket(socket);

    socket.once("response", ({ data: { users, messages }, error: error }) => {
      if (error) {
        alert(error);
        return;
      } else if (users == null || messages == null) {
        alert("Unexpected error");
        return;
      }

      // Set user, users and messages
      setUser({ username, clientId: socket.id });
      setUsers(users);
      setMessages(messages);
    });

    return () => {
      socket.close();
      setSocket(null);
    };
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        socket,
        users,
        setUsers,
        messages,
        setMessages,
        selectedMessages,
        setSelectedMessages,
        selectedLanguages,
        setSelectedLanguages,
        translationLoading,
        setTranslationLoading,
      }}
    >
      <div className="flex h-screen antialiased text-gray-800">
        {user == null ? (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Connect toi</h1>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                connect_to_chat(username);
              }}
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
              />
              <button
                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-row h-full w-full overflow-x-hidden p-6 gap-6">
            <ChatUsers />
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 p-4">
              <ChatMessages />
              <div className="relative flex justify-center">
                <div className="absolute bottom-full py-4">
                  <div className="spacer-y-2">
                    <div className="flex justify-center gap-4">
                      <ChatVerificator />
                      <div className="w-px bg-gray-300"></div>
                      <ChatTranslator />
                    </div>
                    <ChatLanguagesSelector />
                  </div>
                </div>
                <ChatForm />
              </div>
            </div>
          </div>
        )}
      </div>
    </ChatContext.Provider>
  );
}
