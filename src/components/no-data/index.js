import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import CustomButton from "../button";

export default function NoData({ add, img, onClick, desc, btnTitle, role }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "100%", md: "400px" },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {img && <Image width={190} height={190} objectFit src={img} />}
      <Typography
        sx={{
          fontSize: "1.4rem",
          fontWeight: 600,
          color: "#202726",
          my: { xs: "16px" },
        }}
      >
        {desc}{" "}
      </Typography>
      {add && role && (
        <Box>
          <CustomButton
            handleClick={onClick}
            text={btnTitle}
            customeStyle={{ width: "200px" }}
          />
        </Box>
      )}
    </Box>
  );
}
