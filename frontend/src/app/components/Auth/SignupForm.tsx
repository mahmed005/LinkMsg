"use client";

import { Button, Stack, Tooltip, Typography } from "@mui/material";
import AuthTextField from "./AuthTextField";
import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/app/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { postMediaURL, signUp } from "@/app/utils/actions";
import InfoIcon from "@mui/icons-material/Info";
import ImageUploader from "../Forms/ImageUploader";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

type formInput = z.infer<typeof signUpSchema>;

export default function SignupForm() {
  const [file, setFile] = useState<File | undefined>(undefined);

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<formInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const isFormValid = isDirty && isValid;

  const onSubmit = async (data: formInput) => {
    let returnedValues = null;
    if (file) {
      try {
        returnedValues = await postMediaURL(file.type);
        await axios.put(returnedValues.url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      } catch (err) {
        throw Error("Something went wrong while uploading your image");
      }
    }
    if (returnedValues) data.image = returnedValues.key;
    await signUp(data);
  };

  return (
    <Stack
      padding={4}
      width={"100%"}
      height={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Stack
        width={{
          xs: "90%",
          sm: "60%",
          md: "40%",
        }}
        sx={{
          borderRadius: 4,
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          padding: 2,
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        alignItems={"center"}
      >
        <Stack alignItems={"center"} spacing={0} marginBottom={3}>
          <Typography
            letterSpacing={-1}
            variant="h4"
            sx={{
              fontWeight: "700",
            }}
            color="primary"
          >
            Join Us&#33;
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Want to catch up with your homiez&#63; Join us
          </Typography>
        </Stack>
        <Stack marginBottom={3} width={"90%"} spacing={2}>
          <AuthTextField
            name="name"
            register={register}
            placeholder="Full Name"
            type="text"
            isError={!!errors.name}
          />
          <AuthTextField
            name="email"
            register={register}
            placeholder="Email"
            type="email"
            isError={!!errors.email}
          />
          <AuthTextField
            name="password"
            register={register}
            placeholder="Password"
            type="password"
            isError={!!errors.password}
          />
          <Stack>
            <Stack alignItems={"center"} direction={"row"} spacing={1}>
              <Typography variant="body1">Picture</Typography>
              <Tooltip title="Drag and drop your picture here">
                <InfoIcon
                  sx={{
                    width: "1.5rem",
                    height: "1.5rem",
                  }}
                />
              </Tooltip>
            </Stack>
            <ImageUploader
              defaultImage={undefined}
              file={file}
              changeFile={setFile}
            />
          </Stack>
        </Stack>
        <Button
          disabled={!isFormValid || isSubmitting}
          endIcon={!isSubmitting && <HowToRegIcon />}
          sx={{
            width: "40%",
            textTransform: "none",
            marginBottom: 2,
          }}
          variant="contained"
          type="submit"
        >
          {!isSubmitting ? "Sign Up" : "Submitting"}
        </Button>
        <Stack spacing={0}>
          <Typography width={"100%"} textAlign={"center"} variant="body2">
            Or
          </Typography>
          <Button
            sx={{
              textTransform: "none",
            }}
            variant="text"
            startIcon={<GoogleIcon />}
          >
            Continue with Google
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Typography variant="body2">Already a Member&#63;</Typography>
          <Button
            LinkComponent={Link}
            href="/login"
            endIcon={<LoginIcon />}
            sx={{
              textTransform: "none",
            }}
            variant="text"
          >
            Login
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
