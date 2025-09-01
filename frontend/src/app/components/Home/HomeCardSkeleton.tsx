"use client";

import { Card, Skeleton } from "@mui/material";

export default function FriendsCardSkeleton() {
  return (
    <Card>
      <Skeleton animation="wave" variant="text" width={"80%"} />
      <Skeleton animation="wave" variant="text" width={"40%"} />
    </Card>
  );
}
