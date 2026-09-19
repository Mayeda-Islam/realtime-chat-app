// src/sockets/chatSocket.js
const prisma = require("../config/prisma"); // আপনার প্রিযমা ক্লায়েন্ট ইম্পোর্ট করুন

function initChatSocket(io) {
  io.on("connection", (socket) => {
    console.log(`User Connected : ${socket.id}`);

    // রুম জয়েন করার সেশন
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    // মেসেজ পাঠানো এবং ডেটাবেজে সেভ করার সেশন
    socket.on("send_message", async (data) => {
      // ক্লায়েন্ট থেকে আসা রুম আইডি সকেটে ব্রডকাস্ট করুন
      socket.to(data.room).emit("receive_message", data);
      console.log("Real-time message sent:", data);

      try {
        // সুপাবেস ডেটাবেজে মেসেজটি সেভ করুন
        // আপনার schema.prisma এর "messages" টেবিলের সাথে মিলিয়ে fields দিন
        await prisma.messages.create({
          data: {
            conversation_id, // রুম আইডিকে নাম্বার বা স্ট্রিং এ কনভার্ট করুন আপনার স্কিমা অনুযায়ী
            sender_id,
            message,
          },
        });
        console.log("Message successfully saved to Supabase.");
      } catch (error) {
        console.error("Database save error:", error.message);
      }
    });

    // টাইপিং স্ট্যাটাস পাঠানো
    socket.on("typing", ({ username, room }) => {
      socket.to(room).emit("typing", username);
    });

    // ডিসকানেক্ট হ্যান্ডলার
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
}

module.exports = initChatSocket;
