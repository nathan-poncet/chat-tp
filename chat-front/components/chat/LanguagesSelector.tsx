import { ChatContext } from "@/libs/contexts/ChatContext";
import { LanguageCode } from "@/types/translation";
import { useContext } from "react";

export default function LanguagesSelector() {
  const { selectedMessages, selectedLanguages, setSelectedLanguages, socket } =
    useContext(ChatContext);

  const disabled = selectedMessages.length == 0;

  const handleClick = (language: LanguageCode) => {
    setSelectedLanguages((prevLanguages) => {
      if (prevLanguages.includes(language)) {
        return prevLanguages.filter((prevLanguage) => prevLanguage != language);
      } else return [...prevLanguages, language];
    });
  };

  if (disabled) return null;

  return (
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
          onClick={() => handleClick(language)}
        >
          {language}
        </button>
      ))}
    </div>
  );
}
