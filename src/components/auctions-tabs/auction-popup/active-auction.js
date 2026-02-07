import { useTranslation } from "next-i18next";
import CustomButton from "@/components/button";
import { styles } from "@/components/globalStyle";
import Loader from "@/components/loader";
import PopupTitle from "@/components/popup-title";
import CustomSnackbar from "@/components/toastMsg";
import {
  getAllAuctions,
  getAuction,
  publishAuction,
} from "@/Redux/slices/auctionsSlice";
import { getLogos } from "@/Redux/slices/logosSlice";
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

export default function ActiveAuction({
  handleClose,
  auctionData,
  setAlertOpen,
  setAlert,
}) {
  const { t } = useTranslation();
  const { errorPublish, loadingPublish, loadingAuction } = useSelector(
    (state) => state.auctions
  );
  const { logos } = useSelector((state) => state.logos || {});
  const { data: profile } = useSelector((state) => state.profile);
  const auctionsLoading = useSelector(
    (state) =>
      state.auctions?.loading?.[auctionData?.status]?.[
        auctionData.specialToSupportAuthority
      ]
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedLogos, setSelectedLogos] = useState([]);

  const handleSelectLogo = (logo) => {
    console.log("logos", logo);
    if (selectedLogos.some((selected) => selected.logo === logo.logo)) {
      // Remove logo if already selected
      setSelectedLogos(
        selectedLogos.filter((selected) => selected.logo !== logo.logo)
      );
    } else {
      if (selectedLogos.length < 2) {
        setSelectedLogos([...selectedLogos, logo]);
      }
    }
  };
  useEffect(() => {
    if (!logos && profile?.data?.type === "admin") dispatch(getLogos());
  }, []);
  const handleActive = async () => {
    // Check if logos are selected
    if (selectedLogos.length !== 2) {
      setAlert({ msg: t("components_auctions-tabs_auction-popup_active-auction.يرجى_اختيار_لوجو_شركتين"), type: "error" });
      setAlertOpen(true);
      return;
    }
    if (!auctionData?.auctionOrigins?.length > 0) {
      setAlert({
        msg: t("components_auctions-tabs_auction-popup_active-auction.يجب_أن_يحتوي_المزاد"),
        type: "error",
      });
      setAlertOpen(true);
      return;
    }
    console.log("selectedLogos", selectedLogos);
    try {
      await dispatch(
        publishAuction({
          data: {
            status: "in_progress",
            logos: selectedLogos.map((logo) => ({ logo: logo.logo })),
          },
          id: auctionData?._id,
        })
      ).unwrap();
      await dispatch(getAuction(auctionData._id)).unwrap();
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: "pending",
            reviewStatus: "approved",
            specialToSupportAuthority: auctionData.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
          })
        )
      ).unwrap();
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: "in_progress",
            reviewStatus: "approved",
            specialToSupportAuthority: auctionData.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
          })
        )
      ).unwrap();
      setAlert({ msg: t("components_auctions-tabs_auction-popup_active-auction.تم_تفعيل_المزاد_بنجاح"), type: "success" });
      setAlertOpen(true);
      // router.push({
      //   pathname: "/auctions",
      //   query: { mainTab: 4 },
      // });
      handleClose();
    } catch (error) {
      setAlert({
        msg: error || errorPublish || t("components_auctions-tabs_auction-popup_active-auction.حدث_خطأ"),
        type: "error",
      });
      setAlertOpen(true);
    }
  };

  // if (loadingPublish || loadingAuction || auctionsLoading)
  //   return <Loader open={true} />;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadingPublish && !loadingAuction && !auctionsLoading) {
      const timer = setTimeout(() => setLoading(false), 200);
      return () => clearTimeout(timer);
    } else {
      setLoading(true);
    }
  }, [loadingPublish, loadingAuction, auctionsLoading]);

  if (loading) return <Loader open={true} />;

  return (
    <Box sx={{ ...styles.popupContainer, alignItems: "start", border: "none" }}>
      <PopupTitle title={t("components_auctions-tabs_auction-popup_active-auction.تفعيل_المزاد")} handleClose={handleClose} />
      <Typography sx={{ fontSize: "1rem", color: "#161008", fontWeight: 700 }}>
        لوجو الشركات (حدد 2 لوجو){" "}
      </Typography>
      <Grid container spacing={2}>
        {logos?.data?.map((item) => (
          <Grid item xs={4} sm={3} xl={4} key={item._id}>
            <Box
              sx={{
                textAlign: "center",
                border: selectedLogos.some((logo) => logo.logo === item.logo)
                  ? `2px solid${constants.colors.main}` // Apply border when selected
                  : "1px solid #D6D9E1", // Default border
                borderRadius: "8px",
                padding: "12px",
                cursor: "pointer", // Make logo clickable
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: constants.colors.main,
                },
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
              onClick={() => handleSelectLogo(item)}
            >
              <Box
                sx={{
                  // backgroundColor: "#D9D9D9",
                  borderRadius: "4px",
                  height: "50px",
                  //   width: "80px",
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                />
              </Box>

              <Typography
                sx={{
                  color: constants.colors.dark_green,
                  fontSize: "0.875rem",
                }}
              >
                {item.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          ...styles.popupBtnsContainer,
        }}
      >
        <CustomButton
          customeStyle={{
            width: { xs: "100%" },
          }}
          disabled={selectedLogos.length < 2}
          handleClick={handleActive}
          text={t("components_auctions-tabs_auction-popup_active-auction.تفعيل_المزاد")}
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
