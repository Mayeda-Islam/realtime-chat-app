import React from "react";
import { ConversationUser } from "../conversation/ConversationItem";

interface ChatHeaderProps {
  activeUser: ConversationUser;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ activeUser }) => {
  return (
    <header className="p-4 bg-surface border-b border-border flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={activeUser.avatar}
            alt={activeUser.name}
            className="w-10 h-10 rounded-full object-cover border border-border"
          />
          {activeUser.type !== "group" && (
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${
                activeUser.status === "online" ? "bg-success" : "bg-text-muted"
              }`}
            />
          )}
        </div>
        <div>
          <h2 className="text-base font-semibold text-text">
            {activeUser.name}
          </h2>
          <p className="text-xs text-text-secondary">
            {activeUser.type === "group"
              ? "Group Conversation"
              : activeUser.status === "online"
              ? "Active Now"
              : "Offline"}
          </p>
        </div>
      </div>
    </header>
  );
};