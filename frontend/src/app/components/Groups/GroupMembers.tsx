import { getUserDetails } from "@/app/utils/actions";
import { Avatar, AvatarGroup } from "@mui/material";
import mongoose from "mongoose";

export default async function GroupMembers({
  members,
}: {
  members: mongoose.Types.ObjectId[];
}) {
  const userImages = await Promise.all(
    members.map(async (member, index) => {
      if (index === 4) return undefined;
      return await getUserDetails(String(member));
    })
  );

  return (
    <AvatarGroup
      sx={{
        flexDirection: "row",
        justifyContent: "center",
      }}
      max={4}
    >
      {userImages.map((user) => (
        <Avatar src={user?.image} />
      ))}
    </AvatarGroup>
  );
}
