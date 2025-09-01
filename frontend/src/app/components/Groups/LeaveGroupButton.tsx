"use client";

import { leaveGroup } from "@/app/utils/actions";
import { Button } from "@mui/material";
import GroupOffIcon from "@mui/icons-material/GroupOff";

export default function LeaveGroupButton({ id }: { id: string }) {
  async function leaveGroupHandler() {
    await leaveGroup(id);
  }

  return (
    <Button
      onClick={leaveGroupHandler}
      sx={{
        marginTop: "20px",
        backgroundColor: "white",
        textTransform: "none",
        color: "#FF4747",
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "140%",
        borderRadius: "20px",
      }}
      fullWidth
      endIcon={<GroupOffIcon />}
    >
      Leave Group
    </Button>
  );
}
