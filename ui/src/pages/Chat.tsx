
import { useState, useEffect, useRef } from "react";
import {NewChat} from "../components/conversation/NewChat";
import {CreateGroup} from "../components/conversation/CreateGroup";
import { ConversationItem, ConversationUser } from "../components/conversation/ConversationItem";
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageList } from "../components/chat/MessageList";
import { MessageInput } from "../components/chat/MessageInput";

// Mock Initial Data
const MOCK_USERS: ConversationUser[] = [
  {
    id: "user_2",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    status: "online",
    lastMessage: "Hey! Did you check out the new design system?",
    // unreadCount: 2,
  },
  {
    id: "user_3",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    status: "offline",
    lastMessage: "See you tomorrow at the meeting!",
  },
];

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
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
  const [users, setUsers] = useState<ConversationUser[]>(MOCK_USERS);
  const [activeUser, setActiveUser] = useState<ConversationUser>(MOCK_USERS[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeUser]);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: "me",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeUser.id]: [...(prev[activeUser.id] || []), newMessage],
    }));

  };

  const onSelectUser = (user: ConversationUser) => setActiveUser(user);

  const onNewChat = (query: string) => {
    const existingUser = users.find(
      (user) => user.name.toLowerCase() === query.toLowerCase()
    );
    if (existingUser) {
      setActiveUser(existingUser);
      return;
    }

    const newUser: ConversationUser = {
      id: `user_${Date.now()}`,
      name: query,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      status: "offline",
      lastMessage: "Start a conversation",
    };
    setUsers((prev) => [...prev, newUser]);
    setActiveUser(newUser);
  };

  const onCreateGroup = (groupName: string) => {
    const newGroup: ConversationUser = {
      id: `group_${Date.now()}`,
      name: groupName,
      avatar: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&auto=format&fit=crop&q=80",
      type: "group",
      lastMessage: "New group created",
    };
    setUsers((prev) => [...prev, newGroup]);
    setActiveUser(newGroup);
  };

  const activeMessages = messages[activeUser.id] || [];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-80 md:w-96 bg-surface border-r border-border flex flex-col h-full">
      {/* App Header with Integrated New Chat & Create Group Components */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20">
            <svg
              className="w-6 h-6 text-surface fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 3c-4.97 0-9 3.58-9 8 0 2.04.88 3.92 2.34 5.33-.21 1.25-.8 2.45-1.78 3.35 1.78.14 3.5-.39 4.88-1.29.18.02.36.03.56.03 4.97 0 9-3.58 9-8s-4.03-8-9-8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-primary">ChitChat</h1>
        </div>

        {/* Embedded New Chat & Create Group Modals */}
        <div className="flex items-center space-x-2">
          <NewChat onStartChat={onNewChat} />
          <CreateGroup onCreateGroup={onCreateGroup} />
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search conversations..."
          className="w-full rounded-lg border border-border bg-surface-soft px-4 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
        />
      </div>

      {/* Conversation List rendering ConversationItem components */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filteredUsers.map((user) => (
          <ConversationItem
            key={user.id}
            user={user}
            isActive={activeUser.id === user.id}
            onSelect={onSelectUser}
          />
        ))}
      </div>
    </aside>

      {/* ================= CHAT MAIN AREA ================= */}
      <main className="flex-1 flex flex-col bg-background h-full">
      {/* Active Chat Header Component */}
      <ChatHeader activeUser={activeUser} />

      {/* Message Feed Component */}
      <MessageList
        messages={activeMessages}
        isGroup={activeUser.type === "group"}
      />

      {/* Message Input Component */}
      <MessageInput
        activeUserName={activeUser.name}
        onSendMessage={handleSendMessage}
      />
    </main>
    </div>
  );
};

export default Chat;


