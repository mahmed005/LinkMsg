import { Stack, Typography } from "@mui/material";
import { Suspense } from "react";
import GroupsList from "@/app/components/Groups/GroupsList";
import AddGroupButton from "@/app/components/Groups/AddGroupButton";

export default async function Page() {
  return (
    <Stack width={"100%"} spacing={3}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Typography variant="h4">Groups Your in</Typography>
        <AddGroupButton />
      </Stack>
      <Suspense>
        <GroupsList />
      </Suspense>
    </Stack>
  );
}
