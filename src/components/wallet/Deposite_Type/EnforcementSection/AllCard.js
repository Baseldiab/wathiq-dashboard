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
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function AllCard() {
  const { t } = useTranslation();
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

  const query = buildQueryParams({ page: currentPage, limit: 3 });

  useEffect(() => {
    dispatch(fetchAuthorityDeposits(query))
      .unwrap()
      .catch((error) => {
        setAlert({
          type: "error",
          msg:
            error?.error ||
            t(
              "components_auction-winner_enforcement_all-card.فشل_في_تحميل_البيانات"
            ),
        });
        setAlertOpen(true);
      });
  }, [dispatch, currentPage]);

  const handlePaginationChange = (_, newPage) => {
    setCurrentPage(newPage);
  };

  // ✅ فتح الفورم عند الضغط على تفاصيل العنصر
  const handleDetails = (item) => {
    setSelectedDeposit(item);
    setIsDialogOpen(true);
  };

  // ✅ عند تأكيد التحويل من داخل الفورم
  const handleConfirm = async () => {
    try {
      await dispatch(
        updateAuthDeposite({
          id: selectedDeposit._id,
          status: "paid",
        })
      ).unwrap();

      setAlert({
        type: "success",
        msg: t(
          "components_auction-winner_enforcement_all-card.تم_تأكيد_تحويل_العربون_بنجاح"
        ),
      });
      setAlertOpen(true);
      setIsDialogOpen(false);

      // ✅ إعادة تحميل البيانات
      dispatch(fetchAuthorityDeposits(query));
    } catch (error) {
      setAlert({
        type: "error",
        msg:
          error?.error ||
          t(
            "components_auction-winner_enforcement_all-card.فشل_في_تأكيد_التحويل"
          ),
      });
      setAlertOpen(true);
    }
  };

  if (authorityDepositsLoading) return <Loader open={true} />;

  return (
    <Box sx={{ width: "100%" }}>
      {authorityDeposits?.length > 0 ? (
        <>
          {authorityDeposits.map((item) => (
            <Deposite
              key={item._id}
              Data={item}
              onDetails={() => handleDetails(item)}
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
              {t(
                "components_auction-winner_enforcement_all-card.إجمالي_النتائج"
              )}{" "}
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
        // <Box sx={{ textAlign: "center", mt: 6 }}>
        //   <Typography fontWeight={700} fontSize="18px" color="#666">
        //     {t(
        //       "components_auction-winner_enforcement_all-card.لا_توجد_بيانات_متاحة"
        //     )}
        //   </Typography>
        // </Box>
        <Box sx={{ textAlign: "center", mt: 8, p: 4 }}>
          <Image
            src={"/images/no-wallet.svg"}
            alt={t("components_wallet_private_enrollments.لا_توجد_معاملات")}
            width={120}
            height={120}
            style={{ marginBottom: "24px" }}
          />
          <Typography fontWeight={700} fontSize="24px" sx={{ mb: 2 }}>
            {t(
              "components_wallet_private_enrollments.لا_توجد_معاملات_لإظهارها"
            )}
          </Typography>
          <Typography fontSize="16px" color="#6F6F6F">
            {t(
              "components_wallet_private_enrollments.لم_تقم_بأي_معاملات_بمجرد_إجراء_أي_معاملات_ستظهر_هنا"
            )}
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
