"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useWebSocketController() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WEBSOCKET_HOST, {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to WebSocket Server (Kiosk)", socketInstance.id);
      socketInstance.emit("register", "kiosk");
    });

    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, []);

  const sendCategorySelection = (category, subcategory) => {
    if (socket) {
      socket.emit("selectCategory", { category, subcategory });
    }
  };

  return {
    sendCategorySelection,
  };
}
