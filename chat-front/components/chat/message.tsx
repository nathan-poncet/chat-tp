"use client";
import { ChatContext } from "@/app/chat/page";
import { Message } from "@/types/message";
import { useContext, useState } from "react";

export default function ChatMessage({ message }: { message: Message }) {
  const { user, selectedMessages, setSelectedMessages } =
    useContext(ChatContext);

  const [displaytranslations, setDisplayTranslations] =
    useState<boolean>(false);

  const messageIsSelected = selectedMessages.some(
    (selectedMessage) => selectedMessage.id == message.id
  );

  const handleClick = () => {
    setSelectedMessages((prevMessages) => {
      if (messageIsSelected) {
        return prevMessages.reduce(
          (acc: Message[], value: Message) =>
            value.id == message.id ? acc : [...acc, value],
          []
        );
      } else return [...prevMessages, message];
    });
  };

  if (user == null) return null;

  return (
    <div
      className={
        user.username != message.user.username
          ? "col-start-1 col-end-8 p-3 rounded-lg"
          : "col-start-6 col-end-13 p-3 rounded-lg"
      }
    >
      <div
        className={
          user.username != message.user.username
            ? "flex flex-col items-start"
            : "flex flex-col items-end"
        }
      >
        <div className="flex items-center justify-center rounded-full text-indigo-500 flex-shrink-0 py-2 font-bold">
          {message.user.username}
        </div>
        <div
          className={`relative text-sm bg-white py-2 px-4 shadow rounded-xl border 
          ${messageIsSelected ? "border-indigo-500" : ""} 
          ${user.username == message.user.username ? "text-right" : ""}`}
          onClick={handleClick}
        >
          {/* Display Content */}
          <div>{message.content}</div>

          {/* Display Date */}
          <div className="text-xs text-gray-400">
            {new Date(message.createdAt).toLocaleDateString()}
          </div>

          {/* Display Translation */}
          {message.translations.length > 0 && (
            <>
              <button
                className="text-xs text-gray-400 underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setDisplayTranslations((display) => !display)}}
              >
                {displaytranslations
                  ? "Hide translations"
                  : "Display translations"}
              </button>

              {displaytranslations &&
                message.translations.map((translation, _) => (
                  <div
                    className="text-xs text-gray-400"
                    key={translation.language_code}
                  >
                    {translation.language_code}: {translation.content}
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
