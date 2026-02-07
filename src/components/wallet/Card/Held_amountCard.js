import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { formatDate, formatNumber } from "@/services/utils";
import AuctionType from "@/components/auctions-tabs/auction-type";
import constants from "@/services/constants";
import { useTranslation } from "react-i18next";

export default function HeldAmountCard({ originItem }) {
  const { t } = useTranslation();
  const auction = originItem?.enrollment?.auction;

  if (!auction) return null;

  return (
    <Card
      sx={{
        p: 3,
        mb: 2,
        backgroundColor: "#fff",
        border: "1px solid #EBEEF3",
        borderRadius: "17px",
        boxShadow: "none",
        display: "flex",
        alignItems: "center",
        gap: 2,
        direction: "rtl",
      }}
    >
      {auction.cover && (
        <a
          href={`https://hafawa.sgp1.digitaloceanspaces.com/${auction.cover}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box
            component="img"
            src={`https://hafawa.sgp1.digitaloceanspaces.com/${auction.cover}`}
            alt={t("components_wallet_held-amount_card.شعار_المزاد")}
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
              border: "2px solid #ccc",
            }}
          />
        </a>
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography fontSize={14} fontWeight={700}>
            {auction.title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
          <Typography fontSize={12}>
            {t("components_wallet_held-amount_card.يبدأ")}{" "}
            {formatDate(auction.startDate)}
          </Typography>
          <Typography fontSize={12}>
            {t("components_wallet_held-amount_card.ينتهي")}{" "}
            {formatDate(auction.endDate)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        <Typography fontWeight={700} fontSize={16}>
          {formatNumber(originItem?.amount)}
          {constants.symbol({ width: { xs: "12px", md: "14px" } })}
        </Typography>
        <AuctionType
          type={auction.type}
          customStyle={{
            padding: "6px",
            borderRadius: "12px",
          }}
        />
      </Box>
    </Card>
  );
}
