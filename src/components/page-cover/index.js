import React from "react";
import ProfileImg from "../image-box/profile-img";
import { Box, Typography } from "@mui/material";
import constants from "@/services/constants";

import { useSelector } from "react-redux";
export default function PageCover({ img, title, children,noUpdate }) {
  return (
    <Box
      sx={{
        background: "linear-gradient(90.48deg, #1C4F92 0%, #2D3642 97.81%)",
        borderRadius: "24px",
        minHeight: "200px",
        padding: { xs: "24px", md: "30px" },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        flexWrap: { xs: "wrap", md: "nowrap" },
        my:"2rem"
      }}
    >
      {/************ */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <ProfileImg src={img} defultSrc="/images/company.svg" noUpdate />
        <Typography
          sx={{
            fontSize: "2rem",
            color: "#fff",
            display: "inline-block",
          }}
        >
          {title}
        </Typography>
      </Box>

      {/******notification-2****** */}
      {children}
    </Box>
  );
}
