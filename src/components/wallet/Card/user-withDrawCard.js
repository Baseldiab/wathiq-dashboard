import constants from "@/services/constants";
import { formatDate, formatNumber, setStatusStyle } from "@/services/utils";
import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export default function UserWithdrawCard({ key, data }) {
  const { t } = useTranslation();

  return (
    <Card
      key={key}
      sx={{
        padding: "18px 24px",
        mb: "16px",
        backgroundColor: "#fff",
        border: "1px solid #EBEEF3",
        borderRadius: "17px",
        boxShadow: "none",
        direction: "rtl",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Title + Bank Info */}
        <Box>
          <Typography fontSize={18} fontWeight={700} mb={1}>
            {t("components_wallet_user-withdraw_card.سحب_المحفظة")}
          </Typography>
          <Typography color="#6B778C" fontSize={12} mb={1}>
            {data?.bankName}
          </Typography>
          <Typography color="#6B778C" fontSize={12}>
            {formatDate(data?.createdAt)}
          </Typography>
        </Box>

        {/* Amount + Status */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          <Typography
            color={
              data?.status === "Success"
                ? "#027A47"
                : data?.status === "Confirmed"
                ? "#202726"
                : "#BD7611"
            }
            mb={0.5}
            fontWeight={700}
            fontSize={"16px"}
          >
            {formatNumber(data?.amount)}{" "}
            {constants.symbol({
              width: { xs: "12px", md: "15px" },
            })}
          </Typography>

          <Typography
            sx={{
              ...(data?.status === "Success"
                ? setStatusStyle(t("components_wallet_user-withdraw_card.نشط"))
                : data?.status === "Confirmed"
                ? setStatusStyle(t("components_wallet_user-withdraw_card.جاري"))
                : setStatusStyle(
                    t("components_wallet_user-withdraw_card.غير_نشط")
                  )),
              mt: 0.5,
              alignItems: "center",
            }}
          >
            {data?.status === "Success"
              ? t("components_wallet_user-withdraw_card.ناجحة")
              : data?.status === "Confirmed"
              ? t("components_wallet_user-withdraw_card.مقبولة")
              : t("components_wallet_user-withdraw_card.معلقة")}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
