"use client";

import { Box, IconButton, InputBase, Stack } from "@mui/material";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import SendIcon from "@mui/icons-material/Send";
import { ChangeEvent, useContext, useRef, useState } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { getMediaUrl, postMediaURL } from "@/app/utils/actions";
import axios from "axios";
import { Message, socketStore } from "@/app/store/SocketStore";
import { AuthContext } from "../Providers/AuthProvider";

let index = 0;

type FileProps = {
  id: number;
  file: File;
};

type PreviewProps = {
  id: number;
  preview: string;
};

export default function ChatFooter({ id, type }: { id: string; type: string }) {
  const context = useContext(AuthContext);
  const addMessage = socketStore((state) => state.addMessage);
  const socket = socketStore((state) => state.socket);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<FileProps[]>([]);
  const [previews, setPreviews] = useState<PreviewProps[]>([]);

  function handleMediaSelect() {
    if (inputRef) inputRef.current?.click();
  }

  function inputChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const currFiles = e.currentTarget.files;
    if (!currFiles) return;
    const filesArr: FileProps[] = [];
    const previews: PreviewProps[] = [];
    for (let i = 0; i < currFiles.length; i++) {
      filesArr.push({ id: index, file: currFiles[i] });
      previews.push({
        id: index++,
        preview: URL.createObjectURL(currFiles[i]),
      });
    }
    setFiles((files) => [...files, ...filesArr]);
    setPreviews((currPreviews) => [...previews, ...currPreviews]);
  }

  async function handleMessageSend() {
    if (messageRef.current?.value.trim() === "" && !files.length) return;

    const message = messageRef.current?.value.trim();

    const media = [];
    if (files.length) {
      for (const file of files) {
        try {
          const uploadUrl = await postMediaURL(file.file.type);
          await axios.put(uploadUrl.url, file.file, {
            headers: {
              "Content-Type": file.file.type,
            },
          });
          media.push(uploadUrl.key);
        } catch (err) {
          console.error(err);
          throw new Error("There was an error uploading your files");
        }
      }
    }
    const sendMessage: Message = {
      to: type === "group" ? "Group" : "Individual",
      receiverId: type === "group" ? undefined : id,
      media,
      from: context?.session?.user?.id as string,
      groupId: type === "group" ? id : undefined,
    };

    if (message) sendMessage.message = message;

    socket?.emit("send-message", sendMessage);
    for (let i = 0; i < media.length; i++) {
      const url = await getMediaUrl(media[i]);
      sendMessage.media[i] = url;
    }
    if (type === "friend") addMessage(sendMessage);
    setPreviews([]);
    setFiles([]);
    if (messageRef.current) messageRef.current.value = "";
  }

  return (
    <Stack
      sx={{
        position: "absolute",
        height: "10%",
      }}
      className="w-[calc(100%-16px)] bottom-[calc(0%+16px)] left-[8px]"
      direction={"row"}
      alignItems={"center"}
      spacing={2}
    >
      {previews.length > 0 && (
        <Stack
          sx={{
            backgroundColor: "transparent",
          }}
          position={"absolute"}
          top={"-108px"}
          width={"100%"}
          height={"108px"}
          padding={1}
          direction={"row"}
        >
          {previews.map((preview) => (
            <Box height={"100%"} position={"relative"} key={preview.id}>
              <Image
                className="shadow-[1px 0 0 5px rgba(0, 0, 0, 0.2)] h-full"
                src={preview.preview}
                width={100}
                height={100}
                alt={preview.preview + "-media"}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
              <IconButton
                sx={{
                  position: "absolute",
                  top: "-10%",
                  zIndex: 10,
                  right: "-10%",
                  backgroundColor: "background.paper",
                  padding: 0.5,
                  "&:hover": {
                    backgroundColor: "background.paper",
                  },
                }}
                onClick={() => {
                  setFiles((state) =>
                    state.filter((file) => file.id !== preview.id)
                  );
                  setPreviews((state) =>
                    state.filter((file) => file.id !== preview.id)
                  );
                }}
              >
                <CloseIcon
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}
      <InputBase
        inputRef={messageRef}
        sx={{
          flex: 1,
          backgroundColor: "#efefef",
          borderRadius: "30px",
          paddingX: "20px",
          paddingY: "0.5rem",
        }}
        placeholder="Enter your message"
        inputProps={{ "aria-label": "send message" }}
      />
      <IconButton onClick={handleMediaSelect}>
        <PermMediaIcon />
      </IconButton>
      <input
        onChange={inputChangeHandler}
        accept="image/*, video/*"
        ref={inputRef}
        type="file"
        hidden
      />
      <IconButton onClick={handleMessageSend}>
        <SendIcon />
      </IconButton>
    </Stack>
  );
}
