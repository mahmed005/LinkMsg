"use client";

import { Stack, Typography } from "@mui/material";
import { Session } from "next-auth";
import NotificationsClient from "./NotificationsClient";
import Link from "next/link";

type Props = {
  session: Session | null;
  image: string | null | undefined;
};

export default function Header({ session, image }: Props) {
  return (
    <Stack
      className="fixed z-100 top-0 w-screen left-0 justify-between items-center h-[100px]"
      direction={"row"}
      sx={{
        backgroundColor: "white",
      }}
    >
      <Stack direction={"row"} className="gap-0.5 px-[3rem] items-center">
        <Link className="flex items-center gap-0.5" href={"/"}>
          <Typography variant="h2">Link</Typography>
          <Typography variant="h1">Msg</Typography>
        </Link>
      </Stack>
      <NotificationsClient image={image} user={session?.user} />
    </Stack>
  );
}
