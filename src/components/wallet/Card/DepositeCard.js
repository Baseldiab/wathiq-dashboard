import React, { useRef, useState } from "react";
import { Box, Card, Typography, Stack, Chip, IconButton } from "@mui/material";
import { formatDate, formatNumber } from "@/services/utils";
import constants from "@/services/constants";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import { useTranslation } from "react-i18next";

export default function Deposite({ Data, onDetails }) {
  const { t } = useTranslation();
  const {
    updatedAt,
    auction,
    winner,
    originData,
    auctionOrigin,
    user,
    status,
  } = Data;

  const auctionTitle = auction?.title;
  const userName = user?.name;
  const depositAmount = auctionOrigin?.entryDeposit;
  const nationalId = user?.identityNumber;
  const phone = `+966${user?.phoneNumber?.number}`;

  // ترجمة الحالة + ألوانها
  const statusInfo = (() => {
    switch (status) {
      case "paid":
        return {
          label: t("components_wallet_card_deposit.تم_التحويل"),
          color: "#E6F4EA",
          textColor: "#0C6251",
        };
      case "pending":
        return {
          label: t("components_wallet_card_deposit.لم_يتم_التحويل"),
          color: "#BD76110D",
          textColor: "#BD7611",
        };
      case "rejected":
        return {
          label: t("components_wallet_card_deposit.مرفوض"),
          color: "#FFEDED",
          textColor: "#D32F2F",
        };
      default:
        return {
          label: t("components_wallet_card_deposit.غير_محددة"),
          color: "#E0E0E0",
          textColor: "#666",
        };
    }
  })();

  return (
    <Card
      sx={{
        p: "14px",
        mb: 2,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: "none",
        direction: "rtl",
        backgroundColor: "#F8F8F8",
      }}
    >
      {/* العنوان + التاريخ + المبلغ + الحالة */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* الصورة + النص */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={"/images/icons/Icon-recharge.svg"} alt="" />
          <Box>
            <Typography fontSize={14} fontWeight={700} mb={1}>
              {t("components_wallet_card_deposit.استلام_عربون_مع_العنوان", {
                title: auctionTitle,
              })}
            </Typography>
            <Typography
              sx={{
                lineHeight: "16px",
                fontSize: "12px",
                fontWeight: 400,
                color: "#888888",
              }}
            >
              {formatDate(updatedAt)}
            </Typography>
          </Box>
        </Box>

        {/* الحالة + السعر */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={statusInfo.label}
            size="small"
            sx={{
              px: 1,
              height: 24,
              borderRadius: "8px",
              bgcolor: statusInfo.color,
              color: statusInfo.textColor,
              fontWeight: 700,
              "& .MuiChip-label": { px: 1 },
            }}
          />
          <Typography fontSize={14} fontWeight={700} color="#2F2828">
            {formatNumber(depositAmount)}{" "}
            {constants.symbol({ width: { xs: "12px", md: "15px" } })}
          </Typography>
        </Box>
      </Box>

      {/* معلومات المستخدم + السهم */}
      <Box>
        <Typography fontSize={12} fontWeight={700} sx={{ mb: 0.5 }}>
          {userName}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Stack direction="row" gap={2} flexWrap="wrap">
            <Typography fontSize={12} color="#888888">
              {t("components_wallet_card_deposit.رقم_الهوية")}: {nationalId}
            </Typography>
            <Typography fontSize={12} color="#888888">
              {t("components_wallet_card_deposit.رقم_الهاتف")}: {phone}
            </Typography>
          </Stack>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDetails?.();
            }}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              bgcolor: "#FFF",
              "&:hover": { bgcolor: "#FFF" },
            }}
          >
            <ChevronLeftRoundedIcon
              sx={{ color: "#2E353F", fontSize: "30px" }}
            />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  );
}
