import { styles } from "@/components/globalStyle";
import { Box, Typography } from "@mui/material";
import React from "react";

export default function SectionHead({
  title,
  children,
  customStyle,
  childrenStyle,
  large,
  actions,
}) {
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        ...customStyle,
      }}
    >
      <Box
        sx={{
          ...styles.dataSpaceBetween,
        }}
      >
        <Typography
          sx={{
            fontSize: large ? "1.5rem" : "18px",
            fontWeight: 700,
            lineHeight: "24px",
            color: "#202726",
            mb: large ? 2 : 1,
          }}
        >
          {title}
        </Typography>
        {actions}
      </Box>

      <Box sx={{ ...childrenStyle }}> {children}</Box>
    </Box>
  );
}
