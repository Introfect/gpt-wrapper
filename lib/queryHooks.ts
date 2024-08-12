import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { ChatContextType, InitialMessageContext } from "./types";
import { Dispatch } from "react";
type SendMessageProp = {
  chatContext: ChatContextType;
  messageContext: InitialMessageContext;
  queryClient: QueryClient;
  messageDispatch: Dispatch<{ type: string; value: string | null }>;
  dispatch: Dispatch<{ type: string; value: number | null }>;
};
type ResponseSendMessage = {
  data: {
    data: string;
    id: number;
  };
};
type ResponseMessages = {
  data: {
    messages: [];
  };
};
type ResponseChats = {
  data: {
    chats: [];
  };
};
export function useSendMessages({
  chatContext,
  messageContext,
  queryClient,
  messageDispatch,
  dispatch,
}: SendMessageProp) {
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

      return (await response.json()) as ResponseSendMessage;
    },
    onSuccess: (response) => {
      console.log(response);
      const data = response;
      messageDispatch({
        type: "changeMessage",
        value: null,
      });
      if (chatContext.currentChat === null) {
        dispatch({
          type: "changeChat",
          value: data.data.id,
        });
        queryClient.invalidateQueries({ queryKey: ["getChats"] });
      }
      queryClient.invalidateQueries({ queryKey: ["getMessages"] });
    },
  });

  return { handleSend, isPending };
}

export function useFetchMessages(chatContext: ChatContextType) {
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
    return await response.json() as ResponseMessages;
  };
  const { data, isPending } = useQuery({
    queryKey: ["getMessages", chatContext.currentChat],
    queryFn: async () => await fetchMessages(chatContext.currentChat),
  });
  console.log(data);
  return { data, isPending };
}

export function useFetchChats() {
  const fetchChats = async () => {
    const response = await fetch("/api/chat");
    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }
    return (await response.json()) as ResponseChats;
  };
  const { data, isFetching } = useQuery({
    queryKey: ["getChats"],
    queryFn: fetchChats,
  });
  console.log(data);
  return { data, isFetching };
}
