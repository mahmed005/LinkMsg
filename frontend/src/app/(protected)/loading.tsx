"use client";

import { CircularProgress, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Stack alignItems={"center"} justifyContent={"center"} width={"100%"}>
      <CircularProgress />
    </Stack>
  );
}
