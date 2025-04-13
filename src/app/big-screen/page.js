"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useWebSocketBigScreen from "@/hooks/useWebSocketBigScreen";
import { Shift } from "ambient-cbg";

export default function BigScreenPage() {
  const router = useRouter();
  const { currentMedia, isLoading } = useWebSocketBigScreen();
  const [showContent, setShowContent] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setShowContent(false);
    } else {
      const timer = setTimeout(() => {
        setShowLoader(false);
        setShowContent(true);
      }, 1000); // force loader to stay for 1s after loading ends

      return () => clearTimeout(timer);
    }
  }, [isLoading, currentMedia]);

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

      {/* LOADING ANIMATION */}
      {showLoader && (
        <Box
          component="img"
          src="Animation-unscreen.gif"
          alt="Loading"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "150px",
            height: "auto",
            zIndex: 3,
          }}
        />
      )}

      {/* DEFAULT IDLE STATE */}
      {!isLoading && showContent && !currentMedia && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            zIndex: 2,
          }}
        >
          <Box
            component="img"
            src="OSHRM.png"
            alt="Display Image"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <Box
            component="img"
            src="arrow.gif"
            alt="Arrow"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "110px",
              height: "auto",
              zIndex: 3,
            }}
          />
        </Box>
      )}

      {/* IMAGE DISPLAY */}
      {!isLoading && showContent && currentMedia?.media?.type === "image" && (
        <Box
          component="img"
          src={currentMedia.media.url}
          alt="Display Image"
          sx={{
            position: "relative",
            width: "90vw",
            height: "auto",
            objectFit: "contain",
            borderRadius: "5rem",
            zIndex: 2,
          }}
        />
      )}

      {/* VIDEO DISPLAY */}
      {!isLoading && showContent && currentMedia?.media?.type === "video" && (
        <Box
          component="video"
          src={currentMedia.media.url}
          autoPlay
          muted
          loop
          sx={{
            position: "relative",
            width: "90vw",
            height: "auto",
            objectFit: "contain",
            borderRadius: "5rem",
            zIndex: 2,
          }}
        />
      )}
    </Box>
  );
}
