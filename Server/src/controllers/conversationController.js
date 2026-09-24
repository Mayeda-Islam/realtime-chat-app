import {
  getMyConversations,
} from "../services/conversationService.js";

export const getConversations = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

    const userId = req.user.id;

    console.log("USER ID:", userId);

    const conversations =
      await getMyConversations(userId);

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