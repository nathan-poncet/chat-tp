"use client";

import ChatUsers from "@/components/chat/users";
import ChatForm from "@/components/chat/form";
import ChatMessages from "@/components/chat/messages";
import { Message } from "@/types/message";
import { User } from "@/types/user";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Socket, io } from "socket.io-client";
import ChatTranslator from "@/components/chat/translator";

export const ChatContext = createContext<{
  user: User | null;
  socket: Socket | null;
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  selectedMessages: Message[];
  setSelectedMessages: Dispatch<SetStateAction<Message[]>>;
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
            <div className="flex flex-col flex-auto h-full space-y-2">
              <ChatTranslator />
              <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 p-4">
                <ChatMessages />
                <ChatForm />
              </div>
            </div>
          </div>
        )}
      </div>
    </ChatContext.Provider>
  );
}