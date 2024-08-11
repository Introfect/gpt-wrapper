// components/ChatWindow.tsx
import React from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { ChatContextType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
type Props = {
    messageDispatch:any,
    messageContext:any
  chatContext: ChatContextType;
  dispatch:any
};
const ChatWindow = ({ messageDispatch,messageContext,chatContext,dispatch }: Props) => {
  const fetchMessages = async (chatId: number | null) => {
    const response = await fetch("/api/message/get-chat-messages", {
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
