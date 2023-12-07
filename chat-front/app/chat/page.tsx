"use client";

import { Message } from "@/types/message";
import { User } from "@/types/user";
import { useState } from "react";
import { Socket, io } from "socket.io-client";
import Users from "@/components/chat/Users";
import Form from "@/components/chat/Form";
import Messages from "@/components/chat/Messages";
import Translator from "@/components/chat/Translator";
import Verificator from "@/components/chat/Verificator";
import { LanguageCode } from "@/types/translation";
import LanguagesSelector from "@/components/chat/LanguagesSelector";
import Suggestor from "@/components/chat/Suggestor";
import { ChatContext } from "@/libs/contexts/ChatContext";

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

  const connect_to_chat = (username: string) => {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL ?? "", {
      query: { username },
    });
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
          <div className="flex flex-col md:flex-row h-full w-full overflow-x-hidden p-6 gap-6">
            <Users />
            <div className="flex flex-col h-full w-full rounded-2xl bg-gray-100 p-4 overflow-hidden">
              <Messages />
              <div className="relative flex justify-center">
                <div className="absolute bottom-full py-4">
                  <div className="spacer-y-2">
                    <div className="flex justify-center gap-4">
                      <Verificator />
                      <div className="w-px bg-gray-300"></div>
                      <Translator />
                      <div className="w-px bg-gray-300"></div>
                      <Suggestor />
                    </div>
                    <LanguagesSelector />
                  </div>
                </div>
                <Form />
              </div>
            </div>
          </div>
        )}
      </div>
    </ChatContext.Provider>
  );
}
