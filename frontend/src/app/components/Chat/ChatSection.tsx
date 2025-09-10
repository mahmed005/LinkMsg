"use client";

import { Stack, Typography } from "@mui/material";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import MessageSection from "./MessageSection";

export default function ChatSection({
  image,
  name,
  _id,
  type,
}: {
  image: string | undefined;
  name: string | undefined;
  _id: string | undefined;
  type?: "friend" | "group";
}) {
  return (
    <div className="fixed top-[calc(100px+1.125rem+40px)] bg-[#e9e9e9] p-2 left-[30dvw] w-[69dvw] h-[calc(100dvh-(100px+1.125rem+40px))] overflow-hidden">
      {!name && !_id && !type && (
        <Stack
          padding={2}
          width={"100%"}
          height={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography variant="h6">Start Chatting with your friends</Typography>
        </Stack>
      )}
      {name && _id && type && (
        <>
          <ChatHeader
            chat={{
              image,
              name,
              _id,
              type,
            }}
          />
          <MessageSection type={type} id={_id} />
          <ChatFooter type={type} key={_id} id={_id} />
        </>
      )}
    </div>
  );
}
