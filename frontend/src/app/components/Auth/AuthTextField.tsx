"use client";

import { TextField } from "@mui/material";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  register: UseFormRegister<T>;
  placeholder: string;
  type: "text" | "password" | "email";
  isError?: boolean;
};

export default function AuthTextField<T extends FieldValues>({
  name,
  register,
  placeholder,
  type,
  isError = false,
}: InputProps<T>) {
  return (
    <TextField
      sx={{
        "& .MuiInputBase-input": {
          padding: "0.75rem 0.5rem",
        },
        "& .MuiFormLabel-root": {
          transform: "translate(0.75rem, 0.5rem)",
          lineHeight: "2rem",
        },
        "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
          {
            transform: "translate(14px, -9px) scale(0.75)",
          },
      }}
      {...register(name)}
      name={name}
      fullWidth
      label={placeholder}
      type={type}
      error={isError}
    />
  );
}
