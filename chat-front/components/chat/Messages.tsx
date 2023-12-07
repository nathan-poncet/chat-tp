import { ChatContext } from "@/app/chat/page";
import { useContext, useEffect } from "react";
import { Message } from "@/types/message";
import ChatMessage from "@/components/chat/Message";

export default function Messages() {
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
      socket?.off("chat-messages-translates");
      socket?.off("chat-messages-verifications");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full overflow-x-auto mb-4">
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-12 gap-y-2">
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
