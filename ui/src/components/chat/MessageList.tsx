import React, { useEffect, useRef } from "react";
import { MessageBubble, Message } from "./MessageBubble";



export const MessageList: React.FC<{ messages: Message[]; isGroup?: boolean ,currentUserId?:number}> = ({
  messages,currentUserId,
  // isGroup,
}) => {
  console.log(messages,"from message list");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg}  currentUserId={currentUserId}/>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};