import { Box, Typography } from "@mui/material";
import React from "react";

export default function LabelData({
  label,
  value,
  withImg,
  img,
  customImgStyle,
}) {
  return (
    <Box sx={{ flex: 1 }}>
      {withImg ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            style={{
              height: "72px",
              width: "72px",
              borderRadius: "8px",
              display: "",
              ...customImgStyle,
            }}
            src={img}
          />
          <Box sx={{}}>
            <Typography
              sx={{
                color: "#6F6F6F",
                fontSize: "0.85rem",
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{ color: "#202726", fontSize: "0.9rem", fontWeight: 600 }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Typography
            sx={{
              color: "#6F6F6F",
              fontSize: "0.85rem",
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{ color: "#202726", fontSize: "0.9rem", fontWeight: 600 }}
          >
            {value}
          </Typography>
        </>
      )}
    </Box>
  );
}
