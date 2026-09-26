import prisma from "../config/prisma.js";
import { getMyConversations } from "../services/conversationService.js";

// ======================================================
// GET ALL CONVERSATIONS OF LOGGED-IN USER
// ======================================================

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await getMyConversations(userId);

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get conversations",
    });
  }
};

// ======================================================
// ACCESS EXISTING PRIVATE CHAT OR CREATE NEW ONE
// ======================================================

export const accessConversation = async (req, res) => {
  try {
    // Logged-in user
    const currentUserId = req.user.id;
    // ১. ফ্রন্টএন্ড থেকে আসা সাধারণ 'query' রিসিভ করা হলো
    const { query } = req.body;

    console.log("Current User ID:", currentUserId);
    console.log("Searching for User via:", query);

    // যদি ফ্রন্টএন্ড থেকে কিছুই না আসে
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Username or Email input is required",
      });
    }

    // ২. ইনপুটটি ইমেইল নাকি ইউজারনেম তা ব্যাকএন্ড নিজে থেকেই চেক করবে (Regex দিয়ে)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);

    // ৩. ভেরিয়েবল সংঘাত এড়াতে আমরা একদম ইউনিক নাম 'foundUser' ব্যবহার করছি
    let foundUser = null;

    // ৪. কন্ডিশন অনুযায়ী প্রিজমা (Prisma) দিয়ে ডাটাবেজ থেকে ইউজার বের করা
   if (isEmail) {
      // ইমেইল সাধারণত ইউনিক এবং ছোট হাতের অক্ষরে চেক করা সেফ
      foundUser = await prisma.users.findFirst({
        where: {
          email: {
            equals: query.toLowerCase().trim(),
            mode: 'insensitive' // 👈 কেস-সেন্সিটিভ ঝামেলা দূর করবে
          }
        },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          is_online: true,
          last_seen: true,
        },
      });
    } else {
      // 🟢 ইউজারনেম মিক্সড লেটার হলেও এখন এই insensitive মোডের কারণে ম্যাচ করবে
      foundUser = await prisma.users.findFirst({
        where: {
          username: {
            equals: query.trim(),
            mode: 'insensitive' // 👈 Capital/Small অক্ষরের অমিল দূর করবে
          }
        },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          is_online: true,
          last_seen: true,
        },
      });
    }

    // ৫. ইউজার না পাওয়া গেলে ৪MD৪ এরর রিটার্ন
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "No user found with this username or email",
      });
    }

    const receiverUserId = foundUser.id;

    // User cannot chat with themselves
    if (currentUserId === receiverUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot create a conversation with yourself",
      });
    }

    // --------------------------------------------------
    // 2. Check whether receiver exists
    // --------------------------------------------------

    const receiverUser = await prisma.users.findUnique({
      where: {
        id: receiverUserId,
      },

      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        is_online: true,
        last_seen: true,
      },
    });

    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "Receiver user not found",
      });
    }

    // --------------------------------------------------
    // 3. Check whether private conversation already exists
    // --------------------------------------------------

    let conversation = await prisma.conversations.findFirst({
      where: {
        type: "private",

        AND: [
          {
            conversation_members: {
              some: {
                user_id: currentUserId,
              },
            },
          },
          {
            conversation_members: {
              some: {
                user_id: receiverUserId,
              },
            },
          },
        ],
      },
    });

    // --------------------------------------------------
    // 4. If conversation doesn't exist, create it
    // --------------------------------------------------

    let isNewConversation = false;

    if (!conversation) {
      conversation = await prisma.conversations.create({
        data: {
          type: "private",
          name: null,

          conversation_members: {
            create: [
              {
                user_id: currentUserId,
              },
              {
                user_id: receiverUserId,
              },
            ],
          },
        },
      });

      isNewConversation = true;
    }

    // --------------------------------------------------
    // 5. Fetch latest message
    // --------------------------------------------------

    const latestMessage = await prisma.messages.findFirst({
      where: {
        conversation_id: conversation.id,
      },

      orderBy: {
        created_at: "desc",
      },

      select: {
        id: true,
        message: true,
        sender_id: true,
        created_at: true,
      },
    });

    // --------------------------------------------------
    // 6. Count total messages
    // --------------------------------------------------

    const messageCount = await prisma.messages.count({
      where: {
        conversation_id: conversation.id,
      },
    });

    // --------------------------------------------------
    // 7. Prepare data for frontend
    // --------------------------------------------------

    const data = {
      conversationId: conversation.id,

      type: conversation.type,
      email: receiverUser.email,
      username: receiverUser.username,

      avatar: receiverUser.avatar || null,

      status: receiverUser.is_online ? "online" : "offline",

      lastMessage: latestMessage,

      messageCount: messageCount,
    };

    // --------------------------------------------------
    // 8. Return response
    // --------------------------------------------------

    return res.status(isNewConversation ? 201 : 200).json({
      success: true,

      message: isNewConversation
        ? "New private conversation created successfully"
        : "Existing conversation fetched successfully",

      data: data,
    });
  } catch (error) {
    console.error("Access conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while accessing conversation",
    });
  }
};
