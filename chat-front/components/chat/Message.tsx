"use client";

import { ChatContext } from "@/app/chat/page";
import { useContext, useState } from "react";
import { Message, MessageVerificationStatus } from "@/types/message";

export default function Message({ message }: { message: Message }) {
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
          {/* Verification status */}
          <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 text-xs ">
            {message.verificationStatus ==
              MessageVerificationStatus.VERIFIED && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-semibold bg-green-100 border border-gray-200 rounded-full text-green-500">
                <svg
                  className="w-2.5 h-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
              </span>
            )}
            {message.verificationStatus ==
              MessageVerificationStatus.REJECTED && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-semibold bg-red-100 border border-gray-200 rounded-full text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  fill="currentColor"
                  className="w-2.5 h-2.5"
                  version="1.1"
                  id="Capa_1"
                  viewBox="0 0 490 490"
                  xmlSpace="preserve"
                >
                  <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490   489.292,457.678 277.331,245.004 489.292,32.337 " />
                </svg>
              </span>
            )}
          </div>

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
                  setDisplayTranslations((display) => !display);
                }}
              >
                {displaytranslations
                  ? "Hide translations"
                  : "Display translations"}
              </button>

              {displaytranslations &&
                message.translations.map((translation, _) => (
                  <div
                    className="text-xs text-gray-400"
                    key={translation.languageCode}
                  >
                    {translation.languageCode}: {translation.content}
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
