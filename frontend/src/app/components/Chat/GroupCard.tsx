"use client";

import { Avatar, Stack, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

export default function GroupCard(props: any) {
  return (
    <div
      className="w-full cursor-pointer"
      onClick={() => {
        props.setChat({
          name: props.name,
          image: props.image,
          _id: props._id,
          type: "group",
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
        <Avatar src={props.image}>{!props.image && <GroupIcon />}</Avatar>
        <Typography variant="body1">{props.name}</Typography>
      </Stack>
    </div>
  );
}
