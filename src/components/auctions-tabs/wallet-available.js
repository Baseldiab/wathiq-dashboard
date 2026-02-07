import { useTranslation } from "next-i18next";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import CustomButton from "../button";
import { useRouter } from "next/router";

export default function WalletAvailable({ maxOrigins }) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Box
      sx={{
        bgcolor:
          maxOrigins == 0
            ? "rgba(211, 47, 47, 0.05)"
            : "rgba(14, 131, 64, 0.05)",
        padding: "12px 16px",
        borderRadius: "8px",
        display: "flex",
        gap: 1,
        my: 2,
        alignItems: "center",
      }}
    >
      <Image
        src={
          maxOrigins == 0
            ? "/images/icons/wallet-nonactive.svg"
            : "/images/icons/wallet-active.svg"
        }
        width={32}
        height={32}
        alt="wallet"
      />
      <Typography>{t("components_auctions-tabs_wallet-available.الصكوك_المتاحه")}</Typography>
      <Typography
        sx={{
          color: maxOrigins == 0 ? "#D32F2F" : "#0E8340",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        {maxOrigins}
      </Typography>
      {maxOrigins == 0 && (
        <CustomButton
          handleClick={() => router.push("/wallet")}
          customeStyle={{ padding: "10px 16px", height: "2.5rem", mr: 5 }}
          text={t("components_auctions-tabs_wallet-available.شحن_المحفظة")}
        />
      )}
    </Box>
  );
}
