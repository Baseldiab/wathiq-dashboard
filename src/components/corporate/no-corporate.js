import { useTranslation } from "next-i18next";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import CustomButton from "../button";

export default function NoCorporate({ approved }) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "100%", md: "550px" },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        width={190}
        height={190}
        objectFit
        src="/images/no-corporate.svg"
      />
      <Typography
        sx={{
          fontSize: "1.4rem",
          fontWeight: 600,
          color: "#202726",
          my: { xs: "16px", md: "24px" },
        }}
      >{t("components_corporate_no-corporate.لا_يوجد_شركات")}</Typography>
      {approved && (
        <Box>
          <CustomButton handleClick={() => ""} text="اضافة شركة" type="add" />
        </Box>
      )}
    </Box>
  );
}
