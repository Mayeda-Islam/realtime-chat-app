import "dotenv/config";
import prisma from "./config/prisma.js"
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import conversationRoute from "./routes/conversationRoute.js"
import messageRouter from "./routes/sendMessageRoute.js"
const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);


// Attach your clean modular routes to the /api/auth prefix
app.use("/api/auth", authRoutes);
app.use("/api", conversationRoute);
// Mount the message routes under an API prefix path
app.use("/api", messageRouter);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


app.get("/api/test-db", async (req, res) => {
  try {
    const testUsers = await prisma.users.findMany({ take: 1 }); 
    
    res.json({
      success: true,
      message: "পোস্টগ্রেএসকিউএল (PostgreSQL) ডেটাবেজ সফলভাবে কানেক্ট হয়েছে!",
      data: testUsers
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "ডেটাবেজ কানেকশন ব্যর্থ হয়েছে!",
      error: error.message
    });
  }
});

// initChatSocket(io);

// app.get("/api/messages/:roomId", async (req, res) => {
//   const prisma = require("./src/config/prisma");
//   try {
//     const history = await prisma.messages.findMany({
//       where: { conversation_id: Number(req.params.roomId) },
//       orderBy: { created_at: "asc" },
//     });
//     res.json(history);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
