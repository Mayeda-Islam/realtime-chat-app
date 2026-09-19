import React, { useEffect, useRef } from "react";
import { MessageBubble, Message } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isGroup?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isGroup,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} isGroup={isGroup} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};