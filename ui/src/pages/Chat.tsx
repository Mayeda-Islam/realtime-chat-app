import { useState, useEffect, useRef } from "react";
import { NewChat } from "../components/conversation/NewChat";
import { CreateGroup } from "../components/conversation/CreateGroup";
import {
  ConversationItem,
  ConversationUser,
  Message as ConversationMessage,
} from "../components/conversation/ConversationItem";
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageList } from "../components/chat/MessageList";
import { MessageInput } from "../components/chat/MessageInput";
import { ConversationList } from "../components/conversation/ConversationList";
import { useNavigate } from "react-router-dom";
import ProfileView, { ProfileUpdateData } from "./Profile";

interface Message {
  id: string;
  sender_id:number;
  text: string;
  timestamp: string;
}
interface CurrentUser {
  id?: number;
  email?: string;
  username?: string;
  avatar?: string;
}


const Chat = () => {
  // মেইন স্টেটগুলো এখানে নিয়ে আসা হলো
  const [showProfile, setShowProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({});
  const [users, setUsers] = useState<ConversationUser[]>([]);
  const [activeUser, setActiveUser] = useState<ConversationUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [activeUserMessages, setActiveUserMessages] = useState<
    ConversationMessage[]
  >([]);

  const navigate = useNavigate();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ১. Bearer Token সহ সার্ভার থেকে ইউজার লিস্ট নিয়ে আসা
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (user) {
          setCurrentUser(JSON.parse(user));
        }
        const response = await fetch(
          "http://localhost:3001/api/conversations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data?.data);
        const conversations = data?.data;
        setUsers(conversations);

        // অপশনাল: প্রথম ইউজারকে অটোমেটিক একটিভ সিলেক্ট করে দেওয়া
        // if (conversations.length > 0) {
        //   setActiveUser(data[0]);
        // }
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // অটো স্ক্রোল লজিক
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeUser]);

  // মেসেজ পাঠানোর হ্যান্ডলার
  // ১. মেসেজ পাঠানোর মেইন হ্যান্ডলার ফাংশন
  const handleSendMessage = async (text: string) => {
    if (!activeUser) return;

    try {
      const token = localStorage.getItem("token");

      // ২. ব্যাকএন্ড এপিআই-তে POST রিকোয়েস্ট পাঠানো
      const response = await fetch("http://localhost:3001/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          conversationId: activeUser.conversationId, // কোন চ্যাট রুমে পাঠানো হচ্ছে
          message: text, // ইনপুট বক্সের টেক্সট
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // ৩. ডাটাবেজে সেভ হওয়া নতুন মেসেজটি (result.data) সরাসরি স্ক্রিনের মেসেজ লিস্টে পুশ করা হলো
        setActiveUserMessages((prev) => [...prev, result.data]);

        // ৪. সাইডবারের লাস্ট মেসেজ প্রিভিউ ইনস্ট্যান্ট আপডেট করার লজিক (অপশনাল)
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u?.conversationId === activeUser?.conversationId
              ? { ...u, lastMessage: result.data }
              : u,
          ),
        );
      } else {
        console.error("Failed to send message:", result.message);
      }
    } catch (error) {
      console.error("Error sending message via API:", error);
    }
  };

  // const onSelectUser = (user: ConversationUser) => setActiveUser(user);

  // নতুন চ্যাট শুরু করার লজিক (চালু করা হলো)
  const onNewChat = async (query: string) => {
    // ১. অলরেডি যদি এই নামের ইউজার চ্যাট লিস্টে থাকে, তবে নতুন করে এপিআই কল করার দরকার নেই
    const existingUser = users?.find(
      (user) => user?.username?.toLowerCase() === query?.toLowerCase(),
    );

    if (existingUser) {
      setActiveUser(existingUser);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // ২. ব্যাকএন্ডের POST এপিআই-তে 'query' কী (key) দিয়ে রিকোয়েস্ট পাঠানো হচ্ছে
      const response = await fetch("http://localhost:3001/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ query: query }),
      });

      const result = await response.json();

      // যদি ব্যাকএন্ড কোনো এরর দেয় (যেমন: ৪MD৪ User Not Found বা ৪০০)
      if (!response.ok) {
        alert(result.message || "Failed to access conversation");
        return;
      }

      // ৩. ব্যাকএন্ড থেকে সফলভাবে ডেটা আসলে ফ্রন্টএন্ড স্টেট আপডেট
      if (result.success && result.data) {
        const createdUser: ConversationUser = {
          conversationId: result.data.conversationId,
          type: result.data.type,
          username: result.data.name, // ব্যাকএন্ড থেকে আসা আসল ইউজারনেম
          email: result.data.email || null,
          avatar: result.data.avatar || null,
          status: result.data.status || "offline",
          // messageCount: result.data.messageCount || 0,
          lastMessage: result.data.lastMessage || null,
        };

        // লিস্টে নতুন ইউজারকে যোগ করা এবং চ্যাট স্ক্রিনে তাকে একটিভ করা
        setUsers((prev) => [...prev, createdUser]);
        setActiveUser(createdUser);
      }
    } catch (error) {
      console.error("Error creating new chat via access API:", error);
      alert("Something went wrong while starting the chat.");
    }
  };

  // গ্রুপ তৈরি করার লজিক
  const onCreateGroup = (groupName: string) => {
    // const newGroup: ConversationUser = {
    //   id: `group_${Date.now()}`,
    //   name: groupName,
    //   avatar:
    //     "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100&auto=format&fit=crop&q=80",
    //   type: "general",
    //   lastMessage: "New group created",
    // };
    // setUsers((prev) => [...prev, newGroup]);
    // setActiveUser(newGroup);
  };

  // const activeUserMessages = activeUser ? messages[activeUser.conversationId] || [] : [];

  // ১. কম্পোনেন্টের বডির ভেতরে আলাদা ফাংশন তৈরি করুন
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        console.error(
          "Server-side logout failed, clearing client storage anyway.",
        );
      }
    } catch (error) {
      console.error("Error during API logout:", error);
    } finally {
      // ফ্রন্টএন্ড ক্লিনিং এবং রিডাইরেক্ট
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // 🟢 চ্যাট আইটেমে ক্লিক করলে এই ফাংশনটি ট্রিগার হবে
  const onSelectUser = async (user: ConversationUser) => {
    console.log(user);
    setActiveUser(user); // ১. প্রথমে ডানপাশে ইউজারকে একটিভ দেখাবে
    setMessagesLoading(true);

    try {
      const token = localStorage.getItem("token");

      // ২. ওই স্পেসিফিক conversationId এর মেসেজ নিয়ে আসার জন্য এপিআই কল
      const response = await fetch(
        `http://localhost:3001/api/conversations/${user.conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // ৩. সার্ভার থেকে আসা মেসেজগুলো স্টেটে সেট করা হলো
        setActiveUserMessages(result.data);
      } else {
        setActiveUserMessages([]);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setActiveUserMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };


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
          <ConversationList
            searchTerm={searchTerm}
            activeUser={activeUser}
            onSelectUser={onSelectUser}
            loading={loading}
            users={users}
          />
        </div>

        {/* ================= SIDEBAR FOOTER: PROFILE & LOGOUT ================= */}
        <div className="p-4 border-t border-border bg-surface-soft flex items-center justify-between">
          {/* Profile Button Component (Clicking this can open profile settings/modal) */}
          <button
              onClick={() => setShowProfile(true)}

            className="flex items-center space-x-3 text-left flex-1 min-w-0 p-1.5 rounded-lg hover:bg-surface transition-colors group outline-none"
            title="View Profile"
          >
            <div className="relative">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="My Profile"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                />
              ) : (
                /* ২. অ্যাভাটার না থাকলে নামের প্রথম অক্ষর দেখাবে (Fallback Container) */
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary/30 to-secondary/30 text-primary font-bold flex items-center justify-center text-sm ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                  {currentUser?.username
                    ? currentUser.username.charAt(0).toUpperCase()
                    : currentUser?.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-soft rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text truncate group-hover:text-primary transition-colors">
                My Account
              </p>
              <p className="text-xs text-text-muted truncate">View Settings</p>
            </div>
          </button>

          {/* Log Out Action Button */}
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 ml-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors outline-none"
          >
            <svg
              className="w-5 h-5 fill-none stroke-current"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ================= CHAT MAIN AREA ================= */}
              <main className="flex-1 flex flex-col bg-background h-full">

  {showProfile ? (
     <ProfileView 
    currentUser={currentUser} 
    onClose={() => setShowProfile(false)} 
    setCurrentUser={setCurrentUser} // 🟢 পেরেন্ট স্টেট সরাসরি পাস করে দেওয়া হলো
  />
  ) : (
    <>
      {activeUser && <ChatHeader activeUser={activeUser} />}

      <MessageList
        messages={activeUserMessages}
        currentUserId={
          currentUser?.id
            ? Number(currentUser.id)
            : undefined
        }
      />

      <MessageInput
        activeUserName={activeUser?.username ?? ""}
        onSendMessage={handleSendMessage}
      />
    </>
  )}

</main>
    </div>
  );
};

export default Chat;

