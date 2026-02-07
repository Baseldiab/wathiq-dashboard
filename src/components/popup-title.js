import React from "react";
import { Box, Typography } from "@mui/material";

export default function PopupTitle({ title, handleClose }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        mb: 1,
      }}
    >
      <Typography
        sx={{ fontSize: "1.3rem", fontWeight: 700, color: "#202726" }}
      >
        {title}
      </Typography>
      <img
        src="/images/icons/close-x.svg"
        style={{ cursor: "pointer" }}
        alt="close"
        onClick={handleClose}
      />
    </Box>
  );
}
