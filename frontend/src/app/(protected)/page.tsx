import { Stack, Typography } from "@mui/material";
import HomeCard from "../components/Home/HomeCard";
import { Suspense } from "react";
import HomeCardSkeleton from "../components/Home/HomeCardSkeleton";
import { auth } from "@/auth";
import { getFriends, getTotalUsers } from "@/app/utils/actions";
import AddFriendsList from "../components/Home/AddFriendsList";

export default async function Home() {
  const session = await auth();
  return (
    <Stack className="pt-[4.125rem]" spacing={"6.625rem"} width={"100%"}>
      <Stack spacing={"6.625rem"}>
        <Typography variant="h3">Platform Details</Typography>
        <Stack direction={"row"} gap={"1rem"} justifyContent={"center"}>
          <Suspense fallback={<HomeCardSkeleton />}>
            <HomeCard
              serverAction={getFriends}
              title="Your total friends"
              session={session}
            />
          </Suspense>
          <Suspense fallback={<HomeCardSkeleton />}>
            <HomeCard
              serverAction={getTotalUsers}
              title="Total Users"
              session={session}
            />
          </Suspense>
        </Stack>
      </Stack>
      <Stack width={"100%"} spacing={"6.625rem"}>
        <Typography variant="h3">Make some friends</Typography>
        <AddFriendsList />
      </Stack>
    </Stack>
  );
}
