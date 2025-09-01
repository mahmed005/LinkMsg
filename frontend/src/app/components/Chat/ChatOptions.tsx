import FriendCard from "./FriendCard";
import GroupCard from "./GroupCard";
import { StateProps } from "./ChatsClient";
import { Stack, Typography } from "@mui/material";

export default function ChatOptions({
  friends,
  groups,
  selected,
  setChat,
}: {
  friends: any[];
  groups: any[];
  selected: StateProps | null;
  setChat: React.Dispatch<React.SetStateAction<StateProps | null>>;
}) {
  return (
    <div className="fixed top-[calc(100px+1.125rem+40px)] left-0 w-[30dvw] h-[calc(100dvh-(100px+1.125rem+40px))] overflow-x-hidden overflow-y-auto">
      <Stack
        spacing={1}
        width="100%"
        padding={2}
        sx={{ backgroundColor: "#EFEFEF" }}
      >
        <Typography variant="subtitle1">Friends</Typography>
        {friends.map((friend) => (
          <FriendCard
            key={friend._id}
            setChat={setChat}
            isSelected={
              selected?._id === friend._id && selected?.type === "friend"
            }
            {...friend}
          />
        ))}
        {groups.map((group) => (
          <GroupCard
            key={group._id}
            setChat={setChat}
            isSelected={
              selected?._id === group._id && selected?.type === "group"
            }
            {...group}
          />
        ))}
      </Stack>
    </div>
  );
}
