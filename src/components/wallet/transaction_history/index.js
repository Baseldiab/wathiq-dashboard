import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import BasicPagination from "@/components/pagination";
import Loader from "@/components/loader";
import {
  getAllInvoices,
  getSpacificInvoice,
  getUserInvoices,
} from "@/Redux/slices/walletSlice";
import { buildQueryParams } from "@/services/utils";
import TransactionCard from "../Card/TransactionCard";
import { useTranslation } from "react-i18next";

export default function TransctionHistory({
  type,
  walletBalance,
  selectedUser,
}) {
  const { t } = useTranslation();
  const { allInvoices, loadingallInvoices, userInvoices, loadinguserInvoice } =
    useSelector((state) => state.wallet);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const prevPageRef = useRef();

  useEffect(() => {
    if (prevPageRef.current === page) return;
    prevPageRef.current = page;

    if (type === "admin") {
      dispatch(getAllInvoices(buildQueryParams({ page, limit: 6})));
    } else if (selectedUser?.data?._id) {
      dispatch(
        getUserInvoices({ userId: selectedUser.data._id, page, limit: 5})
      );
    }
  }, [dispatch, page, type, selectedUser]);

  const pagination =
    type === "admin" ? allInvoices?.pagination : userInvoices?.pagination;

  const invoices = type === "admin" ? allInvoices?.data : userInvoices?.data;

  useEffect(() => {
    if (pagination) setTotalPages(pagination.totalPages);
  }, [pagination]);

  const handlePaginationChange = (_event, newPage) => setPage(newPage);

  if (loadingallInvoices || loadinguserInvoice) return <Loader open={true} />;

  const handleDownloadInvoice = async (invoiceNo) => {
    dispatch(getSpacificInvoice(invoiceNo));
  };

  return (
    <Box sx={{ width: "100%" }}>
      {invoices && invoices.length > 0 ? (
        <>
          {invoices.map((activity) => (
            <TransactionCard
              variant="invoice"
              key={activity._id}
              date={activity.updatedAt}
              amount={activity.TotalAmount}
              status={activity.status}
              onReceipt={() => handleDownloadInvoice(activity?.invoiceNo)}
              receiptLoading={"loadingSpacificInvoice"}
            />
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
              <Typography
                sx={{ color: "#6F6F6F", fontWeight: 700, fontSize: "1rem" }}
              >
                {t("components_wallet_transaction-history_index.من")}
              </Typography>
              <Typography
                sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}
              >
                {pagination?.resultCount}
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
              alt={t(
                "components_wallet_transaction-history_index.لا_توجد_معاملات"
              )}
              width={120}
              height={120}
              style={{ marginBottom: "24px" }}
            />
            <Typography fontWeight={700} fontSize="24px" sx={{ mb: 2 }}>
              {t("components_wallet_transaction-history_index.لا_توجد_معاملات")}
            </Typography>
            <Typography fontSize="16px" color="#6F6F6F">
              {t(
                "components_wallet_transaction-history_index.لم_تقم_بأي_معاملات"
              )}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
