"use client";
import React, { useReducer, useState } from "react";
import ChatList, { Chat } from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useQuery } from "@tanstack/react-query";
import chatReducer from "@/lib/chatReducer";
import { ChatContextType, InitialMessageContext } from "@/lib/types";
import messageReducer from "@/lib/messageReducer";
import { useFetchChats } from "@/lib/queryHooks";
const initialChatContext: ChatContextType = {
  currentChat: null,
};
const initialMessageContext: InitialMessageContext = {
  content: null,
};
const GptWindow: React.FC = () => {
  const [isChatListVisible, setIsChatListVisible] = useState<boolean>(false);
  const [chatContext, dispatch] = useReducer(chatReducer, initialChatContext);
  const [messageContext, messageDispatch] = useReducer(
    messageReducer,
    initialMessageContext
  );

  const toggleChatList = (): void => {
    setIsChatListVisible(!isChatListVisible);
  };
  const { data, isFetching } = useFetchChats();

  return (
    <div className="flex h-screen bg-black/90 text-orange-500">
      <div
        className={`w-80 md:w-1/5${
          isChatListVisible ? "block" : "hidden"
        } md:block transition-all duration-300 ease-in-out overflow-y-auto`}
      >
        <div className=" flex z-20  justify-between items-center px-6 border-b border-white/20 pb-4 mt-10">
          <h2 className="text-xl font-bold">Chats</h2>
          <button
            type="button"
            onClick={() => {
              dispatch({
                type: "changeChat",
                value: null,
              });
            }}
          >
            New Chat
          </button>
        </div>
        <ChatList
          isFetching={isFetching}
          chatContext={chatContext}
          dispatch={dispatch}
          data={data?.data.chats || []}
        />
      </div>
      <div className="flex-1">
        <button
        type="button"
          className="md:hidden absolute top-4 left-4 z-10 bg-orange-500 text-black p-2 rounded"
          onClick={toggleChatList}
        >
          {isChatListVisible ? "Hide" : "Show"} Chats
        </button>
        <div className="px-4 h-screen py-6">
          <ChatWindow
            messageDispatch={messageDispatch}
            messageContext={messageContext}
            chatContext={chatContext}
            dispatch={dispatch}
          />
        </div>
      </div>
    </div>
  );
};

export default GptWindow;
