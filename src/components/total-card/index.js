import constants from "@/services/constants";
import { formatNumber } from "@/services/utils";
import { Padding } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";

export default function TotalCard({ title, data, customStyle, amount }) {
  return (
    <Box
      sx={{
        border: "1px solid #EBEEF3",
        padding: "10px 20px",
        borderRadius: "20px",
        background: "#FFFFFF",
        ...customStyle,
      }}
    >
      <Typography sx={{ fontSize: "1rem", color: "#6F6F6F" }}>
        {title}
      </Typography>
      <Typography
        sx={{
          color: constants.colors.main,
          fontSize: amount ? "1.125rem" : "2rem",
          mt: amount ? 1 : 0,
        }}
      >
        {amount ? (
          <>
            {formatNumber(data)} {constants.symbol}
          </>
        ) : (
          data
        )}{" "}
      </Typography>
    </Box>
  );
}
