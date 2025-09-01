"use client";

import { useState } from "react";
import ChatOptions from "./ChatOptions";
import ChatSection from "./ChatSection";
import { Typography } from "@mui/material";

export type StateProps = {
  name: string;
  image: string;
  _id: string;
  type: "friend" | "group";
};

export default function ChatsClient({
  friends,
  groups,
}: {
  friends: any;
  groups: any;
}) {
  const [selectedChat, setSelectedChat] = useState<StateProps | null>(null);
  return (
    <>
      <Typography variant="h4">Chats</Typography>
      <ChatOptions
        setChat={setSelectedChat}
        selected={selectedChat}
        groups={groups}
        friends={friends}
      />
      <ChatSection
        image={selectedChat?.image}
        name={selectedChat?.name}
        _id={selectedChat?._id}
        type={selectedChat?.type}
      />
    </>
  );
}
