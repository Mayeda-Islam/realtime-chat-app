const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app); //it is used to create a server

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
//it is used to create a socket server

io.on("connection", (socket) => {
  console.log(`User Connected : ${socket.id}`);
// it is used to create a socket server
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  // this function is used to join a room
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data);
  });
  // this function is used to send a message
  socket.on("typing", ({username, room}) => socket.to(room).emit("typing", username));
  // this function is used to send a message
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
