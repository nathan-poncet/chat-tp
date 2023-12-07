import { useContext, useEffect, useRef } from "react";
import { Message } from "@/types/message";
import ChatMessage from "@/components/chat/Message";
import { ChatContext } from "@/libs/contexts/ChatContext";

export default function Messages() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { socket, user, messages, setMessages } = useContext(ChatContext);

  useEffect(() => {
    // Listen for incoming messages
    socket?.on("chat-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket?.on(
      "chat-audio",
      ({ data: message, error }: { data: Message; error: any }) => {
        if (error) {
          alert(error);
          return;
        }

        setMessages((prevMessages) => [...prevMessages, message]);
      }
    );

    socket?.on(
      "chat-messages-translates",
      ({ data: messages, error }: { data: Message[]; error: any }) => {
        if (error) {
          alert(error);
          return;
        }

        setMessages((prevMessages) =>
          prevMessages.map(
            (prevMessage) =>
              messages.find((message) => message.id == prevMessage.id) ??
              prevMessage
          )
        );
      }
    );

    socket?.on(
      "chat-messages-verifications",
      ({ data: messages, error }: { data: Message[]; error: any }) => {
        if (error) {
          alert(error);
          return;
        }

        setMessages((prevMessages) =>
          prevMessages.map(
            (prevMessage) =>
              messages.find((message) => message.id == prevMessage.id) ??
              prevMessage
          )
        );
      }
    );

    // Clean up
    return () => {
      socket?.off("chat-message");
      socket?.off("chat-audio");
      socket?.off("chat-messages-translates");
      socket?.off("chat-messages-verifications");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("messages", messages);
    if (chatContainerRef.current == null) return;
    console.log("messages", messages);
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="flex flex-col h-full overflow-y-auto mb-4"
    >
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-12 gap-y-2 pb-20">
          {messages.map((message, _) =>
            user != null ? (
              <ChatMessage
                key={user.clientId ?? "" + message.id}
                message={message}
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
