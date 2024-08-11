"use client";
import { ChatContextType, InitialMessageContext } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import React, { useState, FormEvent, Dispatch } from "react";

type Props = {
  messageDispatch: Dispatch<{ type: string; value: string }>;
  messageContext: InitialMessageContext;
  chatContext: ChatContextType;
  dispatch: Dispatch<{ type: string; value: number | null}>;
};
const ChatInput = ({
  messageDispatch,
  messageContext,
  chatContext,
  dispatch,
}: Props) => {
  const queryClient = useQueryClient();
  const handleSubmit = (): void => {
    handleSend();
  };
  const { mutate: handleSend, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          chat: {
            chatId: chatContext.currentChat,
            role: "user",
            content: messageContext.content,
          },
        }),
      });
      if (response) {
        queryClient.invalidateQueries({ queryKey: ["getMessages"] });
        messageDispatch({
          type: "changeMessage",
          value: "",
        });
        const data = await response.json();
        if (chatContext.currentChat === null) {
          dispatch({
            type: "changeChat",
            value: data.data.id,
          });
          queryClient.invalidateQueries({ queryKey: ["getChats"] });
        }
      }
      return response;
    },
  });

  return (
    <div className="py-4 px-20">
      <div className="flex justify-center">
        {isPending ? <LoaderCircle className="w-4 animate-spin" /> : null}
      </div>
      <div className="flex space-x-4">
        <input
          type="text"
          value={messageContext.content}
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
          onClick={handleSubmit}
          type="button"
          className="bg-black text-white py-2 px-4 hover:bg-white hover:text-black hover:border-2 rounded-xl hover:border-black"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
