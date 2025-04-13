"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import useWebSocketController from "@/hooks/useWebSocketController";
import { Swirl } from "ambient-cbg";

const categoryOptions = {
  "About OSHRM": ["About OSHRM", "Why OSHRM"],
  "OSHRM People": ["Board", "Team"],
  "Success Stories": [],
  Partners: [],
  "Professional Certifications": [],
  Upcoming: ["Coming soon", "Rest of the year"],
};

export default function Controller() {
  const router = useRouter();
  const { sendCategorySelection } = useWebSocketController();
  const [openCategory, setOpenCategory] = useState(null);
  const [selected, setSelected] = useState({ category: "", subcategory: "" });

  const bubbleBase = {
    backgroundImage: "linear-gradient(to top, #a3bded 0%, #6991c7 100%)",
    boxShadow: `rgba(45, 35, 66, 0.4) 0px 2px 4px,
                rgba(45, 35, 66, 0.3) 0px 7px 13px -3px,
                rgba(58, 65, 111, 0.5) 0px -3px 0px inset`,
    color: "#fff",
    width: "15rem",
    height: "15rem",
    borderRadius: "50%",
    display: "flex",
    fontFamily: '"JetBrains Mono", monospace',
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.75rem",
    padding: "0.5rem",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",
    textTransform: "none",
    flexShrink: 0,
    transition: "box-shadow 0.2s, transform 0.2s",
    "&:hover": {
      boxShadow: `rgba(45, 35, 66, 0.4) 0px 4px 8px,
                  rgba(45, 35, 66, 0.3) 0px 7px 13px -3px,
                  #3c4fe0 0px -3px 0px inset`,
      transform: "translateY(-2px)",
    },
  };

  const handleCategoryClick = (category, subcategories) => {
    if (openCategory === category) {
      setOpenCategory(null);
      setSelected({ category: "", subcategory: "" });
      sendCategorySelection("", "");
    } else if (subcategories.length === 0) {
      if (selected.category === category && selected.subcategory === "") {
        setSelected({ category: "", subcategory: "" });
        sendCategorySelection("", "");
      } else {
        setSelected({ category, subcategory: "" });
        sendCategorySelection(category, "");
      }
      setOpenCategory(null);
    } else {
      setOpenCategory(category);
      setSelected({ category: "", subcategory: "" });
      sendCategorySelection("", "");
    }
  };

  const handleSubBubbleClick = (category, subcategory) => {
    if (
      selected.category === category &&
      selected.subcategory === subcategory
    ) {
      setSelected({ category: "", subcategory: "" });
      sendCategorySelection("", "");
      setOpenCategory(null);
    } else {
      setSelected({ category, subcategory });
      sendCategorySelection(category, subcategory);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "4rem",
        position: "relative",
        overflow: "hidden",
        px: "3rem",
        textAlign: "center",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Swirl />
      </Box>

      <IconButton
        sx={{ position: "absolute", top: 20, left: 20, color: "#fff", zIndex: 99 }}
        onClick={() => router.push("/")}
      >
        <ArrowBackIcon />
      </IconButton>

      {Object.entries(categoryOptions).map(([category, subcategories]) => {
        const isActiveMain = selected.category === category && !selected.subcategory;

        return (
          <motion.div
            key={category}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={isActiveMain ? { scale: 1.1, rotate: [0, 2, -2, 0] } : {}}
            transition={{ duration: 0.5 }}
            style={{
              ...bubbleBase,
              backgroundImage: isActiveMain
                ? "linear-gradient(to top, #64b5f6 0%, #1e88e5 100%)"
                : bubbleBase.backgroundImage,
              boxShadow: isActiveMain
                ? "0 0 20px rgba(33, 150, 243, 0.8)"
                : bubbleBase.boxShadow,
            }}
            onClick={() => handleCategoryClick(category, subcategories)}
          >
            {category}

            {openCategory === category && subcategories.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "120%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "row",
                  gap: { sm: 4, md: "7rem" },
                  zIndex: 10,
                }}
              >
                {subcategories.map((subcat) => {
                  const isActiveSub =
                    selected.category === category &&
                    selected.subcategory === subcat;

                  return (
                    <motion.div
                      key={subcat}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={isActiveSub ? { scale: 1.1, rotate: [0, 3, -3, 0] } : {}}
                      transition={{ duration: 0.5 }}
                      style={{
                        ...bubbleBase,
                        width: "8rem",
                        height: "8rem",
                        fontSize: "1.25rem",
                        backgroundImage: isActiveSub
                          ? "linear-gradient(to top, #64b5f6 0%, #1e88e5 100%)"
                          : "linear-gradient(120deg, #4facfe 0%, #00f2fe 100%)",
                        boxShadow: isActiveSub
                          ? "0 0 15px rgba(0, 255, 255, 0.8)"
                          : "0 0 12px rgba(102, 166, 255, 0.6)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubBubbleClick(category, subcat);
                      }}
                    >
                      {subcat}
                    </motion.div>
                  );
                })}
              </Box>
            )}
          </motion.div>
        );
      })}

      <Typography
        variant="h5"
        sx={{
          position: "absolute",
          bottom: 30,
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          width: "100%",
        }}
      >
        Tap a category to explore its contents
      </Typography>
    </Box>
  );
}
