import React, { useState } from "react";

interface MessageInputProps {
  activeUserName: string;
  onSendMessage: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  activeUserName,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <footer className="p-4 bg-surface border-t border-border">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${activeUserName}...`}
          className="flex-1 rounded-xl border border-border bg-surface-soft px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-primary hover:bg-primary-dark text-surface p-3 rounded-xl transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-md shadow-primary/20"
          aria-label="Send message"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </footer>
  );
};