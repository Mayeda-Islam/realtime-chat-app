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

    // User whom we want to chat with
    const { receiverId } = req.body;

    console.log("Current User ID:", currentUserId);
    console.log("Receiver ID:", receiverId);

    // --------------------------------------------------
    // 1. Validate receiverId
    // --------------------------------------------------

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    const receiverUserId = Number(receiverId);

    if (Number.isNaN(receiverUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver ID",
      });
    }

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

      name: receiverUser.username,

      avatar: receiverUser.avatar || null,

      status: receiverUser.is_online
        ? "online"
        : "offline",

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