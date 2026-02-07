import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import Pagination from "@/components/pagination";
import Loader from "@/components/loader";
import CustomSnackbar from "@/components/toastMsg";
import NoData from "@/components/no-data";
import {
  getOneWithDraw,
  getWithDraw,
  updateOneWithDraw,
} from "@/Redux/slices/walletSlice";
import { buildQueryParams } from "@/services/utils";
import WithdrawDetailsForm from "../WithdrawDetailsForm";
import TransactionCard from "../../Card/TransactionCard";
import { useTranslation } from "react-i18next";

export default function NewRequsets() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);

  const {
    loadingWithDrawData,
    WithDrawData,
    OneloadingWithDrawData,
    OneWithDrawData,
  } = useSelector((state) => state.wallet);

  const Data = WithDrawData;

  const handleOpen = (id) => {
    setOpen(true);
    dispatch(getOneWithDraw(id))
      .unwrap()
      .catch(() => {
        setAlert({
          type: "error",
          msg: t("components_wallet_withdrawal-requests_new-requests_index.حدث_خطأ_أثناء_تحميل_البيانات"),
        });
        setAlertOpen(true);
      });
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(getWithDraw(buildQueryParams({ status: "pending", page })));
  }, [dispatch]); // أول تحميل

  useEffect(() => {
    if (Data) {
      setPage(Data?.pagination?.currentPage);
      setTotalCount(Data?.pagination?.totalPages);
    }
  }, [Data]);

  const handlePaginationChange = (_e, currentPage) => {
    setPage(currentPage);
    dispatch(getWithDraw(buildQueryParams({ status: "pending", page: currentPage })));
  };

  if (loadingWithDrawData || OneloadingWithDrawData) return <Loader open={true} />;

  return (
    <Box>
      <>
        <Box sx={{ display: "grid", gap: 1.5 }}>
          {Data?.data?.length > 0 ? (
            Data.data.map((item) => (
              <TransactionCard
                key={item._id}
                variant="withdraw"
                date={item.createdAt}
                amount={item.amount}
                status={item.status} // pending | in_progress | transferred | rejected
                onOpen={() => handleOpen(item._id)}
                title={t("components_wallet_withdrawal-requests_new-requests_index.طلب_سحب_رصيد")}
              />
            ))
          ) : (
            <NoData img="/images/no-wallet.svg" desc={t("components_wallet_withdrawal-requests_new-requests_index.لا_توجد_معاملات")} />
          )}
        </Box>

        {Data?.data?.length > 0 && (
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
                {t("components_wallet_withdrawal-requests_new-requests_index.من")}
              </Typography>
              <Typography sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}>
                {Data?.pagination?.resultCount}
              </Typography>
            </Box>

            <Pagination
              handleChange={handlePaginationChange}
              page={page}
              count={totalCount}
            />
          </Box>
        )}

        <WithdrawDetailsForm
          open={open}
          onClose={handleClose}
          data={OneWithDrawData?.data}
          onConfirm={(newStatus) => {
            const id = OneWithDrawData?.data?._id;
            if (!id || !newStatus) return;

            dispatch(updateOneWithDraw({ id, data: { status: newStatus } }))
              .unwrap()
              .then(() => {
                handleClose();
                setAlert({
                  type: "success",
                  msg: t("components_wallet_withdrawal-requests_new-requests_index.تم_تحديث_حالة_الطلب"),
                });
                setAlertOpen(true);
                dispatch(getWithDraw(buildQueryParams({ status: "pending", page })));
              })
              .catch(() => {
                setAlert({
                  type: "error",
                  msg: t("components_wallet_withdrawal-requests_new-requests_index.فشل_تحديث_حالة_الطلب"),
                });
                setAlertOpen(true);
              });
          }}
        />
      </>
      <CustomSnackbar
        type={alert.type}
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alert.msg}
      />
    </Box>
  );
}
