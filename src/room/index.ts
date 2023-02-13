import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

export const roomHandler = (socket: Socket) => {
  const joinRoom = ({ roomId }: { roomId: string }) => {
    console.log("user join the room", roomId);
  };

  const createRoom = () => {
    const roomId = uuidV4();
    socket.join(roomId);
    socket.emit("room-created", { roomId });
    console.log("the room was created");
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
