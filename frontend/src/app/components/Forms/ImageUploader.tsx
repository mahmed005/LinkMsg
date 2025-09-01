"use client";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Avatar, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Props = {
  file?: File;
  changeFile?: Dispatch<SetStateAction<File | undefined>>;
  defaultImage?: string;
};

export default function ImageUploader({
  changeFile,
  defaultImage,
}: Props) {
  const [preview, setPreview] = useState<string | undefined>(defaultImage);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const currFile = acceptedFiles[0];
    if (!currFile) return;
    if (changeFile) changeFile(currFile);
    setPreview(URL.createObjectURL(currFile));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  return (
    <div className="w-full flex justify-center">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Box
            sx={{
              backgroundColor: "action.active",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
            }}
            width={50}
            height={50}
          >
            <AddIcon
              sx={{
                color: "background.paper",
              }}
            />
          </Box>
        ) : (
          <Avatar
            sx={{
              width: 50,
              height: 50,
            }}
            src={preview}
          />
        )}
      </div>
    </div>
  );
}
