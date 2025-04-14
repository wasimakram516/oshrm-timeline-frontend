"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import useWebSocketController from "@/hooks/useWebSocketController";
import { Swirl } from "ambient-cbg";

// Category data: same as your current code
const categoryOptions = {
  "About OSHRM": ["About OSHRM", "Why OSHRM", "OSHRM Arms"],
  "OSHRM People": ["Board", "Team"],
  "Success Stories": ["Success Stories", "Conferences"],
  Partners: ["2025 Sponsors", "Partners"],
  "Professional Certifications": [],
  Upcoming: ["Coming soon", "2025 Calendar"],
};

export default function Controller() {
  const router = useRouter();
  const { sendCategorySelection } = useWebSocketController();

  // Track which category is "open" (showing sub-bubbles) & which is "selected"
  const [openCategory, setOpenCategory] = useState(null);
  const [selected, setSelected] = useState({ category: "", subcategory: "" });

  // ⏰ Inactivity timer: If user selects real content (subcat or no-subcat cat),
  // we start/refresh a 90s timer. After 90s inactivity, revert to idle.
  useEffect(() => {
    // If NOTHING is selected, no need for a timer
    if (!selected.category && !selected.subcategory) return;

    // If there's some selected content, start a 90s timer
    const timer = setTimeout(() => {
      // Revert everything back to idle
      setSelected({ category: "", subcategory: "" });
      setOpenCategory(null);
      sendCategorySelection("", "");
    }, 90000); // 90 seconds

    // If the user makes another selection before 90s, clear & restart timer
    return () => clearTimeout(timer);
  }, [selected, sendCategorySelection]);

  // Bubble style base
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

  // Only show media on the Big Screen if a category is truly selected
  // (i.e. a category with no subcats, or a subcategory).
  const handleCategoryClick = (category, subcategories) => {
    // 1) If user reclicks the open category => close it & clear Big Screen
    if (openCategory === category) {
      setOpenCategory(null);
      setSelected({ category: "", subcategory: "" });
      sendCategorySelection("", "");
    } 
    // 2) If no subcats => show media right away
    else if (subcategories.length === 0) {
      if (selected.category === category && selected.subcategory === "") {
        // It was already selected => deselect
        setSelected({ category: "", subcategory: "" });
        sendCategorySelection("", "");
      } else {
        // Actually select it
        setSelected({ category, subcategory: "" });
        sendCategorySelection(category, "");
      }
      setOpenCategory(null);
    } 
    // 3) Category with subcats => just open sub-bubbles, no media load
    else {
      setOpenCategory(category);
      setSelected({ category: "", subcategory: "" });
      // (no sendCategorySelection here => we haven't actually chosen subcat)
    }
  };

  const handleSubBubbleClick = (category, subcategory) => {
    // Subcategory => triggers real selection
    if (
      selected.category === category &&
      selected.subcategory === subcategory
    ) {
      // Reselecting the same => clear
      setSelected({ category: "", subcategory: "" });
      sendCategorySelection("", "");
      setOpenCategory(null);
    } else {
      // Actually choose this subcat
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
      {/* Background swirl */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Swirl />
      </Box>

      {/* Back button */}
      <IconButton
        sx={{ position: "absolute", top: 20, left: 20, color: "#fff", zIndex: 99 }}
        onClick={() => router.push("/")}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Render main categories */}
      {Object.entries(categoryOptions).map(([category, subcategories]) => {
        const isActiveMain =
          selected.category === category && !selected.subcategory;

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

            {/* Render subcategories if open */}
            {openCategory === category && subcategories.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "120%",
                  left: "50%",
                  transform: {
                    xs: "translateX(-50%)",
                    md:
                      category === "About OSHRM"
                        ? "translateX(-30%)"
                        : category === "Upcoming"
                        ? "translateX(-50%)"
                        : "translateX(-50%)",
                  },
                  display: "flex",
                  flexDirection: "row",
                  gap: { sm: 2, md: "3rem" },
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
                      animate={
                        isActiveSub
                          ? { scale: 1.1, rotate: [0, 3, -3, 0] }
                          : {}
                      }
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
