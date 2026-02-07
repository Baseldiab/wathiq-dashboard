import { useTranslation } from "next-i18next";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

export default function AuctionType({ type, noIcon }) {
  const { t } = useTranslation();
  let auctionType = "";
  let icon = "";
  let style = {}; // لازم يكون object فارغ كبداية

  if (type === "online") {
    auctionType=t("components_auctions-tabs_auction-type.الكتروني");
    style = { bgcolor: "#9E5C21" };
  } else if (type === "hybrid") {
    auctionType=t("components_auctions-tabs_auction-type.هجين");
    style = { bgcolor: "#22A06B" };
  } else {
    auctionType=t("components_auctions-tabs_auction-type.حضوري");
    style = { bgcolor: "#EEF9E8" };
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        padding: "12px 15px",
        borderRadius: "12px",
        ...style,
        color: "#fff",
      }}
    >
      <Typography>مزاد {auctionType}</Typography>
    </Box>
  );
}
