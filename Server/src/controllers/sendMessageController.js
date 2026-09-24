import { createMessage } from "../services/sendMessageService.js";

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
