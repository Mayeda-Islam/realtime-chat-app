import React, { useState } from "react";

interface NewChatProps {
  onStartChat: (query: string) => void;
}

export const NewChat: React.FC<NewChatProps> = ({ onStartChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onStartChat(query.trim());
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-surface-soft border border-border hover:bg-border/30 text-text transition cursor-pointer"
        title="Start New Chat"
        type="button"
      >
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 p-4 bg-surface border border-border rounded-xl shadow-xl z-50">
          <h3 className="text-sm font-semibold text-text mb-3">
            New Direct Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter name or email..."
              className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-primary"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs text-text-secondary hover:text-text cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs bg-primary text-surface font-medium rounded-lg hover:bg-primary-dark cursor-pointer"
              >
                Chat
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};