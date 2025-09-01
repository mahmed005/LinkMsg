"use client";
import { Avatar, Stack, Typography, IconButton } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { StateProps } from "./ChatsClient";

export default function ChatHeader({ chat }: { chat: Partial<StateProps> }) {
  return (
    <Stack
      spacing={1}
      sx={{
        position: "absolute",
        top: "0.5rem",
        left: "0.5rem",
        height: "10%",
      }}
      className="w-[calc(100%-16px)]"
      alignItems={"center"}
      direction={"row"}
      justifyContent={"space-between"}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar sx={{ width: "48px", height: "48px" }} src={chat.image} />
        <Typography variant="h6">{chat.name}</Typography>
      </Stack>
      {chat.type === "group" && (
        <IconButton>
          <GroupIcon />
        </IconButton>
      )}
    </Stack>
  );
}
