import React from "react";

interface LastMessage {
  created_at: String;
  id: number;
  message: string;

  sender_id: number;
}
export interface Message {
  id: number;
  message: string;
  sender_id: number;
  created_at: string; // ISO Dynamic date string from the database
}
export interface ConversationUser {
  conversationId: string;
  username: string;
  email: string;
  avatar: string;
  status?: "online" | "offline";
  lastMessage?: LastMessage;
  // unreadCount?: number;
  type?: "private" | "general";
}

interface ConversationItemProps {
  user: ConversationUser;
  isActive: boolean;
  onSelect: (user: ConversationUser) => void;
}


export const ConversationItem: React.FC<ConversationItemProps> = ({
  user,
  isActive,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(user)}
      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition cursor-pointer text-left ${
        isActive
          ? "bg-surface-soft border border-border"
          : "hover:bg-surface-soft/60"
      }`}
    >
      <div className="relative">
        {user?.avatar == null ? (
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/30 to-secondary/30 text-primary font-bold flex items-center justify-center text-sm ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
            {user?.username
              ? user.username.charAt(0).toUpperCase()
              : user?.email?.charAt(0).toUpperCase()}
          </div>
        ) : (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover border border-border"
          />
        )}
       
        {user.type !== "general" && (
          <span
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface ${
              user.status === "online" ? "bg-success" : "bg-text-muted"
            }`}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-semibold text-text truncate">
            {user.username}
          </h3>
        </div>
        <p className="text-xs text-text-secondary truncate mt-0.5">
          {user.lastMessage?.message
            ? user.lastMessage.message
            : "Start a conversation"}{" "}
        </p>
      </div>

      {/* {Boolean(user.unreadCount && !isActive) && (
        <span className="bg-primary text-surface text-xs font-bold px-2 py-0.5 rounded-full">
          {user.unreadCount}
        </span>
      )} */}
    </button>
  );
};
