import prisma from "../config/prisma.js";
import { getMyConversations } from "../services/conversationService.js";

// ১. আপনার সব কনভারসেশন লিস্ট তুলে আনার কন্ট্রোলার
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // আপনার conversationService থেকে ডাটা নিয়ে আসা হচ্ছে
    const conversations = await getMyConversations(userId);
    
    // ডাটা সহ সফল রেসপন্স পাঠানো হচ্ছে
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

// ২. নতুন বা পুরনো ওয়ান-টু-ওয়ান প্রাইভেট চ্যাট অ্যাক্সেস করার কন্ট্রোলার
export const accessConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id; 
    const { receiverId } = req.body; 

    if (!receiverId) {
      return res.status(400).json({ 
        success: false, 
        message: "Receiver ID is required" 
      });
    }

    // টেবিল ও কলামের নাম মিলিয়ে চ্যাট রুম চেক করার লজিক
    const existingConversation = await prisma.conversations.findFirst({
      where: {
        type: "private", 
        AND: [
          { conversation_members: { some: { user_id: currentUserId } } },
          { conversation_members: { some: { user_id: Number(receiverId) } } }
        ]
      }
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: "Existing conversation fetched",
        conversationId: existingConversation.id,
      });
    }

    // নতুন চ্যাট রুম এবং আপনার টেবিল অনুযায়ী মেম্বার তৈরি করার লজিক
    const newConversation = await prisma.conversations.create({
      data: {
        type: "private",
        name: null,
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
