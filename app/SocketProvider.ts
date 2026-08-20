"use client";

import { useEffect } from "react";
import { socket } from "./lib/socket";

export default function SocketProvider() {
 useEffect(() => {
  socket.connect();

  return () => {
    socket.disconnect();
  };
}, []);

  return null;
}
