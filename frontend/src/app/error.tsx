"use client";

import { Button, Stack, Typography } from "@mui/material";

export default function main({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log(error);

  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={"100%"}
    >
      <Typography variant="body1">Something Went Wrong</Typography>
      <Button
        onClick={() => {
          reset();
        }}
        variant="contained"
      >
        Try Again
      </Button>
    </Stack>
  );
}
