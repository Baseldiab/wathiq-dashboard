import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import BasicPagination from "@/components/pagination";
import Loader from "@/components/loader";
import { getUserHeldAmount } from "@/Redux/slices/walletSlice";
import HeldAmountCard from "./Card/Held_amountCard";
import { useTranslation } from "react-i18next";

const fallbackHeldAmounts = [];

export default function HeldAmount({ selectedUser }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { userHeldAmount, loadinguserHeldAmount } = useSelector(
    (state) => state.wallet
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const invoices =
    userHeldAmount?.data?.length > 0 ? userHeldAmount.data : fallbackHeldAmounts;

  const pagination = userHeldAmount?.pagination || {};

  useEffect(() => {
    if (selectedUser?.data?._id) {
      dispatch(getUserHeldAmount({ userId: selectedUser.data._id, page ,limit:2}));
    }
  }, [dispatch, page, selectedUser]);

  useEffect(() => {
    if (pagination) {
      setPage(pagination.currentPage || 1);
      setTotalPages(pagination.totalPages || 1);
    }
  }, [pagination]);

  const handlePaginationChange = (_event, newPage) => {
    setPage(newPage);
  };

  if (loadinguserHeldAmount) return <Loader open={true} />;

  return (
    <Box sx={{ width: "100%" }}>
      {invoices && invoices.length > 0 ? (
        <>
          {invoices.map((item) => (
            <HeldAmountCard key={item._id} originItem={item} />
          ))}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              my: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <Typography sx={{ color: "#6F6F6F", fontWeight: 700, fontSize: "1rem" }}>
                {t("components_wallet_held-amount.من")}
              </Typography>
              <Typography sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}>
                {pagination?.resultCount || invoices.length}
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
          <Box alignItems="center" spacing={3}>
            <Image
              src={"/images/no-wallet.svg"}
              alt={t("components_wallet_held-amount.لا_توجد_معاملات_alt")}
              width={120}
              height={120}
              style={{ marginBottom: "24px" }}
            />
            <Typography fontWeight={700} fontSize="24px" sx={{ mb: 2 }}>
              {t("components_wallet_held-amount.لا_توجد_معاملات_عنوان")}
            </Typography>
            <Typography fontSize="16px" color="#6F6F6F">
              {t("components_wallet_held-amount.لا_توجد_معاملات_وصف")}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
