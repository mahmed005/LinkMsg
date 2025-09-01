import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Session } from "next-auth";

export default async function TotalFriendsCard({
  session,
  title,
  serverAction,
}: {
  session: Session | null | undefined;
  title: string;
  serverAction: (userId: string) => Promise<number>;
}) {
  const value = await serverAction(session?.user?.id as string);

  return (
    <Card
      sx={{
        width: "11.25rem",
        height: "7rem",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
      }}
    >
      <CardHeader
        sx={{
          padding: 0,
          "& .MuiTypography-root": {
            paddingTop: "1.5rem",
            paddingBottom: "0.75rem",
            fontSize: "1.125rem",
            fontWeight: "300",
            textAlign: "center",
            letterSpacing: "0.2px",
          },
        }}
        title={title}
      />
      <CardContent
        sx={{
          paddingTop: 0,
        }}
      >
        <Typography
          padding={0}
          width={"100%"}
          textAlign={"center"}
          variant="h6"
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
