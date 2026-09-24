import prisma from "../config/prisma.js";

/**
 * Service to verify conversation membership and insert a new message
 * @param {number} conversationId 
 * @param {number} senderId 
 * @param {string} messageText 
 */
export const createMessage = async (conversationId, senderId, messageText) => {
    console.log(conversationId, senderId, messageText);
  // 1. Verify if the sender is actually a member of this conversation
  const isMember = await prisma.conversation_members.findFirst({
    where: {
      conversation_id: Number(conversationId),
      user_id: senderId,
    },
  });

  // If the user isn't in this room, return null to signify an unauthorized attempt
  if (!isMember) return null;

  // 2. Insert the message into the 'messages' table
  const newMessage = await prisma.messages.create({
    data: {
      conversation_id: Number(conversationId),
      sender_id: senderId,
      message: messageText,
    },
    // Include sender details from the 'users' relation table
    include: {
      users: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return newMessage;
};
