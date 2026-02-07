import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { formatDate, formatNumber } from "@/services/utils";
import constants from "@/services/constants";
import { useTranslation } from "react-i18next";

export default function PaymentOriginCard({ originItem }) {
  const { t } = useTranslation();

  const { updatedAt, originPrice, originData, providerData, auctionData } =
    originItem;
  const {
    title: originTitle,
    description,
    attachment,
    awardStatus,
  } = originData || {};
  const { companyName, companyProfileImage } = providerData || {};
  const { title: auctionTitle, startDate, endDate } = auctionData || {};

  return (
    <Card
      sx={{
        p: 3,
        mb: 2,
        backgroundColor: "#F9FAFB",
        borderRadius: "17px",
        boxShadow: "none",
        direction: "rtl",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          component="img"
          src={
            companyProfileImage ??
            "https://hafawa.sgp1.digitaloceanspaces.com/providers/1747059590155-39885cf7.JPG"
          }
          alt={companyName || t("components_wallet_payment-origin_card.شعار_الشركة")}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        {/* Company Info (Name + Date) */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {companyName && (
            <Typography fontSize={14} fontWeight={700}>
              {companyName}
            </Typography>
          )}
          <Typography
            fontSize={12}
            fontWeight={400}
            color="#98A2B3"
            lineHeight="16px"
          >
            {formatDate(updatedAt)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {auctionTitle && (
            <Typography fontSize={12} fontWeight={700}>
              {auctionTitle}
            </Typography>
          )}
          {originTitle && (
            <Typography fontSize={12} fontWeight={400} color="#98A2B3">
              {originTitle}
            </Typography>
          )}
        </Box>

        <Typography fontWeight={700} fontSize={16}>
          {formatNumber(originPrice)}{" "}
          {constants.symbol({ width: { xs: "12px", md: "14px" } })}
        </Typography>
      </Box>
    </Card>
  );
}
