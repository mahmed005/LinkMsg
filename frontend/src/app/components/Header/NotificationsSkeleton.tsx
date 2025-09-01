"use client";

import { MenuItem, Skeleton, Stack } from "@mui/material";

export default function NotificationsSkeleton() {
  return (
    <MenuItem>
      {[1, 2].map((value) => (
        <Stack
          key={value}
          spacing={2}
          alignItems={"flex-start"}
          direction={"row"}
        >
          <Skeleton
            variant="circular"
            animation="wave"
            width={20}
            height={20}
          />
          <Stack spacing={3}>
            <Skeleton animation="wave" variant="text" width={"30%"} />
            <Stack spacing={0.5}>
              <Skeleton animation="wave" variant="text" width={"100%"} />
              <Skeleton animation="wave" variant="text" width={"100%"} />
            </Stack>
          </Stack>
        </Stack>
      ))}
    </MenuItem>
  );
}
