import { createMessage } from "../services/sendMessageService.js";
import prisma from "../config/prisma.js";

// Controller to process sending messages
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id; // Extracted safely from authMiddleware
    const { conversationId, message } = req.body;
    console.log(senderId, "senderId");

    // Direct input validation
    if (!conversationId || !message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and message text are required",
      });
    }

    // Call the database query service layer
    const newMessage = await createMessage(conversationId, senderId, message);
console.log(newMessage, "newMessage");
    // If service returns null, user is not a member of the room
    if (!newMessage) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to send messages to this conversation",
      });
    }

    // Return the response object to client
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });

  } catch (error) {
    console.error("Send message controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending message",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ success: false, message: "Conversation ID is required" });
    }

    // প্রিজমা দিয়ে ওই চ্যাট রুমের সকল মেসেজ বের করা (পুরোনো থেকে নতুন ক্রমে)
    const messages = await prisma.messages.findMany({
      where: {
        conversation_id: Number(conversationId),
      },
      orderBy: {
        created_at: "asc", // চ্যাটে মেসেজ নিচে নিচে সাজানোর জন্য asc
      },
      select: {
        id: true,
        message: true,
        sender_id: true,
        created_at: true,
      },
    });
    console.log(messages, "messages");
    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ success: false, message: "Server error while fetching messages" });
  }
};
