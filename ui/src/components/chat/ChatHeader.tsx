import React from "react";
import { ConversationUser } from "../conversation/ConversationItem";

interface ChatHeaderProps {
  activeUser: ConversationUser;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ activeUser }) => {
  console.log(activeUser);
  return (
    <header className="p-4 bg-surface border-b border-border flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {activeUser?.avatar == null ? (
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/30 to-secondary/30 text-primary font-bold flex items-center justify-center text-sm ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
            {activeUser?.username
              ? activeUser.username.charAt(0).toUpperCase()
              : activeUser?.email?.charAt(0).toUpperCase()}
          </div>
        ) : (
          <img
            src={activeUser?.avatar}
            alt={activeUser?.username}
            className="w-12 h-12 rounded-full object-cover border border-border"
          />
        )}
          {/* {activeUser.type !== "group" && (
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${
                activeUser.status === "online" ? "bg-success" : "bg-text-muted"
              }`}
            />
          )} */}
        </div>
        <div>
          <h2 className="text-base font-semibold text-text">
            {activeUser?.username}
          </h2>
          <p className="text-xs text-text-secondary">
            {activeUser?.type?.toLocaleLowerCase() === "general"
              ? "Group Conversation"
              : activeUser?.status === "online"
              ? "Active Now"
              : "Offline"}
          </p>
        </div>
      </div>
    </header>
  );
};