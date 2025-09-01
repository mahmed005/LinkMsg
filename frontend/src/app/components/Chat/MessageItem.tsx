"use client";

import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";

export default function MessageItem(props: any) {
  const context = useContext(AuthContext);
  return (
    <Card
      sx={{
        maxWidth: "80%",
        textWrap: "wrap",
        borderRadius: "7px",
        backgroundColor:
          context?.session?.user?.id === props.from ? "#2ED942" : "#efefef",
        alignSelf:
          context?.session?.user?.id === props.from ? "flex-end" : "flex-start",
        padding: "4px 4px !important",
        "& .MuiCardContent-root": {
          padding: "6px 7px !important",
        },
        "& .MuiCardMedia-root": {
          marginTop: "8px",
          borderRadius: "0",
        },
        boxShadow: "none",
      }}
    >
      {props.message && (
        <CardContent>
          <Typography
            sx={{
              color:
                context?.session?.user?.id === props.from ? "white" : "text",
            }}
            variant="body1"
          >
            {props.message}
          </Typography>
        </CardContent>
      )}
      {props.media &&
        props.media.map((image: any, index: number) => (
          <CardMedia key={index} component={"img"} image={image} />
        ))}
    </Card>
  );
}
