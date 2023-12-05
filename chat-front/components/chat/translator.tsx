import { ChatContext } from "@/app/chat/page";
import { LanguageCode } from "@/types/translation";
import { useContext, useState } from "react";

export default function ChatTranslator({}: {}) {
  const {
    selectedMessages,
    setSelectedMessages,
    socket,
    translationLoading,
    setTranslationLoading,
  } = useContext(ChatContext);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>(
    []
  );

  if (selectedMessages.length == 0 && translationLoading == false) return null;

  const handleLanguageClick = (language: LanguageCode) => {
    setSelectedLanguages((prevLanguages) => {
      if (prevLanguages.includes(language)) {
        return prevLanguages.filter((prevLanguage) => prevLanguage != language);
      } else return [...prevLanguages, language];
    });
  };

  const handleButtonClick = () => {
    socket?.emit("chat-messages-translates", {
      messages: selectedMessages,
      languages: selectedLanguages,
    });

    setSelectedMessages([]);
    setSelectedLanguages([]);

    setTranslationLoading(true);
  };

  return (
    <div
      className={`flex justify-between rounded-2xl p-4 gap-4 ${
        translationLoading ? "bg-indigo-500" : "bg-gray-100"
      }`}
    >
      {translationLoading ? (
        <p className="text-white">Translation Loading...</p>
      ) : (
        <>
          <div className="flex flex-wrap rounded-2xl bg-gray-100 p-4 gap-2">
            {Object.values(LanguageCode).map((language) => (
              <button
                key={language}
                className={`border border-indigo-500 px-2 rounded-2xl ${
                  selectedLanguages.some(
                    (selectedLanguage) => selectedLanguage == language
                  )
                    ? "bg-indigo-500 text-white"
                    : ""
                }`}
                onClick={() => handleLanguageClick(language)}
              >
                {language}
              </button>
            ))}
          </div>
          <button
            className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 rounded-xl text-white px-4 py-1 flex-shrink-0"
            onClick={handleButtonClick}
            disabled={selectedLanguages.length == 0}
          >
            Translate
          </button>
        </>
      )}
    </div>
  );
}
