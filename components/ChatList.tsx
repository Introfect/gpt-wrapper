// components/ChatList.tsx
import { ChatContextType } from '@/lib/types';
import React from 'react';

interface Chat {
  id: number;
  chatTopic: string;
  createdAt:string
}
type Props = {
  chatContext:ChatContextType
    dispatch:any,
    data:Chat[]
}

function ChatList({chatContext,dispatch,data}: Props) {
  return (
    <div className="h-full p-4 ">
    <ul>
      {data?.map((chat) => (
        <li
        onClick={()=>dispatch({
            type:"changeChat",
            value:chat.id
        })}
        key={chat.id} className={`mb-2 p-2 text-white text-sm antialiased hover:bg-white/20 cursor-pointer rounded ${chat.id==chatContext.currentChat?'bg-white/20 isolate ring-1 ring-black/5 transpa':null}`}>
          {chat.chatTopic}
        </li>
      ))}
    </ul>
  </div>
  )
}

export default ChatList