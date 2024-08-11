import { ChatContextType } from "./types";

export default function chatReducer(
  changeChat: ChatContextType,
  action: { type: string; value: number | null }
) {
  switch (action.type) {
    case "changeChat": {
      const newChatValue = {
        currentChat: action.value,
      };
      return newChatValue;
    }
    default: {
      throw new Error("case not defined");
    }
  }
}
