import { Box } from "@mui/material";
import React from "react";

export default function SAR({ img }) {
  return (
    <Box
      component="img"
      src={img}
      sx={{
        fontSize: "inherit",
        marginRight: "6px",
        display: "inline",
        width: { xs: "12px", md: "16px" },
      }}
    />
  );
}
