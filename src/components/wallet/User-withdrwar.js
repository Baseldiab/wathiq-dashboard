import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import BasicPagination from "@/components/pagination";
import Loader from "@/components/loader";
import { getWithDraw } from "@/Redux/slices/walletSlice";
import { buildQueryParams } from "@/services/utils";
import UserWithdrawCard from "./Card/user-withDrawCard";
import { useTranslation } from "react-i18next";

export default function User_withDrwar({ selectedUser }) {
  const { t } = useTranslation();
  const { WithDrawData, loadingWithDrawData } = useSelector(
    (state) => state.wallet
  );
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const prevPageRef = useRef();

  useEffect(() => {
    if (!selectedUser?.data?._id) return;
    if (prevPageRef.current === page) return;
    prevPageRef.current = page;

    dispatch(
      getWithDraw(buildQueryParams({ user: selectedUser.data._id, page ,limit:4}))
    );
  }, [dispatch, page, selectedUser]);

  const pagination = WithDrawData?.pagination;
  const invoices = WithDrawData?.data;

  useEffect(() => {
    if (pagination?.totalPages) {
      setTotalPages(pagination.totalPages);
    }
  }, [pagination]);

  const handlePaginationChange = (_event, newPage) => {
    setPage(newPage);
  };

  if (loadingWithDrawData) return <Loader open={true} />;

  return (
    <Box sx={{ width: "100%" }}>
      {invoices && invoices.length > 0 ? (
        <>
          {invoices.map((activity) => (
            <UserWithdrawCard key={activity._id} data={activity} type="wallet" />
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
                {t("components_wallet_user-withdraw.من")}
              </Typography>
              <Typography sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}>
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
              alt={t("components_wallet_user-withdraw.لا_توجد_معاملات_alt")}
              width={120}
              height={120}
              style={{ marginBottom: "24px" }}
            />
            <Typography fontWeight={700} fontSize="24px" sx={{ mb: 2 }}>
              {t("components_wallet_user-withdraw.لا_توجد_معاملات_عنوان")}
            </Typography>
            <Typography fontSize="16px" color="#6F6F6F">
              {t("components_wallet_user-withdraw.لا_توجد_معاملات_وصف")}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
