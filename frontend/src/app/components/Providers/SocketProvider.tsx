"use client";

import { memo, PropsWithChildren, useEffect } from "react";
import { socketStore } from "../../store/SocketStore";
import { io } from "socket.io-client";
import { usePathname } from "next/navigation";

const socketUri = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI;

if (!socketUri) throw new Error("Messaging server not found");

function SocketProvider({ children }: PropsWithChildren) {
  const {
    setNotifications,
    setMessages,
    addMessage,
    addNotification,
    updateSocket,
  } = socketStore.getState();
  const pathname = usePathname();
  const socket = socketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) {
      const currSocket = io(socketUri, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      currSocket.on("connect", () => {
        updateSocket(currSocket);
      });
      return;
    }

    const handleInitial = (data: any) => {
      setNotifications(data);
      setMessages(data);
    };

    const handleMessage = (data: any) => {
      if (pathname === "/") {
        addMessage(data);
        addNotification(data);
      } else {
        addMessage(data);
      }
    };

    socket.on("initial-notifications", handleInitial);
    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("initial-notifications", handleInitial);
      socket.off("receive-message", handleMessage);
    };
  }, [pathname, socket]);

  return children;
}

export default memo(SocketProvider);
