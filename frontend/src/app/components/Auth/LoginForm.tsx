"use client";

import { Button, Stack, Typography } from "@mui/material";
import AuthTextField from "./AuthTextField";
import { useForm } from "react-hook-form";
import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Link from "next/link";
import { authenticate, signInFromGoogle } from "@/app/utils/actions";
import { useRouter } from "next/navigation";

export type formInput = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<formInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const { replace } = useRouter();

  const isFormValid = isDirty && isValid;

  const onSubmit = async (data: formInput) => {
    const response = await authenticate(data);
    console.log(response);
    if (response === undefined) replace("/");
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
        alignItems={"center"}
        onSubmit={handleSubmit(onSubmit)}
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
            Welcome Back&#33;
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Login to Continue linking with your fellas
          </Typography>
        </Stack>
        <Stack marginBottom={3} width={"90%"} spacing={2}>
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
        </Stack>
        <Button
          type="submit"
          endIcon={<LoginIcon />}
          sx={{
            width: "40%",
            textTransform: "none",
            marginBottom: 2,
          }}
          variant="contained"
          disabled={!isFormValid || isSubmitting}
        >
          Login
        </Button>
        <Stack spacing={0}>
          <Typography width={"100%"} textAlign={"center"} variant="body2">
            Or
          </Typography>
          <Button
            onClick={signInFromGoogle}
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
          <Typography variant="body2">Want to Register&#63;</Typography>
          <Button
            LinkComponent={Link}
            href="/signup"
            endIcon={<HowToRegIcon />}
            sx={{
              textTransform: "none",
            }}
            variant="text"
          >
            Sign Up
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
