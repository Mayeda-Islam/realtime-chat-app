import React from "react";

export interface ConversationUser {
  id: string;
  name: string;
  avatar: string;
  status?: "online" | "offline";
  lastMessage?: string;
  unreadCount?: number;
  type?: "private" | "group";
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
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover border border-border"
        />
        {user.type !== "group" && (
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
            {user.name}
          </h3>
        </div>
        <p className="text-xs text-text-secondary truncate mt-0.5">
          {user.lastMessage}
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