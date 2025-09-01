"use client";

import { socketStore } from "@/app/store/SocketStore";
import { Stack } from "@mui/material";
import MessageItem from "./MessageItem";
import { useContext, useMemo } from "react";
import { AuthContext } from "../Providers/AuthProvider";

export default function MessageSection({
  id,
  type,
}: {
  id: string;
  type: "friend" | "group";
}) {
  const context = useContext(AuthContext);
  const messages = socketStore((state) => state.messages);

  const filteredMessages = useMemo(() => {
    const filtered = messages.filter(
      (message) =>
        (type === "group" &&
          message.to === "Group" &&
          message.groupId === id) ||
        (type === "friend" &&
          message.to === "Individual" &&
          (message.receiverId === id ||
            message.receiverId === context?.session?.user?.id))
    );
    return filtered;
  }, [messages, type]);

  return (
    <Stack
      position={"absolute"}
      left={"0.5rem"}
      className="w-[calc(100%-16px)] top-[calc(10%+24px)] h-[calc(80%-52px)]"
      spacing={1}
      justifyContent={"flex-start"}
      sx={{
        overflowX: "hidden",
        overflowY: "auto",
        "& > *": {
          flexShrink: 0,
        },
      }}
    >
      {filteredMessages.map((message, index) => (
        <MessageItem key={index} {...message} />
      ))}
    </Stack>
  );
}
