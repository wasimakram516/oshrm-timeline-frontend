"use client";
import { useRouter } from "next/navigation";
import { Box, IconButton, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useWebSocketBigScreen from "@/hooks/useWebSocketBigScreen";
import { Shift } from "ambient-cbg";

export default function BigScreenPage() {
  const router = useRouter();
  const { currentMedia, isLoading } = useWebSocketBigScreen();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, #004e7c, #9ddced)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 1, 
        }}
      >
        <Shift />
      </Box>

      <IconButton
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#fff",
          zIndex: 2,
        }}
        onClick={() => router.push("/")}
      >
        <ArrowBackIcon />
      </IconButton>

      {isLoading && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        />
      )}

      {!isLoading && !currentMedia && (
        <Typography
          variant="h4"
          sx={{
            color: "white",
            textAlign: "center",
            opacity: 0.6,
            zIndex: 2,
          }}
        >
          Select a category or subcategory from the controller
        </Typography>
      )}

      {!isLoading && currentMedia?.media?.type === "image" && (
        <Box
          component="img"
          src={currentMedia.media.url}
          alt="Display Image"
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 2,
          }}
        />
      )}

      {!isLoading && currentMedia?.media?.type === "video" && (
        <Box
          component="video"
          src={currentMedia.media.url}
          autoPlay
          muted
          loop
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            zIndex: 2,
          }}
        />
      )}
    </Box>
  );
}
