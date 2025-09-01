"use client";

import { getUserDetails } from "@/app/utils/actions";
import {
  Avatar,
  ListItemText,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import GroupIcon from "@mui/icons-material/Group";

export default function NotificationItem(props: any) {
  const [user, setUser] = useState<any>(null);

  const { from } = props;

  useEffect(() => {
    async function getUser() {
      try {
        const result = await getUserDetails(from);
        setUser(result);
      } catch (err) {
        throw new Error("Cant fetch the user details");
      }
    }
    getUser();
  }, [from]);

  if (!user)
    return (
      <MenuItem
        sx={{
          width: "18rem",
        }}
      >
        <Skeleton width={80} height={40} variant="circular" animation="wave" />
        <Stack ml={1} spacing={1}>
          <Skeleton width={90} variant="text" animation="wave" />
          <Skeleton width={210} variant="text" animation="wave" />
        </Stack>
      </MenuItem>
    );

  return (
    <MenuItem
      sx={{
        width: "18rem",
        paddingX: "8px",
      }}
    >
      <Avatar src={user.image} />
      <Stack width={"100%"} marginLeft={1}>
        <Stack
          width={"100%"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <ListItemText
            sx={{
              "& > span": {
                fontWeight: 700,
                lineHeight: "100%",
                marginBottom: "8px",
              },
            }}
          >
            {user.name}
          </ListItemText>
          {props.groupId && <GroupIcon />}
        </Stack>
        {props.message && (
          <Typography
            sx={{
              lineHeight: "1",
              marginBottom: "4px",
            }}
            variant="inherit"
            noWrap
          >
            {props.message}
          </Typography>
        )}
        {props.media.length > 0 && (
          <Typography lineHeight={1} variant="inherit">
            +{props.media.length} Media Files
          </Typography>
        )}
      </Stack>
    </MenuItem>
  );
}
