import { ChatContext } from "@/app/chat/page";
import { useContext, useEffect, useState } from "react";

export default function Verificator() {
  const { selectedMessages, setSelectedMessages, socket } =
    useContext(ChatContext);

  const [loading, setLoading] = useState<boolean>(false);

  const disabled = selectedMessages.length == 0;

  const handleButtonClick = () => {
    socket?.emit("chat-messages-verifications", {
      messages: selectedMessages,
    });

    setLoading(true);

    setSelectedMessages([]);
  };

  useEffect(() => {
    socket?.on("chat-messages-verifications", (_) => {
      setLoading(false);
    });

    // Clean up
    return () => {
      socket?.off("chat-messages-verifications");
    };
  }, [socket]);

  return (
    <button
      className={`bg-indigo-500 disabled:bg-indigo-300 px-4 py-2 rounded-2xl text-white text-lg`}
      onClick={handleButtonClick}
      disabled={disabled}
    >
      Verify
    </button>
  );
}
