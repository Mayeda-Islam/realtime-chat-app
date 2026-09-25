import prisma from "../config/prisma.js";
import { getMyConversations } from "../services/conversationService.js";

// 1. Controller to fetch the list of all conversations for the logged-in user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetching data from conversationService
    const conversations = await getMyConversations(userId);
    
    // Sending a successful response with the conversation data
    return res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to get conversations" 
    });
  }
};

// 2. Controller to access a new or existing one-to-one private chat room
export const accessConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Your ID extracted from the auth middleware
    const { receiverId } = req.body;  // The ID of the user you want to chat with
    console.log(currentUserId,req.body, "currentUserId");

    if (!receiverId) {
      console.log(receiverId);
      return res.status(400).json({ 
        success: false, 
        message: "Receiver ID is required" 
      });
    }

    // Checking if a one-to-one 'private' chat already exists between these two users
    const existingConversation = await prisma.conversations.findFirst({
      where: {
        type: "private", 
        AND: [
          { conversation_members: { some: { user_id: currentUserId } } },
          { conversation_members: { some: { user_id: Number(receiverId) } } }
        ]
      }
    });

    // If an existing conversation room is found, return its ID
    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: "Existing conversation fetched",
        conversationId: existingConversation.id,
      });
    }

    // If no conversation room exists, create a new one along with its members
    const newConversation = await prisma.conversations.create({
      data: {
        type: "private",
        name: null, // One-to-one private chats do not have a hardcoded room name
        conversation_members: {
          create: [
            { user_id: currentUserId },
            { user_id: Number(receiverId) }
          ]
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "New private conversation created successfully",
      conversationId: newConversation.id,
    });

  } catch (error) {
    console.error("Access conversation error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error while accessing conversation" 
    });
  }
};
