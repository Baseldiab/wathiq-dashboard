import constants from "@/services/constants";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function File({ href = "#", type, title, underline }) {
  return (
    <Box
      component={Link}
      href={href || "#"}
      target="_blank"
      sx={{
        flex: 1,
        alignItems: "center",
        display: "flex",
        mt: 1,
        textDecoration: underline ? "underline" : "none",
        color: constants.colors.dark_green,
      }}
    >
      <img
        src={type == "pdf" ? "/images/icons/pdf.svg" : "/images/icons/jpg.svg"}
      />
      <Typography
        sx={{
          color: "#202726",
          fontSize: "0.9rem",
          fontWeight: 600,
          mx: 1,
          display: "inline-block",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
