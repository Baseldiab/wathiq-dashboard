import React, { useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import CustomButton from "@/components/button";
import constants from "@/services/constants";
import { formatNumber } from "@/services/utils";
import PopupTitle from "@/components/popup-title";
import { useTranslation } from "react-i18next";

const getStatusLabel = (status, t) => {
  switch (status) {
    case "paid":
      return { label: t("components_wallet_enforcement_form.تم_التحويل"), color: "#E6F4EA", textColor: "#0C6251" };
    case "pending":
      return { label: t("components_wallet_enforcement_form.لم_يتم_التحويل"), color: "#BD76110D", textColor: "#BD7611" };
    case "rejected":
      return { label: t("components_wallet_enforcement_form.مرفوض"), textColor: "#D32F2F", color: "#FFEDED" };
    default:
      return { label: t("components_wallet_enforcement_form.غير_محددة"), color: "#E0E0E0", textColor: "#666" };
  }
};

const Row = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.2 }}>
    <Typography sx={{ color: "#616161", fontSize: 16 }}>{label}</Typography>
    <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{value || "-"}</Typography>
  </Stack>
);

const DepositDetailsDialog = ({ open, onClose, data = {}, onConfirm }) => {
  const { t } = useTranslation();
  const { auction, auctionOrigin, user, status } = data || {};
  const statusInfo = getStatusLabel(status, t);

  const [selectedStatus, setSelectedStatus] = useState("pending");

  useEffect(() => {
    if (open && status === "pending") {
      setSelectedStatus("paid");
    }
  }, [open, status]);

  const handleConfirm = () => {
    onConfirm?.(selectedStatus);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      dir="rtl"
      PaperProps={{ sx: { borderRadius: "12px", bgcolor: "#FFFFFF", p: 3 } }}
    >
      <PopupTitle title={t("components_wallet_enforcement_form.عربون_مزاد")} handleClose={onClose} />

      <Box
        sx={{
          bgcolor: "#F3F4F6",
          borderRadius: "8px",
          p: "20px 8px",
          textAlign: "center",
          mb: 2,
          mt: 3,
          border: "1px solid #E5E7EB",
        }}
      >
        <Typography sx={{ color: "#2E353F", fontSize: 14, mb: "16px" }}>
          {t("components_wallet_enforcement_form.مبلغ_العربون")}
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 32, color: "#1A1A1A" }}>
          {formatNumber(auctionOrigin?.entryDeposit || 0)}
          {constants.symbol()}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Row label={t("components_wallet_enforcement_form.المزاد")} value={auction?.title} />
        <Row label={t("components_wallet_enforcement_form.الأصل")} value={auctionOrigin?.description} />
        <Divider sx={{ borderColor: "#E5E7EB", my: 0.5 }} />

        <Row label={t("components_wallet_enforcement_form.اسم_المزايد_الرابح")} value={user?.name} />
        <Row label={t("components_wallet_enforcement_form.رقم_الهوية")} value={user?.identityNumber} />
        <Row
          label={t("components_wallet_enforcement_form.رقم_الهاتف")}
          value={user?.phoneNumber?.number ? `0${user.phoneNumber.number}` : "-"}
        />
        <Divider sx={{ borderColor: "#E5E7EB", my: 0.5 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.2 }}>
          <Typography sx={{ color: "#616161", fontSize: 16 }}>
            {t("components_wallet_enforcement_form.الحالة")}
          </Typography>
          <Box
            sx={{
              background: statusInfo.color,
              px: 2,
              py: 0.5,
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "14px",
              color: statusInfo.textColor,
            }}
          >
            {statusInfo.label}
          </Box>
        </Stack>
      </Box>

      {status === "pending" && (
        <Stack direction="row" gap={1.5} justifyContent="space-between" mt={2}>
          <CustomButton
            text={t("components_wallet_enforcement_form.تأكيد_عملية_التحويل")}
            handleClick={handleConfirm}
            customeStyle={{
              backgroundColor: constants.colors.main,
              color: "#fff",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 400,
              width: "100%",
            }}
          />
        </Stack>
      )}
    </Dialog>
  );
};

export default DepositDetailsDialog;
