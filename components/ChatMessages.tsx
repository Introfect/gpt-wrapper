// components/ChatMessages.tsx
import React, { useEffect, useMemo, useRef } from 'react';

export type  Message= {
    chatId:string
    content:string
    createdAt:string
    id:string
    role:"user"|"system"
}
type Props={
messages:Message[]
}


const ChatMessages = ({messages}:Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <ul className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages?.map((message) => (
      <li 
        key={message.id} 
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <span
          className={`max-w-[50%] w-fit p-3 rounded-xl ${
            message.role === 'user' 
              ? 'border-2 text-black' 
              : 'bg-gray-200 text-black'
          }`}
        >
          <p className="break-words">{message.content}</p>
        </span>
      </li>
    ))}
    <div ref={messagesEndRef} />
  </ul>
  );
};

export default ChatMessages;