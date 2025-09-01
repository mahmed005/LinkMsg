import { getGroups } from "@/app/utils/actions";
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import GroupMembers from "./GroupMembers";
import CheckIcon from "@mui/icons-material/Check";
import mongoose from "mongoose";
import LeaveGroupButton from "./LeaveGroupButton";

export default async function GroupsList() {
  const groups = await getGroups();

  if (Array.isArray(groups) && groups.length === 0) {
    return (
      <Stack alignItems={"center"} justifyContent={"center"}>
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          You are all caught up
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      rowGap={"30px"}
      columnGap={"30px"}
    >
      {Array.isArray(groups) &&
        groups.map((group) => (
          <Card
            sx={{
              boxShadow: "none",
              padding: "0",
              paddingBottom: "28px",
              backgroundColor: "#C8E3C9",
              borderRadius: "7px",
              width: "33.33%",
            }}
            key={group._id as string}
          >
            {group.image && (
              <CardMedia
                height={"220px"}
                width={"100%"}
                component={"img"}
                src={group.image}
              />
            )}
            {!group.image && (
              <Box
                height={"220px"}
                sx={{
                  borderTopLeftRadius: "7px",
                  backgroundColor: "#BAD5B2",
                  borderTopRightRadius: "7px",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
                width={"100%"}
              >
                <GroupIcon
                  sx={{
                    width: "50px",
                    height: "50px",
                  }}
                />
              </Box>
            )}
            <CardContent
              sx={{
                padding: "0 !important",
                paddingX: "24px !important",
                marginTop: "10px",
              }}
            >
              <Typography
                textAlign={"center"}
                marginBottom={"20px"}
                variant="h3"
              >
                {group.name}
              </Typography>
              <GroupMembers
                members={group.members as mongoose.Types.ObjectId[]}
              />
              <CardActions
                sx={{
                  padding: 0,
                }}
              >
                <LeaveGroupButton id={String(group._id)} />
              </CardActions>
            </CardContent>
          </Card>
        ))}
    </Stack>
  );
}
