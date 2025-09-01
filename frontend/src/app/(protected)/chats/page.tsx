import ChatsClient from "@/app/components/Chat/ChatsClient";
import { getFriendsFull, getGroups } from "@/app/utils/actions";

export default async function Page() {
  const friends = await getFriendsFull();
  const groups = await getGroups();
  return <ChatsClient friends={friends} groups={groups} />;
}
