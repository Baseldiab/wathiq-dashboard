import SAR from "@/components/sar";
import constants from "@/services/constants";
import { formatNumber } from "@/services/utils";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

export default function BiddingDetail({
  title,
  price,
  equation,
  customStyle,
  img,
  noBorder,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: "6px",
        alignItems: "center",
        color: "#696969",
        borderBottom: noBorder ? "none" : "1px solid #EFEFEF",
        padding: "12px 0px",
      }}
    >
      <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {img && <Image src={img} width={24} height={24} />}

        <Typography sx={{ fontSize: "1rem", color: "#2E353F" }}>
          {title}
        </Typography>
      </Box>

      <Typography sx={{ fontWeight: "700", fontSize: "1rem", ...customStyle }}>
        {equation ? formatNumber(price * equation) : formatNumber(price)}{" "}
        <SAR img="/images/icons/SAR.svg" />
      </Typography>
    </Box>
  );
}
