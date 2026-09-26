import React from "react";
import { ConversationItem, ConversationUser } from "./ConversationItem";

interface ConversationListProps {
  searchTerm: string;
  activeUser: ConversationUser | null;
  onSelectUser: (user: ConversationUser) => void;
  users: ConversationUser[]; // মেইন পেজ থেকে আসবে
  loading: boolean; // মেইন পেজ থেকে আসবে
}

export const ConversationList: React.FC<ConversationListProps> = ({
  searchTerm,
  activeUser,
  onSelectUser,
  users,
  loading,
}) => {
    console.log(users)
  // শুধুমাত্র সার্চ ফিল্টারিং এখানে হবে
  const filteredUsers = users?.filter((u) =>
    u?.username?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-4 text-xs text-text-muted">Loading conversations...</div>;
  }

  if (filteredUsers?.length === 0) {
    return <div className="p-4 text-xs text-text-muted">No conversations found.</div>;
  }

  return (
    <div className="space-y-1">

{filteredUsers?.map((user) => (
  <ConversationItem
    key={user?.conversationId} // ইউনিক 'conversationId' ব্যবহার করা হলো
    user={user}
    isActive={activeUser?.conversationId === user?.conversationId} // একটিভ চেক করার জন্যও এটি ব্যবহার করুন
    onSelect={onSelectUser}
  />
))}

    </div>
  );
};
