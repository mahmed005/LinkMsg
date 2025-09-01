"use client";

import { addFriend } from "@/app/utils/actions";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Snackbar,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Slider from "react-slick";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

export default function SliderComponent({ results }: { results: any }) {
  const [firstOpen, setFirstOpen] = useState(false);
  const [secondOpen, setSecondOpen] = useState(false);

  const firstAction = (
    <Alert severity="success">Friend Added Successfully</Alert>
  );
  const secondAction = <Alert severity="error">Failed to add Friend</Alert>;

  async function handleAddFriend(id: any) {
    const result = await addFriend(id);
    if (result.success) {
      setFirstOpen(true);
    } else setSecondOpen(true);
  }

  const handleFirstClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setFirstOpen(false);
  };

  const handleSecondClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSecondOpen(false);
  };
  return (
    <div className="w-[90%] self-center">
      <Snackbar
        open={firstOpen}
        autoHideDuration={30}
        onClose={handleFirstClose}
        action={firstAction}
      />
      <Snackbar
        open={secondOpen}
        autoHideDuration={30}
        onClose={handleSecondClose}
        action={secondAction}
      />
      <Slider {...settings}>
        {results.map((result: any) => (
          <Card
            sx={{
              width: "10rem",
              height: "15rem",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
            }}
            key={result._id}
          >
            <CardMedia
              component={"img"}
              sx={{
                height: "5rem",
              }}
              image={result.image}
              alt={result.name + "-dp"}
            />
            <CardContent
              sx={{
                paddingX: "0.75rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography letterSpacing={"0.2px"} variant="body1">
                {result.name}
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                paddingX: "0.75rem",
                paddingTop: "3rem",
              }}
            >
              <Button
                fullWidth
                onClick={() => {
                  handleAddFriend(result._id);
                }}
                variant="contained"
              >
                Add Friend
              </Button>
            </CardActions>
          </Card>
        ))}
      </Slider>
    </div>
  );
}
