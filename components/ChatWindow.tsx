// components/ChatWindow.tsx
import React, { Dispatch } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { ChatContextType, InitialMessageContext } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useFetchMessages } from "@/lib/queryHooks";

type Props = {
  messageDispatch: Dispatch<{ type: string; value: string | null }>;
  messageContext: InitialMessageContext;
  chatContext: ChatContextType;
  dispatch: Dispatch<{ type: string; value: number | null }>;
};

const ChatWindow = ({
  messageDispatch,
  messageContext,
  chatContext,
  dispatch,
}: Props) => {

  const {data,isPending}=useFetchMessages(chatContext)
  return (
    <div className="flex flex-col h-full rounded-xl bg-white">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={data?.data.messages || []}/>
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
