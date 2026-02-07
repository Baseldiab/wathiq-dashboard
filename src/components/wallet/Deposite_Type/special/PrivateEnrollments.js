import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import AuctionEnrollCard from "../../Card/auction-enrollCard";
import BasicPagination from "@/components/pagination";
import Loader from "@/components/loader";
import { getEnrollments } from "@/Redux/slices/walletSlice";
import { buildQueryParams } from "@/services/utils";
import { useTranslation } from "react-i18next";

const PrivateEnrollments = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { WinnerEnroll, WinnerEnroll_loading } = useSelector(
    (state) => state.wallet
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const invoices = WinnerEnroll?.data || [];
  const pagination = WinnerEnroll?.pagination || {};

  useEffect(() => {
    dispatch(getEnrollments(buildQueryParams({ page, limit: 3 })));
  }, [dispatch, page]);

  useEffect(() => {
    if (pagination?.totalPages) {
      setTotalPages(pagination.totalPages);
    }
  }, [pagination]);

  const handlePaginationChange = (_event, newPage) => {
    setPage(newPage);
  };

  if (WinnerEnroll_loading) return <Loader open={true} />;

  if (invoices.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 8, p: 4 }}>
        <Image
          src={"/images/no-wallet.svg"}
          alt={t("components_wallet_private_enrollments.لا_توجد_معاملات")}
          width={120}
          height={120}
          style={{ marginBottom: "24px" }}
        />
        <Typography fontWeight={700} fontSize="24px" sx={{ mb: 2 }}>
          {t("components_wallet_private_enrollments.لا_توجد_معاملات_لإظهارها")}
        </Typography>
        <Typography fontSize="16px" color="#6F6F6F">
          {t(
            "components_wallet_private_enrollments.لم_تقم_بأي_معاملات_بمجرد_إجراء_أي_معاملات_ستظهر_هنا"
          )}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {invoices.map((item) => (
        <AuctionEnrollCard key={item._id} Data={item} />
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
          <Typography
            sx={{ color: "#6F6F6F", fontWeight: 700, fontSize: "1rem" }}
          >
            {t("components_wallet_private_enrollments.من")}
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
  );
};

export default PrivateEnrollments;
