import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import BasicPagination from "@/components/pagination";
import Loader from "@/components/loader";
import { getOriginPayments } from "@/Redux/slices/walletSlice";
import PaymentOriginCard from "./Card/PaymentOrigninCard";
import { buildQueryParams } from "@/services/utils";
import { useTranslation } from "react-i18next";

export default function PaymentOrigin() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { originPayments, loadingOriginPayments } = useSelector(
    (state) => state.wallet
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = buildQueryParams({ page, limit: 6 });
    dispatch(getOriginPayments(params));
  }, [page, dispatch]);

  const invoices = originPayments?.data ?? [];
  const pagination = originPayments?.pagination;
  const totalPages = Number(pagination?.totalPages) || 1;
  const resultCount = Number(pagination?.resultCount ?? invoices.length) || 0;

  const handlePaginationChange = (_e, newPage) => {
    const next = Number(newPage) || 1;
    if (next !== page) setPage(next);
  };

  if (loadingOriginPayments) return <Loader open />;

  return (
    <Box sx={{ width: "100%" }}>
      {invoices.length ? (
        <>
          {invoices.map((item) => (
            <PaymentOriginCard key={item._id} originItem={item} />
          ))}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              my: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: "12px" }}>
              <Typography sx={{ color: "#6F6F6F", fontWeight: 700, fontSize: "1rem" }}>
                {t("components_wallet_payment-origin.من")}
              </Typography>
              <Typography sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}>
                {resultCount}
              </Typography>
            </Box>

            <BasicPagination
              handleChange={handlePaginationChange}
              page={page}
              count={totalPages}
            />
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: "center", mt: 8, p: 4 }}>
          <Image
            src={"/images/no-wallet.svg"}
            alt={t("components_wallet_payment-origin.لا_توجد_معاملات_alt")}
            width={120}
            height={120}
            style={{ marginBottom: "24px" }}
          />
          <Typography fontWeight={700} fontSize="24px" sx={{ mb: 2 }}>
            {t("components_wallet_payment-origin.لا_توجد_معاملات_عنوان")}
          </Typography>
          <Typography fontSize="16px" color="#6F6F6F">
            {t("components_wallet_payment-origin.لا_توجد_معاملات_وصف")}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
