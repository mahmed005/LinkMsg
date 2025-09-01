"use client";

import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ImageUploader from "../Forms/ImageUploader";
import { addGroup, getFriendsFull, postMediaURL } from "@/app/utils/actions";
import axios from "axios";
import { AuthContext } from "../Providers/AuthProvider";

type SelectedMembersProps = {
  id: string;
  name: string;
};

export default function AddGroupButton() {
  const [isClicked, setIsClicked] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [selectedMembers, setSelectedMembers] = useState<
    SelectedMembersProps[]
  >([]);
  const [friends, setFriends] = useState<any | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const context = useContext(AuthContext);

  async function handleCreateGroup() {
    if (!inputRef.current || inputRef.current.value === "") return;
    let fileName = undefined;
    if (file) {
      const uri = await postMediaURL(file.type);
      const response = await axios.put(uri.url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      fileName = uri.key;
    }
    if (fileName) {
      await addGroup({
        name: inputRef.current.value,
        members: [
          ...selectedMembers.map((member) => member.id),
          context?.session?.user?.id as string,
        ],
        image: fileName,
      });
    } else
      await addGroup({
        name: inputRef.current.value,
        members: [
          ...selectedMembers.map((member) => member.id),
          context?.session?.user?.id as string,
        ],
      });
    setIsClicked(false);
  }

  useEffect(() => {
    async function getFriends() {
      const response = await getFriendsFull();
      setFriends(response);
    }

    if (friends) return;
    getFriends();
  }, [friends]);

  function handleClose() {
    setIsClicked(false);
  }

  function handleOpen() {
    setIsClicked(true);
  }

  function handleCheckboxChange(
    e: ChangeEvent<HTMLInputElement>,
    id: string,
    name: string
  ) {
    if (e.target.checked)
      setSelectedMembers((prevMembers) => [...prevMembers, { id, name }]);
    else {
      setSelectedMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== id)
      );
    }
  }

  return (
    <>
      <Button
        sx={{
          borderRadius: "30px",
          padding: "16px 36px",
          fontSize: "18px",
          lineHeight: "23px",
          textTransform: "none",
          fontWeight: "700",
        }}
        variant="contained"
        onClick={handleOpen}
        endIcon={<GroupAddOutlinedIcon />}
      >
        Add Group
      </Button>
      <Backdrop
        sx={{
          zIndex: 1000,
        }}
        open={isClicked}
      >
        <Stack
          sx={{
            backgroundColor: "white",
          }}
          width={"400px"}
          height={"540px"}
          padding={2}
          borderRadius={"12px"}
        >
          <Stack
            justifyContent={"space-between"}
            alignItems={"center"}
            direction={"row"}
          >
            <Typography variant="h6">Add Group</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Box marginTop={"28px"} component={"form"}>
            <Typography marginBottom={"22px"} variant="body2">
              Image
            </Typography>
            <ImageUploader file={file} changeFile={setFile} />
            <Typography
              marginTop={"42px"}
              marginBottom={"10px"}
              variant="body2"
            >
              Group Name
            </Typography>
            <InputBase
              inputRef={inputRef}
              placeholder="Name"
              fullWidth
              sx={{
                border: "1px solid",
                borderColor: "#D9D9D9",
                paddingX: "16px",
                paddingY: "2px",
                borderRadius: "8px",
                marginBottom: "28px",
              }}
            />
            <Typography marginBottom={"16px"} variant="body2">
              Select Members
            </Typography>
            <Box
              sx={{
                backgroundColor: "#C8E3C9",
              }}
              maxHeight={"100px"}
              overflow={"auto"}
              width={"100%"}
              paddingY={"12px"}
              paddingX={"10px"}
            >
              {!friends && <CircularProgress color="success" />}
              {friends && (
                <>
                  <Stack
                    sx={{
                      backgroundColor: "#D4EAD5",
                      marginBottom: "12px",
                    }}
                    direction={"row"}
                    gap={"4px"}
                    padding={"2px"}
                    alignItems={"center"}
                    height={"22px"}
                  >
                    {selectedMembers.map((member) => (
                      <Typography
                        key={member.id}
                        sx={{
                          backgroundColor: "white",
                          padding: "2px 4px",
                          borderRadius: "7px",
                        }}
                        fontFamily={"Lato"}
                        fontSize={"12px"}
                      >
                        {member.name}
                      </Typography>
                    ))}
                  </Stack>
                  <Stack overflow={"auto"} gap={"8px"}>
                    {friends.map((friend: any) => (
                      <Stack
                        sx={{
                          backgroundColor: "#C2DDBA",
                        }}
                        paddingY={"4px"}
                        paddingX={"6px"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        key={friend._id}
                        direction={"row"}
                      >
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          gap={"10px"}
                        >
                          <Avatar src={friend.image} />
                          <Typography
                            fontSize={"14px"}
                            fontWeight={"400"}
                            fontFamily={"Lato"}
                          >
                            {friend.name}
                          </Typography>
                        </Stack>
                        <Checkbox
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            handleCheckboxChange(e, friend._id, friend.name);
                          }}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </>
              )}
            </Box>
            <Button
              onClick={handleCreateGroup}
              variant="contained"
              sx={{
                marginTop: "1rem",
                textTransform: "none",
                borderRadius: "6px",
              }}
            >
              Create Group
            </Button>
          </Box>
        </Stack>
      </Backdrop>
    </>
  );
}
