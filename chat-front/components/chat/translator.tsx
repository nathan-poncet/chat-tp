import { ChatContext } from "@/app/chat/page";
import { LanguageCode } from "@/types/translation";
import { useContext, useEffect, useState } from "react";

export default function ChatTranslator({}: {}) {
  const {
    selectedMessages,
    setSelectedMessages,
    selectedLanguages,
    setSelectedLanguages,
    socket,
  } = useContext(ChatContext);

  const [loading, setLoading] = useState<boolean>(false);

  const disabled =
    selectedMessages.length == 0 || selectedLanguages.length == 0 || loading;

  const handleButtonClick = () => {
    socket?.emit("chat-messages-translates", {
      messages: selectedMessages,
      languages: selectedLanguages,
    });

    setLoading(true);

    setSelectedMessages([]);
    setSelectedLanguages([]);

    setLoading(true);
  };

  useEffect(() => {
    socket?.on("chat-messages-translates", (_) => {
      setLoading(false);
    });

    // Clean up
    return () => {
      socket?.off("chat-messages-translates");
    };
  }, [socket]);

  return (
    <button
      className={`bg-indigo-500 disabled:bg-indigo-300 px-4 py-2 rounded-2xl text-white text-lg`}
      onClick={handleButtonClick}
      disabled={disabled}
    >
      {loading ? "Loading..." : "Translate"}
    </button>
  );
}
