import constants from "@/services/constants";
import { formatDate, formatNumber, setStatusStyle } from "@/services/utils";
import {
  Box,
  Card,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import InvoicePreview from "@/components/InvoicePerview";
import { useTranslation } from "react-i18next";

export default function TransactionCard({
  variant = "invoice",       // "invoice" | "withdraw"
  date,
  checked,
  amount,
  status,
  onOpen,                    // for withdraw details arrow
  onReceipt,                 // for invoice receipt
  type,
  title,
  iconSrc,
  balanceAfterPayment,
}) {
  const { t } = useTranslation();
  const isWithdraw = variant === "withdraw";
  const currency = constants.symbol({ filter: true });

  // عناوين وأيقونات افتراضية حسب النوع
  const finalTitle = title || (isWithdraw
    ? t("components_wallet_card_transaction-card.طلب_سحب_رصيد")
    : t("components_wallet_card_transaction-card.شحن_رصيد"));

  const finalIcon = iconSrc || (isWithdraw
    ? "/images/icons/Icon-withdrwal.svg"
    : "/images/icons/icon-recharge.svg");

  const showArrow   = !!(isWithdraw && onOpen);
  const showReceipt = !!(!isWithdraw && onReceipt && type !== "activity");

  // ترجمة الحالة + ستايلها
  const statusNode = useMemo(() => {
    if (!isWithdraw) {
      const label =
        status === "Success"
          ? t("components_wallet_card_transaction-card.ناجحة")
          : status === "Confirmed"
          ? t("components_wallet_card_transaction-card.تم_التصديق_علي_الفاتورة")
          : t("components_wallet_card_transaction-card.العملية_معلقة");

      const style =
        status === "Success"
          ? setStatusStyle("نشط")
          : status === "Confirmed"
          ? setStatusStyle("تم التصديق")
          : setStatusStyle("معلق");

      return <Typography sx={{ ...style, alignItems: "center" }}>{label}</Typography>;
    }

    let labelKey = "جديدة";
    let style = setStatusStyle("معلق");
    switch (status) {
      case "pending":
        labelKey = "جديدة";
        style = setStatusStyle("معلق");
        break;
      case "inProgress":
        labelKey = "تحت_الإجراء";
        style = setStatusStyle("تحت الإجراء");
        break;
      case "approved":
        labelKey = "عملية_ناجحة";
        style = setStatusStyle("نشط");
        break;
      case "rejected":
        labelKey = "مرفوضة";
        style = setStatusStyle("مرفوض");
        break;
      default:
        labelKey = "جديدة";
        style = setStatusStyle("معلق");
    }
    return (
      <Typography sx={{ ...style, alignItems: "center" }}>
        {t(`components_wallet_card_transaction-card.${labelKey}`)}
      </Typography>
    );
  }, [isWithdraw, status, t]);

  // (اختياري) منطق الإيصال للفواتير
  const invoiceRef = useRef(null);
  const [download, setDownload] = useState(false);
  const { SpacificInvoice, loadingSpacificInvoice } = useSelector((s) => s.wallet);

  useEffect(() => {
    if (SpacificInvoice && download && !loadingSpacificInvoice) {
      setDownload(true);
    }
  }, [SpacificInvoice, download, loadingSpacificInvoice]);

  return (
    <>
      <Card
        sx={{
          mb: "16px",
          px: 2.5,
          py: 2,
          backgroundColor: checked ? "rgba(2,57,54,.05)" : "#F9FAFB",
          border: "1px solid #EBEEF3",
          borderRadius: "16px",
          boxShadow: "none",
          direction: "rtl",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          {/* يمين: أيقونة + عنوان + تاريخ */}
          <Box sx={{ minWidth: 240, flex: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
            <img src={finalIcon} alt="" />
            <Box>
              <Typography fontSize={14} fontWeight={700} mb={0.5}>
                {finalTitle}
              </Typography>
              <Typography color="#888888" fontSize={12}>
                {formatDate(date)}
              </Typography>

              {/* لو محتاجة تعرضي الرصيد بعد المعاملة للشحن */}
              {/* {!isWithdraw && status === "Success" && (
                <Typography fontSize={14} mt={1.5}>
                  <Typography component="span" sx={{ color: "#6B7280", fontSize: 14, ml: 0.5 }}>
                    {t("components_wallet_card_transaction-card.الرصيد_بعد_المعاملة")}
                  </Typography>{" "}
                  {formatNumber(balanceAfterPayment)} {currency}
                </Typography>
              )} */}
            </Box>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* يسار: الحالة + المبلغ + أسهم/إيصال */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {statusNode}

            <Typography sx={{ fontWeight: 700, color: "#2F2828" }}>
              {formatNumber(amount)} {constants.symbol({ width: { xs: "12px", md: "15px" } })}
            </Typography>

            {showArrow && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen?.();
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
                <ChevronLeftRoundedIcon sx={{ color: "#2E353F", fontSize: "30px" }} />
              </IconButton>
            )}

            {/* زر الإيصال للفواتير (لو مفعل) */}
            {/* {showReceipt && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setDownload(true);
                  onReceipt?.();
                }}
                sx={{
                  bgcolor: "#F4F6F8",
                  borderRadius: "12px",
                  width: 44,
                  height: 44,
                  "&:hover": { bgcolor: "#EDF0F3" },
                }}
              >
                {loadingSpacificInvoice ? (
                  <CircularProgress size={20} />
                ) : (
                  <img src="/images/icons/pdf.svg" width={22} height={22} alt="PDF icon" />
                )}
              </IconButton>
            )} */}
          </Box>
        </Box>
      </Card>

      {/* مساحة الإيصال المخفية (للـ invoice فقط) */}
      {!isWithdraw && (
        <Box
          ref={invoiceRef}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "210mm",
            minHeight: "297mm",
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          {!loadingSpacificInvoice && (
            <InvoicePreview
              invoiceData={SpacificInvoice}
              download={download}
              setDownload={setDownload}
            />
          )}
        </Box>
      )}
    </>
  );
}
