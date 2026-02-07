import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Divider,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import CustomButton from "@/components/button";
import constants from "@/services/constants";
import { formatNumber } from "@/services/utils";
import PopupTitle from "@/components/popup-title";
import { useTranslation } from "react-i18next";

/* تحويلات أسماء الحالات بين الـUI والـAPI */
const toUiStatus = (api) => {
  switch (api) {
    case "pending":
    case "new":
      return "new";
    case "inProgress":
    case "in_progress":
      return "inProgress";
    case "approved":
    case "transferred":
      return "approved";
    case "rejected":
      return "rejected";
    default:
      return "new";
  }
};

const toApiStatus = (ui) => {
  switch (ui) {
    case "new":
      return "pending";
    case "inProgress":
      return "inProgress";
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    default:
      return "pending";
  }
};

/* شارة حالة للعرض فقط */
const StatusChip = ({ ui }) => {
  const { t } = useTranslation();
  const map = {
    new: {
      bg: "#F4F6F8",
      color: "#6B7280",
      label: t("components_wallet_withdraw-details-form.حالات.new"),
    },
    inProgress: {
      bg: "#FFF7ED",
      color: "#B45309",
      label: t("components_wallet_withdraw-details-form.حالات.inProgress"),
    },
    approved: {
      bg: "#E8F7EE",
      color: "#15803D",
      label: t("components_wallet_withdraw-details-form.حالات.approved"),
    },
    rejected: {
      bg: "#FDECEC",
      color: "#B91C1C",
      label: t("components_wallet_withdraw-details-form.حالات.rejected"),
    },
  };
  const s = map[ui] || map.new;
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: 999,
        bgcolor: s.bg,
        color: s.color,
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {s.label}
    </Box>
  );
};

/* صف قيمة + لابل */
const Row = ({ label, value }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    sx={{ py: 1.2 }}
  >
    <Typography sx={{ color: "#6B7280", fontSize: 14 }}>{label}</Typography>
    <Typography sx={{ fontWeight: 700, fontSize: 14, textAlign: "left" }}>
      {value || "-"}
    </Typography>
  </Stack>
);

const WithdrawDetailsForm = ({ open, onClose, data = {}, onConfirm }) => {
  const { t } = useTranslation();
  const { amount, name, bankName, phoneNumber, iban, status } = data;

  const allOptions = [
    {
      value: "new",
      label: t("components_wallet_withdraw-details-form.حالات.new"),
    },
    {
      value: "inProgress",
      label: t("components_wallet_withdraw-details-form.حالات.inProgress"),
    },
    {
      value: "approved",
      label: t("components_wallet_withdraw-details-form.حالات.approved"),
    },
    {
      value: "rejected",
      label: t("components_wallet_withdraw-details-form.حالات.rejected"),
    },
  ];

  const ALLOWED_TRANSITIONS = {
    new: ["inProgress", "approved", "rejected"],
    inProgress: ["approved", "rejected"],
    approved: [],
    rejected: [],
  };

  const currentUiStatus = useMemo(() => toUiStatus(status), [status]);
  const isFinal =
    currentUiStatus === "approved" || currentUiStatus === "rejected";

  const selectableOptions = useMemo(() => {
    const allowed = ALLOWED_TRANSITIONS[currentUiStatus] || [];
    return allOptions.filter((opt) => allowed.includes(opt.value));
  }, [currentUiStatus]);

  const [selectedStatus, setSelectedStatus] = useState(
    selectableOptions[0]?.value || currentUiStatus
  );

  useEffect(() => {
    if (!open || isFinal) return;
    setSelectedStatus(selectableOptions[0]?.value || currentUiStatus);
  }, [open, isFinal, selectableOptions, currentUiStatus]);

  const handleConfirm = () => {
    if (isFinal) return;
    onConfirm?.(toApiStatus(selectedStatus));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          p: 3,
          bgcolor: "#FFFFFF",
        },
      }}
    >
      <PopupTitle
        title={t("components_wallet_withdraw-details-form.طلب_سحب_رصيد")}
        handleClose={onClose}
      />

      <Box
        sx={{
          bgcolor: "#F3F4F6",
          borderRadius: "8px",
          p: "20px 8px",
          textAlign: "center",
          mb: 1.5,
          mt: 3,
          border: "1px solid #E5E7EB",
        }}
      >
        <Typography sx={{ color: "#6B7280", fontSize: 13, mb: 0.5 }}>
          {t("components_wallet_withdraw-details-form.مبلغ_السحب")}
        </Typography>
        <Typography sx={{ fontWeight: 900, fontSize: 28 }}>
          {formatNumber(amount || 0)}
          {constants.symbol()}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Row
          label={t("components_wallet_withdraw-details-form.اسم_المستفيد")}
          value={name}
        />
        <Row
          label={t("components_wallet_withdraw-details-form.اسم_البنك")}
          value={bankName}
        />
        <Divider sx={{ borderColor: "#E5E7EB", my: 0.5 }} />

        <Row
          label={t("components_wallet_withdraw-details-form.رقم_التواصل")}
          value={phoneNumber ? `966${phoneNumber.number}` : "-"}
        />
        <Row
          label={t("components_wallet_withdraw-details-form.رقم_الايبان")}
          value={iban}
        />
        <Divider sx={{ borderColor: "#E5E7EB", my: 0.5 }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ py: 1.2 }}
        >
          <Typography sx={{ color: "#6B7280", fontSize: 14 }}>
            {t("components_wallet_withdraw-details-form.الحالة")}
          </Typography>
          <StatusChip ui={currentUiStatus} />
        </Stack>
      </Box>

      {!isFinal && (
        <Stack direction="row" gap={1.5} justifyContent="space-between">
          <Select
            size="small"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            sx={{
              width: "40%",
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D1D5DB",
              },
            }}
          >
            {selectableOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          <CustomButton
            text={t("components_wallet_withdraw-details-form.تأكيد")}
            handleClick={handleConfirm}
            customeStyle={{
              background: "#0E3C86",
              color: "#fff",
              fontWeight: 800,
              borderRadius: "10px",
              padding: "10px 0",
              width: "60%",
              "&:hover": { background: "#0E3C86", boxShadow: "none" },
            }}
          />
        </Stack>
      )}
    </Dialog>
  );
};

export default WithdrawDetailsForm;
