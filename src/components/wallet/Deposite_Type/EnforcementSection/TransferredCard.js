import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuthorityDeposits,
  updateAuthDeposite,
} from "@/Redux/slices/walletSlice";
import { buildQueryParams } from "@/services/utils";
import Loader from "@/components/loader";
import BasicPagination from "@/components/pagination";
import Deposite from "../../Card/DepositeCard";
import CustomSnackbar from "@/components/toastMsg";
import DepositConfirmationDialog from "./Form";

export default function TransferredCard() {
  const dispatch = useDispatch();

  const {
    authorityDeposits,
    authorityDepositsLoading,
    authorityDepositsPagination,
  } = useSelector((state) => state.wallet);

  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState({ type: "info", msg: "" });
  const [alertOpen, setAlertOpen] = useState(false);

  // ✅ الحالات الخاصة بالفورم
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const query = buildQueryParams({ page: currentPage, status: "paid" });

  useEffect(() => {
    dispatch(fetchAuthorityDeposits(query))
      .unwrap()
      .catch((error) => {
        setAlert({
          type: "error",
          msg: error?.error || "فشل في تحميل البيانات",
        });
        setAlertOpen(true);
      });
  }, [dispatch, currentPage]);

  const handlePaginationChange = (_, newPage) => {
    setCurrentPage(newPage);
  };

  // ✅ فتح الفورم عند الضغط على تفاصيل العنصر
  const handleDetails = (item) => {
    console.log(item);

    setSelectedDeposit(item);
    setIsDialogOpen(true);
  };

  // ✅ عند تأكيد التحويل من داخل الفورم
  const handleConfirm = async () => {
    try {
      // ✅ تأكيد تحويل العربون
      console.log("selectedDeposit,", selectedDeposit._id);

      await dispatch(
        updateAuthDeposite({
          id: selectedDeposit._id,
          status: "paid",
        })
      ).unwrap();

      setAlert({
        type: "success",
        msg: "تم تأكيد تحويل العربون بنجاح.",
      });
      setAlertOpen(true);
      setIsDialogOpen(false);

      // ✅ إعادة تحميل البيانات
      dispatch(fetchAuthorityDeposits(query));
    } catch (error) {
      setAlert({
        type: "error",
        msg: error?.error || "فشل في تأكيد التحويل.",
      });
      setAlertOpen(true);
    }
  };
  if (authorityDepositsLoading) return <Loader open={true} />;

  return (
    <Box sx={{ width: "100%" }}>
      {/* ✅ عرض البيانات */}
      {authorityDeposits?.length > 0 ? (
        <>
          {authorityDeposits.map((item) => (
            <Deposite
              key={item._id}
              Data={item}
              onDetails={() => {
                handleDetails(item);
              }}
            />
          ))}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
            }}
          >
            <Typography fontSize={14} color="text.secondary">
              إجمالي النتائج:{" "}
              {authorityDepositsPagination?.resultCount ||
                authorityDeposits.length}
            </Typography>
            <BasicPagination
              page={currentPage}
              count={authorityDepositsPagination?.totalPages || 1}
              handleChange={handlePaginationChange}
            />
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography fontWeight={700} fontSize="18px" color="#666">
            لا توجد بيانات متاحة.
          </Typography>
        </Box>
      )}

      {/* ✅ Dialog تأكيد التحويل */}
      <DepositConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        data={selectedDeposit}
        onConfirm={handleConfirm}
      />

      {/* ✅ Snackbar للتنبيهات */}
      <CustomSnackbar
        type={alert.type}
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alert.msg}
      />
    </Box>
  );
}
