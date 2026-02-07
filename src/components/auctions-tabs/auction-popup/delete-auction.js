import { useTranslation } from "next-i18next";
import CustomButton from "@/components/button";
import { styles } from "@/components/globalStyle";
import Loader from "@/components/loader";
import PopupTitle from "@/components/popup-title";
import CustomSnackbar from "@/components/toastMsg";
import {
  deleteAuction,
  getAllAuctions,
  getAuction,
  publishAuction,
} from "@/Redux/slices/auctionsSlice";
import { deleteOrigin } from "@/Redux/slices/originsSlice";
import { getPartners } from "@/Redux/slices/partnerSlice";
import constants from "@/services/constants";
import { buildQueryParams } from "@/services/utils";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DeleteAuction({
  handleClose,
  auctionData,
  selectedOrigin,
  setAlertOpen,
  setAlert,
}) {
  const { t } = useTranslation();
  const { errorDelete, loadingDelete, loadingAuction } = useSelector(
    (state) => state.auctions
  );
  const auctionsLoading = useSelector(
    (state) =>
      state.auctions?.loading?.[auctionData.status]?.[
        auctionData.specialToSupportAuthority
      ]
  );
  const dispatch = useDispatch();
  const router = useRouter();
  // const [alertOpen, setAlertOpen] = useState(false);
  // const [alert, setAlert] = useState({});
  // auctionData._id
  const handleOriginssDelete = async () => {
    try {
      await dispatch(deleteOrigin(selectedOrigin)).unwrap();
      await dispatch(getAuction(auctionData?._id)).unwrap();
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: auctionData?.status,
            reviewStatus: auctionData?.auctionReviewStatus.status,
            specialToSupportAuthority: auctionData.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
            // ...(auctionData?.createdByAdmin === false && {
            //   createdByAdmin: "false",
            // }),
          })
        )
      ).unwrap();
      setAlert({ msg: t("components_auctions-tabs_auction-popup_delete-auction.تم_حذف_الاصل_بنجاح"), type: "success" });
      setAlertOpen(true);

      handleClose();
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);

      console.error(" Request Failed:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteAuction(auctionData?._id)).unwrap();
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: "pending",
            reviewStatus: auctionData?.auctionReviewStatus.status,
            specialToSupportAuthority: auctionData.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
          })
        )
      ).unwrap();

      setAlertOpen(true);
      setAlert({ msg: t("components_auctions-tabs_auction-popup_delete-auction.تم_حذف_المزاد_بنجاح"), type: "success" });
      handleClose();
      router.push("/auctions");
    } catch (error) {
      console.error("Error:", error);
      setAlert({
        msg: errorDelete || t("components_auctions-tabs_auction-popup_delete-auction.حدث_خطأ"),
        type: "error",
      });
      setAlertOpen(true);
    }
  };

  if (loadingDelete || loadingAuction || auctionsLoading)
    return <Loader open={true} />;

  return (
    <Box sx={{ ...styles.popupContainer, border: "none" }}>
      <PopupTitle
        title={selectedOrigin ? "حذف الاصل " : t("components_auctions-tabs_auction-popup_delete-auction.حذف_المزاد")}
        handleClose={handleClose}
      />
      <img
        src="/images/icons/trash-icon.svg"
        width="72px"
        height="72px"
        style={{ marginTop: "15px" }}
      />

      <Typography sx={{ fontSize: "1rem", color: "#6F6F6F" }}>
        {selectedOrigin
          ? t("components_auctions-tabs_auction-popup_delete-auction.هل_أنت_متأكد_أنك")
          : "هل أنت متأكد أنك تريد حذف هذا المزاد نهائيا؟ "}{" "}
      </Typography>
   
      <Box
        sx={{
          ...styles.popupBtnsContainer,
        }}
      >
        <CustomButton
          customeStyle={{
            width: { xs: "100%" },
            background: "#D32F2F",
            border: "1px solid #D32F2F",
            // color: "#fff",
            fontWeight: 700,
            "&:hover": {
              background: "#D32F2F",
              boxShadow: "none",
            },
          }}
          handleClick={selectedOrigin ? handleOriginssDelete : handleDelete}
          text={t("components_auctions-tabs_auction-popup_delete-auction.حذف")}
        />
      </Box>
      {/* <CustomSnackbar
        type={alert.type}
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alert.msg}
      /> */}
    </Box>
  );
}
