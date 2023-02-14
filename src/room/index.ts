import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const rooms: Record<string, string[]> = {};
const chats: Record<string, Message[]> = {};

interface RoomParams {
  roomId: string;
  peerId: string;
}

interface Message {
  content: string;
  author?: string;
  timestamp: number;
}
export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];

    socket.emit("room-created", { roomId });
    console.log("the room was created");
  };

  const joinRoom = ({ roomId, peerId }: RoomParams) => {
    if (!rooms[roomId]) rooms[roomId] = [];

    socket.emit("get-messages", chats[roomId]);

    console.log(`user: ${peerId} join the room:  ${roomId}`);

    socket.join(roomId);
    if (!rooms[roomId].includes(peerId)) rooms[roomId].push(peerId);

    socket.to(roomId).emit("user-joined", { peerId });

    socket.emit("get-users", {
      roomId,
      members: rooms[roomId],
    });

    socket.on("disconnect", () => {
      console.log(`user: ${peerId} left the room`);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: RoomParams) => {
    //  if (rooms[roomId].length > 0)
    rooms[roomId] = rooms[roomId].filter((id: string) => id !== peerId);
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  const startSharing = ({ peerId, roomId }: RoomParams) => {
    console.log({ roomId, peerId });
    socket.to(roomId).emit("user-started-sharing", peerId);
  };

  const stopSharing = (roomId: string) => {
    socket.to(roomId).emit("user-stopped-sharing");
  };

  const addMessage = (roomId: string, message: Message) => {
    if (chats[roomId]) {
      chats[roomId].push(message);
    } else {
      chats[roomId] = [message];
    }
    socket.to(roomId).emit("add-message", message);
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
};
