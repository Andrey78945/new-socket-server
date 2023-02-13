import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const rooms: Record<string, string[]> = {};

interface RoomParams {
  roomId: string;
  peerId: string;
}

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];

    socket.emit("room-created", { roomId });
    console.log("the room was created");
  };

  const joinRoom = ({ roomId, peerId }: RoomParams) => {
    if (rooms[roomId]) {
      console.log(`user: ${peerId} join the room:  ${roomId}`);

      socket.join(roomId);
      if (!rooms[roomId].includes(peerId)) rooms[roomId].push(peerId);

      socket.to(roomId).emit("user-joined", { peerId });

      socket.emit("get-users", {
        roomId,
        members: rooms[roomId],
      });
    }

    socket.on("disconnect", () => {
      console.log(`user: ${peerId} left the room`);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: RoomParams) => {
    rooms[roomId] = rooms[roomId].filter((id: string) => id !== peerId);
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
