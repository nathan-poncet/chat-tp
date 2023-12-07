import { ChatContext } from "@/libs/contexts/ChatContext";
import { useContext, useEffect, useState } from "react";

export default function Suggestor() {
  const { socket } = useContext(ChatContext);
  const [loading, setLoading] = useState<boolean>(false);

  const disabled = loading;

  const handleClick = () => {
    socket?.emit("chat-message-suggestion");

    setLoading(true);
  };

  useEffect(() => {
    socket?.on("chat-message-suggestion", (_) => {
      setLoading(false);
    });

    // Clean up
    return () => {
      socket?.off("chat-message-suggestion");
    };
  }, [socket]);

  return (
    <button
      className={`bg-indigo-500 disabled:bg-indigo-300 px-2 py-1 rounded-2xl text-white text-lg`}
      onClick={handleClick}
      disabled={disabled}
    >
      {loading ? "Loading..." : "Suggest me a message"}
    </button>
  );
}
