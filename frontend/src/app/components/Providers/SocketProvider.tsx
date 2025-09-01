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
      });

      currSocket.on("connect", () => {
        console.log("Connected");
      });

      updateSocket(currSocket);
      return;
    }

    socket.on("initial-notifications", (data) => {
      setNotifications(data);
      setMessages(data);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      console.log(pathname);
      if (pathname === "/") {
        addMessage(data);
        addNotification(data);
      } else {
        addMessage(data);
      }
    });
  }, [pathname, socket]);

  return children;
}

export default memo(SocketProvider);
