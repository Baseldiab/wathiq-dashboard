import React, { useRef, useState } from "react";
import { Box, Card, Typography, Stack } from "@mui/material";
import { formatDate, formatNumber } from "@/services/utils";
import constants from "@/services/constants";
import { useTranslation } from "react-i18next";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import DepositAuction from "@/components/pdf-convert/deposit-auction";

export default function AuctionEnrollCard({ Data }) {
  const { t } = useTranslation();
  const { updatedAt, auction, winner, auctionOrigin } = Data || {};

  const auctionTitle = auction?.title ?? "";
  const userName = winner?.name ?? "-";
  const depositAmount = auctionOrigin?.entryDeposit ?? 0;
  const nationalId = winner?.identityNumber ?? "-";
  const phone = winner?.phoneNumber?.number
    ? `966${winner?.phoneNumber?.number} +`
    : "-";

  const [download, setDownload] = useState(false);
  const [pdfPayload, setPdfPayload] = useState({
    auctionOrigin: null,
    auction: null,
    winner: null,
  });
  const invoiceRef = useRef();

  const handleDownload = () => {
    setPdfPayload({ auctionOrigin, auction, winner });
    setDownload(true);
  };

  return (
    <Card
      sx={{
        p: "14px",
        mb: 2,
        borderRadius: "12px",
        backgroundColor: "#F8F8F8",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: "none",
        direction: "rtl",
      }}
    >
      {/* المبلغ + العنوان */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* صورة + النص */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <img src={"/images/icons/Icon-recharge.svg"} alt="" />
          <Box>
            <Typography fontSize={14} fontWeight={700} mb={1}>
              {t(
                "components_wallet_card_auction-enroll-card.استلام_عربون_المزاد",
                {
                  title: auctionTitle,
                }
              )}
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

        {/* السعر */}
        <Typography fontSize={14} fontWeight={700} color="#2F2828">
          {formatNumber(depositAmount)}{" "}
          {constants.symbol({ width: { xs: "12px", md: "15px" } })}
        </Typography>
      </Box>

      {/* معلومات المزايد */}
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
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Typography fontSize={12} color="#888888">
              {t("components_wallet_card_auction-enroll-card.رقم_الهوية")} :{" "}
              {nationalId}
            </Typography>
            <Typography fontSize={12} color="#888888">
              {t("components_wallet_card_auction-enroll-card.رقم_الهاتف")} :{" "}
              {phone}
            </Typography>
          </Stack>

          {/* زر السند (لو هيشتغل لاحقاً) */}
          {/*
          <Box>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdfIcon color="error" />}
              sx={{
                fontSize: "14px",
                px: 2,
                py: 1,
                borderRadius: "10px",
                fontWeight: 600,
                color: "#344054",
                borderColor: "#D0D5DD",
                textTransform: "none",
              }}
              onClick={handleDownload}
            >
              {t("components_wallet_card_auction-enroll-card.سند_استلام_العربون")}
            </Button>
          </Box>
          */}
        </Stack>
      </Box>

      {/* رندر ملف الـ PDF (معطل حالياً) */}
      {/*
      {download && (
        <Box
          ref={invoiceRef}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            minHeight: "100%",
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <DepositAuction
            Data={Data}
            awardedUser={winner}
            selectedOrigin={auctionOrigin}
            auctionData={auction}
            download={download}
            setDownload={setDownload}
          />
        </Box>
      )}
      */}
    </Card>
  );
}
