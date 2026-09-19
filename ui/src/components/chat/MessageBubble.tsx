import React from "react";

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
}

interface MessageBubbleProps {
  message: Message;
  isGroup?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isGroup,
}) => {
  const isMe = message.senderId === "me";

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      {!isMe && isGroup && message.senderName && (
        <span className="text-xs text-text-muted mb-1 px-1">
          {message.senderName}
        </span>
      )}
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
          isMe
            ? "bg-primary text-surface rounded-br-xs"
            : "bg-surface border border-border text-text rounded-bl-xs"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
      </div>
      <span className="text-[11px] text-text-muted mt-1 px-1">
        {message.timestamp}
      </span>
    </div>
  );
};