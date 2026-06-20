"use client";

import { useEffect } from "react";
import { socket } from "./lib/socket";

export default function SocketProvider() {
 useEffect(() => {
  socket.connect();

  socket.on("connect", () => {
    console.log("CLIENT CONNECTED", socket.id);
  });

  socket.onAny((event, ...args) => {
    console.log("CLIENT EVENT:", event, args);
  });

  return () => {
    socket.disconnect();
  };
}, []);

  return null;
}