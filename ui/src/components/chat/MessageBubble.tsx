import React from "react";

export interface Message {
  id:  number;
  sender_id: string | number;
  senderName?: string;
  message: string;
  created_at: string;
}

interface MessageBubbleProps {
  message: Message;
  isGroup?: boolean;
  currentUserId?:number
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({currentUserId,
  message,
  // isGroup,
}) => {
// ১. দুটি আইডিকেই সংখ্যায় রূপান্তর করুন
  const sId = Number(message.sender_id);
  const myId = Number(currentUserId);

  // ২. স্ট্রিক্টলি চেক করুন: দুটি আইডিই ভ্যালিড সংখ্যা এবং তারা সমান কি না
  const isMe = !isNaN(myId) && !isNaN(sId) && myId === sId;

  // ৩. ডিবাগিং এর জন্য লগ (এটি চেক করে দেখতে পারেন কনসোলে কি আসছে)
  console.log(`message ID: ${message.id} | Sender: ${sId} | Me: ${myId} | Result: ${isMe}`);

 return (
    <div 
      key={message.id} 
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}
    >
      <div 
        className={`rounded-xl p-3 max-w-xs text-sm shadow-sm ${
          isMe 
            ? 'bg-primary text-surface rounded-br-none' // আপনার মেসেজ (ডানপাশে)
            : 'bg-surface-soft text-text rounded-bl-none' // অন্য ইউজারের মেসেজ (বামপাশে)
        }`}
      >
        <p className="break-words">{message.message}</p>
        <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-surface/70' : 'text-text-muted'}`}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );

};