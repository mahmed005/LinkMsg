"use client";

import {
  Avatar,
  Badge,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { User } from "next-auth";
import { useState } from "react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOutFromApp } from "@/app/utils/actions";
import { socketStore } from "@/app/store/SocketStore";
import NotificationsSkeleton from "./NotificationsSkeleton";
import Link from "next/link";
import NotificationItem from "./NotificationItem";

type Props = {
  user: User | undefined;
  image: string | null | undefined;
};

export default function NotificationsClient({ user, image }: Props) {
  const [settingsEl, setSettingsEl] = useState<HTMLButtonElement | null>(null);
  const isSettingsopen = !!settingsEl;
  const [notificationsEl, setNotificationsEl] =
    useState<HTMLButtonElement | null>(null);
  const areNotificationsOpen = !!notificationsEl;
  const isFetching = socketStore((state) => state.isFetching);
  const notifications = socketStore((state) => state.notifications);
  const { clearNotifications } = socketStore.getState();

  function handleSettingsClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (settingsEl) setSettingsEl(null);
    else setSettingsEl(e.currentTarget);
  }

  function handleNotificationsClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (notificationsEl) setNotificationsEl(null);
    else setNotificationsEl(e.currentTarget);
  }

  function handleNotificationsClose() {
    setNotificationsEl(null);
    if (notifications.length !== 0) clearNotifications();
  }

  function handleSettingsClose() {
    setSettingsEl(null);
  }

  return (
    <Stack direction="row" className="items-center gap-5 mr-6">
      <Button
        sx={{
          alignItems: "center",
          textTransform: "none",
          fontSize: "1.125rem",
          fontWeight: 400,
          color: "black",
        }}
        variant="text"
        LinkComponent={Link}
        href="/groups"
      >
        Groups
      </Button>
      <Button
        sx={{
          alignItems: "center",
          textTransform: "none",
          fontSize: "1.125rem",
          fontWeight: 400,
          color: "black",
        }}
        variant="text"
        LinkComponent={Link}
        href="/chats"
      >
        Chats
      </Button>
      <IconButton onClick={handleNotificationsClick} color="primary">
        <Badge badgeContent={!isFetching && notifications.length}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="notifications-menu"
        open={areNotificationsOpen}
        anchorEl={notificationsEl}
        onClose={handleNotificationsClose}
      >
        {isFetching && <NotificationsSkeleton />}
        {!isFetching && !notifications.length && (
          <MenuItem onClick={handleNotificationsClose}>
            <ListItemText>You have no notifications</ListItemText>
          </MenuItem>
        )}
        {!isFetching &&
          notifications.length > 0 &&
          notifications.map((notification, index) => (
            <NotificationItem key={index} {...notification} />
          ))}
      </Menu>
      <Stack direction="row" className="items-center">
        <IconButton onClick={handleSettingsClick}>
          <Avatar src={image as string | undefined} />
        </IconButton>
        <Menu
          id="settings-menu"
          anchorEl={settingsEl}
          open={isSettingsopen}
          onClose={handleSettingsClose}
        >
          <MenuItem
            onClick={signOutFromApp}
            sx={{
              gap: "0.25rem",
            }}
          >
            <ListItemText
              sx={{
                color: "error.main",
              }}
            >
              Logout
            </ListItemText>
            <ListItemIcon
              sx={{
                color: "error.main",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
          </MenuItem>
        </Menu>
        <Typography variant="body2">{user?.name}</Typography>
      </Stack>
    </Stack>
  );
}
