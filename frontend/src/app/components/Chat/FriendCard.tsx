"use client";
import { Avatar, Stack, Typography } from "@mui/material";

export default function FriendCard(props: any) {
  return (
    <div
      className="w-full cursor-pointer"
      onClick={() => {
        props.setChat({
          name: props.name,
          image: props.image,
          _id: props._id,
          type: "friend",
        });
      }}
    >
      <Stack
        sx={{
          backgroundColor: props.isSelected ? "#E9E9E9" : "#efefef",
        }}
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        spacing={1}
        padding={2}
        borderRadius={2}
      >
        <Avatar src={props.image} />
        <Typography variant="body1">{props.name}</Typography>
      </Stack>
    </div>
  );
}
