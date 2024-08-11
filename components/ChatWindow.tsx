// components/ChatWindow.tsx
import React, { Dispatch } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { ChatContextType, InitialMessageContext } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
type Props = {
    messageDispatch:Dispatch<{ type: string; value: string }>;
    messageContext:InitialMessageContext
  chatContext: ChatContextType;
  dispatch:Dispatch<{ type: string; value: number | null}>
};
const ChatWindow = ({ messageDispatch,messageContext,chatContext,dispatch }: Props) => {
  const fetchMessages = async (chatId: number | null) => {
    const response = await fetch("/api/message/getChatMessages", {
      method: "POST",
      body: JSON.stringify({
        chatId: chatId,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }
    return response.json();
  };
  fetchMessages(chatContext.currentChat);
  const { data, isPending } = useQuery({
    queryKey: ["getMessages", chatContext.currentChat],
    queryFn: async () => await fetchMessages(chatContext.currentChat),
  });
console.log(data?.data?.messages)
  return (
    <div className="flex flex-col h-full rounded-xl bg-white">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={data?.data?.messages} />
      </div>
      <ChatInput 
      messageDispatch={messageDispatch} 
      messageContext={messageContext}
      chatContext={chatContext}
      dispatch={dispatch}
      />
    </div>
  );
};

export default ChatWindow;
