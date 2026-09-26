import prisma from "../config/prisma.js";

export const getMyConversations = async (userId) => {
  const conversations = await prisma.conversations.findMany({
    // 1. শুধু সেই conversations আনবে
    // যেখানে current user member হিসেবে আছে
    where: {
      conversation_members: {
        some: {
          user_id: userId,
        },
      },
    },

    // 2. Conversation-এর সাথে related data আনবে
    include: {
      // Conversation-এর সব members
      conversation_members: {
        include: {
          // প্রতিটি member-এর actual user information
          users: {
            select: {
              id: true,
              username: true,
              email: true,
              avatar: true,
              is_online: true,
            },
          },
        },
      },

      // 3. সর্বশেষ একটি message
      messages: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
        select: {
          id: true,
          message: true,
          sender_id: true,
          created_at: true,
        },
      },

      // 4. মোট কতগুলো message আছে
      _count: {
        select: {
          messages: true,
        },
      },
    },

    // Conversation latest created first
    orderBy: {
      created_at: "desc",
    },
  });

  // Prisma-এর nested result-কে
  // frontend-এর জন্য সহজ format-এ convert করছি
  const result = conversations.map((conversation) => {
    // Current user ছাড়া অন্য member খুঁজছি
    const otherMember = conversation.conversation_members.find(
      (member) => member.user_id !== userId
    );

    const otherUser = otherMember?.users;

    return {
      conversationId: conversation.id,

      type: conversation.type,

      // Private হলে অন্য user's username
      // General হলে conversation-এর name
      username:
        conversation.type === "private"
          ? otherUser?.username || "Unknown User"
          : conversation.name,

      // Private chat-এর ক্ষেত্রে অন্য user's avatar
      avatar:
        conversation.type === "private"
          ? otherUser?.avatar || null
          : null,

      // Private chat-এর ক্ষেত্রে online/offline
      status:
        conversation.type === "private"
          ? otherUser?.is_online
            ? "online"
            : "offline"
          : null,

      // সর্বশেষ message
      lastMessage: conversation.messages[0] || null,
      email: otherUser?.email || null,
      // মোট message
      messageCount: conversation._count.messages,
    };
  });

  return result;
};