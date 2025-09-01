import { getFriendSuggestions } from "@/app/utils/actions";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Alert, Stack } from "@mui/material";
import SliderComponent from "./SliderComponent";

export default async function AddFriendsList() {
  const results = await getFriendSuggestions();

  if (!Array.isArray(results)) {
    return (
      <Stack alignSelf={"center"} alignItems={"center"} spacing={1} width="70%">
        {results.error.map((err: any, index: number) => (
          <Alert key={index} severity="error">
            {err.message}
          </Alert>
        ))}
      </Stack>
    );
  }

  if (results.length == 0) {
    return (
      <Stack alignItems={"center"} alignSelf={"center"} width={"70%"}>
        <Alert severity="success">You are all caught up</Alert>
      </Stack>
    );
  }

  return <SliderComponent results={results} />;
}
