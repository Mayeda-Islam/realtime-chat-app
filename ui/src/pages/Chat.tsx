
import { useState, useEffect, useRef } from "react";

// Mock Initial Data
const MOCK_USERS = [
  {
    id: "user_2",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    status: "online",
    lastMessage: "Hey! Did you check out the new design system?",
    unreadCount: 2,
  },
  {
    id: "user_3",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    status: "offline",
    lastMessage: "See you tomorrow at the meeting!",
  },
];

const INITIAL_MESSAGES = {
  user_2: [
    {
      id: "m1",
      senderId: "user_2",
      text: "Hey there! How is the ChitChat app coming along?",
      timestamp: "10:30 AM",
    },
    {
      id: "m2",
      senderId: "me",
      text: "It's going great! Just built the login screen and setting up the chat layout now.",
      timestamp: "10:32 AM",
    },
    {
      id: "m3",
      senderId: "user_2",
      text: "Hey! Did you check out the new design system?",
      timestamp: "10:35 AM",
    },
  ],
  user_3: [
    {
      id: "m10",
      senderId: "user_3",
      text: "See you tomorrow at the meeting!",
      timestamp: "Yesterday",
    },
  ],
};

const Chat = () => {
  const [activeUser, setActiveUser] = useState(MOCK_USERS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: "me",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeUser.id]: [...(prev[activeUser.id] || []), newMessage],
    }));

    setInputText("");
  };

  const activeMessages = messages[activeUser.id] || [];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-80 md:w-96 bg-surface border-r border-border flex flex-col">
        {/* App Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center shadow-md shadow-primary/20">
              <svg className="w-6 h-6 text-surface fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 3.58-9 8 0 2.04.88 3.92 2.34 5.33-.21 1.25-.8 2.45-1.78 3.35 1.78.14 3.5-.39 4.88-1.29.18.02.36.03.56.03 4.97 0 9-3.58 9-8s-4.03-8-9-8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-primary">ChitChat</h1>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-border bg-surface-soft px-4 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {MOCK_USERS.map((user) => {
            const isActive = activeUser.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => setActiveUser(user)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition cursor-pointer text-left ${
                  isActive ? "bg-surface-soft border border-border" : "hover:bg-surface-soft/60"
                }`}
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border border-border"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface ${
                      user.status === "online" ? "bg-success" : "bg-text-muted"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-text truncate">{user.name}</h3>
                  </div>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {user.lastMessage}
                  </p>
                </div>

                {user.unreadCount && !isActive && (
                  <span className="bg-primary text-surface text-xs font-bold px-2 py-0.5 rounded-full">
                    {user.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* ================= CHAT MAIN AREA ================= */}
      <main className="flex-1 flex flex-col bg-background">
        {/* Active Chat Header */}
        <header className="p-4 bg-surface border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${
                  activeUser.status === "online" ? "bg-success" : "bg-text-muted"
                }`}
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text">{activeUser.name}</h2>
              <p className="text-xs text-text-secondary">
                {activeUser.status === "online" ? "Active Now" : "Offline"}
              </p>
            </div>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeMessages.map((msg) => {
            const isMe = msg.senderId === "me";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                    isMe
                      ? "bg-primary text-surface rounded-br-xs"
                      : "bg-surface border border-border text-text rounded-bl-xs"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[11px] text-text-muted mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <footer className="p-4 bg-surface border-t border-border">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeUser.name}...`}
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
      </main>
    </div>
  );
};

export default Chat;