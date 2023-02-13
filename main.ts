import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
// import { roomHandler } from "./room";

const app = express();
app.use(cors);
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  //  roomHandler(socket);
  socket.on("join-room", () => {
    console.log("user join the room");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`listening on port:${PORT}`);
});
