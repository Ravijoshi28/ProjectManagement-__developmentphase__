import { io } from "socket.io-client";

console.log("Socket URL:", process.env.NEXT_PUBLIC_SOCKET_URL);

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  autoConnect: false,
});