"use client";
import { useSendMessages } from "@/lib/queryHooks";
import { ChatContextType, InitialMessageContext } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import React, { Dispatch } from "react";

type Props = {
  messageDispatch: Dispatch<{ type: string; value: string | null }>;
  messageContext: InitialMessageContext;
  chatContext: ChatContextType;
  dispatch: Dispatch<{ type: string; value: number | null }>;
};
const ChatInput = ({
  messageDispatch,
  messageContext,
  chatContext,
  dispatch,
}: Props) => {
  const queryClient = useQueryClient();
  const { handleSend, isPending } = useSendMessages({
    chatContext,
    messageContext,
    queryClient,
    messageDispatch,
    dispatch,
    onSuccess(response) {
      if (chatContext.currentChat===null) {
        dispatch({
          type: "changeChat",
          value: response.data.id,
        });
      }
      messageDispatch({
        type: "changeMessage",
        value: null,
      });
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="py-4 px-20">
      <div className="flex justify-center">
        {isPending ? <LoaderCircle className="w-4 animate-spin" /> : null}
      </div>
      <form onSubmit={(e) => handleSubmit(e)} className="flex space-x-4">
        <input
          type="text"
          value={messageContext.content === null ? "" : messageContext.content}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            messageDispatch({
              type: "changeMessage",
              value: e.target.value,
            })
          }
          className="flex-1 p-2 rounded-xl border-gray-200 border-2 focus:outline-none"
          placeholder="Type your message..."
        />
        <button
        disabled={isPending}
          type="submit"
          className={`bg-black text-white py-2 px-4 hover:bg-white cursor hover:text-black hover:border-2 rounded-xl hover:border-black ${isPending?'cursor-not-allowed bg-black/50 hover:bg-black/50 hover:border-none hover:text-white':null}`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
