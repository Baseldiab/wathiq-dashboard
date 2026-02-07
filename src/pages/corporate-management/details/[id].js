import { useTranslation } from "next-i18next";
import CorMainInfo from "@/components/corporate/main-info";
import CompanyInfo from "@/components/home/companyInfo";
import { updateProfile } from "@/Redux/slices/profileSlice";
import {
  getAllProviders,
  getAnalysisProvider,
  getProvider,
  notifyProvider,
  updateProvider,
} from "@/Redux/slices/providerSlice";
import { Backdrop, Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/button";
import Image from "next/image";
import constants from "@/services/constants";
import {
  buildQueryParams,
  hasRole,
  setLargeStatusStyle,
  setStatusStyle,
} from "@/services/utils";
import TotalCard from "@/components/total-card";
import Loader from "@/components/loader";
import Link from "next/link";
import ProfileImg from "@/components/image-box/profile-img";
import { useRouter } from "next/router";
import BreadcrumbsNav from "@/components/layout/navbar/bread-crumb-nav";
import CustomButton from "@/components/button";
import Head from "next/head";
import { styles } from "@/components/globalStyle";
import Input from "@/components/inputs";
import CustomSnackbar from "@/components/toastMsg";
import BlockCorporate from "@/components/corporate/contracting-corporates/popup/block-corporate";
import SendNotification from "@/components/corporate/contracting-corporates/popup/send-notification";
import PageCover from "@/components/page-cover";

export default function CorporateDetails() {
  const { t } = useTranslation();
  const {
    provider,
    analysisProvider,
    errorProvider,
    loadingProvider,
    updatedProviderLoading,
    loadingApproved,
    loadingBlocked,
    notifyProviderLoading,
  } = useSelector((state) => state.provider);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({});
  const [type, setType] = useState(false);
  let requestStatus = provider?.data?.status?.value;

  const dispatch = useDispatch();
  const router = useRouter();

  const handleOpen = (popupType) => {
    setType(popupType);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (value) => {
    setReason(value);
    setError("");
  };
  useEffect(() => {
    const providerId = provider?.data?._id;
    const queryId = router.query.id;

    if (queryId && providerId !== queryId) {
      dispatch(getProvider(queryId));
      dispatch(getAnalysisProvider(queryId));
    }
  }, [router.query.id, provider?.data?._id]);

  const handleFileChange = async (event) => {
    let response = await dispatch(
      updateProvider({
        data: {
          companyProfileImage: event.target.files[0],
        },
        id: provider?.data?._id,
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      if (provider?.data?._id) {
        dispatch(getProvider(provider?.data?._id));
      }
    }
  };

  if (errorProvider) {
    return <>404</>;
  }
  const handleEdit = () => {
    router.push(`/corporate-management/edit/${provider?.data?._id}`);
  };
  const handleBlock = async () => {
    if (!reason)
      return setError(
        t("pages_corporate-management_details_[id].يرجى_إدخال_سبب_الرفض")
      );
    try {
      await dispatch(
        updateProvider({
          id: provider?.data?._id,
          data: { status: { value: "blocked", reason: reason } },
        })
      ).unwrap();
      await dispatch(
        getAllProviders(buildQueryParams({ status: "blocked" }))
      ).unwrap();
      await dispatch(
        getAllProviders(buildQueryParams({ status: "approved" }))
      ).unwrap();
      await dispatch(getProvider(provider?.data?._id)).unwrap();
      setAlert({
        msg: t("pages_corporate-management_details_[id].تم_الحظر_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
    }
  };
  const handleUnBlock = async () => {
    try {
      await dispatch(
        updateProvider({
          id: provider?.data?._id,
          data: { status: { value: "approved" } },
        })
      ).unwrap();
      await dispatch(getProvider(provider?.data?._id)).unwrap();
      await dispatch(
        getAllProviders(buildQueryParams({ status: "blocked" }))
      ).unwrap();
      await dispatch(
        getAllProviders(buildQueryParams({ status: "approved" }))
      ).unwrap();
      setAlert({
        msg: t("pages_corporate-management_details_[id].تم_الغاء_الحظر_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      console.log(error);
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
    }
  };
  const handleNotification = async (formData) => {
    try {
      await dispatch(
        notifyProvider({
          data: {
            title: { ar: formData.title },
            message: { ar: formData.msg },
            recipient: provider?.data?.user,
          },
        })
      ).unwrap();
      setAlert({
        msg: t(
          "pages_corporate-management_details_[id].تم_إرسال_الاشعار_بنجاح"
        ),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      !loadingProvider &&
      // !updatedProviderLoading &&
      !loadingApproved &&
      !loadingBlocked
      // &&
      // !notifyProviderLoading
    ) {
      const timer = setTimeout(() => setLoading(false), 200);
      return () => clearTimeout(timer);
    } else {
      setLoading(true);
    }
  }, [
    loadingProvider,
    // updatedProviderLoading,
    loadingApproved,
    loadingBlocked,
    // notifyProviderLoading,
  ]);

  if (loading) return <Loader open={true} />;
  const showBackDropContent = () => {
    switch (type) {
      case "block-provider":
        return (
          <BlockCorporate
            handleClose={handleClose}
            reason={reason}
            handleBlock={handleBlock}
            error={error}
            handleInputChange={handleInputChange}
            loadingBlocked={updatedProviderLoading}
          />
        );
      case "send-notification":
        return (
          <SendNotification
            handleNotification={handleNotification}
            handleClose={handleClose}
            loading={notifyProviderLoading}
          />
        );

      default:
        break;
    }
  };
  return (
    <>
      <Head>
        <title> تفاصيل شركة {provider?.data?.companyName}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 2,
            mb: requestStatus == "blocked" ? 3 : 0,
          }}
        >
          <BreadcrumbsNav
            title={t("pages_corporate-management_details_[id].إدارة_الشركات")}
            links={[
              {
                href: "/corporate-management",
                label: t(
                  "pages_corporate-management_details_[id].إدارة_الشركات"
                ),
              },
              {
                href: {
                  pathname: "/corporate-management",
                  query: {
                    mainTab: requestStatus == "blocked" ? 3 : 1,
                    ...(requestStatus === "blocked" && { subTab: 1 }),
                  },
                },
                label:
                  requestStatus == "blocked"
                    ? t("pages_corporate-management_details_[id].شركات_محظورة")
                    : t(
                        "pages_corporate-management_details_[id].الشركات_المتعاقدة"
                      ),
              },
            ]}
            currentText={provider?.data?.companyName}
          />
          {requestStatus !== "blocked" && (
            <>
              {hasRole("update provider") && (
                <Typography
                  onClick={() => handleOpen("block-provider")}
                  sx={{
                    ...setLargeStatusStyle(
                      t("pages_corporate-management_details_[id].حظر")
                    ),
                  }}
                >
                  {t("pages_corporate-management_details_[id].حظر_الشركة")}
                </Typography>
              )}
            </>
          )}
        </Box>
        {/* {requestStatus !== "blocked" && (
          <>
            {hasRole("provider analysis") && (
              <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <TotalCard
                    title={t("pages_corporate-management_details_[id].اجمالي_مزادات_الشركة")}
                    data={
                      analysisProvider?.data?.onGoingAuctions +
                      analysisProvider?.data?.completedAuctions +
                      analysisProvider?.data?.canceledAuctions
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TotalCard
                    title={t("pages_corporate-management_details_[id].المزادات_النشطة")}
                    data={analysisProvider?.data?.onGoingAuctions}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TotalCard
                    title={t("pages_corporate-management_details_[id].عدد_الموظفين")}
                    data={analysisProvider?.data?.employeesCount}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TotalCard
                    title={t("pages_corporate-management_details_[id].إجمالي_مبالغ_المزايدات")}
                    data={analysisProvider?.data?.TotalBiddingAmounts + " ر.س"}
                  />
                </Grid>
              </Grid>
            )}
          </>
        )} */}
        <PageCover
          img={provider?.data?.companyProfileImage}
          title={provider?.data?.companyName}
        >
          {" "}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {requestStatus !== "blocked" &&
              hasRole(["send notification", "update provider"]) && (
                <Box
                  component="img"
                  src="/images/icons/notification-2.svg"
                  sx={{
                    padding: "12px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen("send-notification")}
                />
              )}

            {hasRole("update provider") && (
              <CustomButton
                customeStyle={{
                  width: "100px",
                  background: "#fff",
                  color: constants.colors.black,
                  fontWeight: 700,
                  "&:hover": {
                    background: "#fff",
                    color: constants.colors.black,
                    boxShadow: "none",
                  },
                }}
                handleClick={() => {
                  handleEdit();
                }}
                text={t("pages_corporate-management_details_[id].تعديل")}
                type="edit"
              />
            )}
            {hasRole("update provider") && requestStatus == "blocked" && (
              <CustomButton
                customeStyle={{
                  // width: "100px",
                  color: "#E34935",
                  fontWeight: "bold",
                  background: "#FFEDEA",
                  border: "1.5px solid #E34935",
                  "&:hover": {
                    background: "#FFEDEA",
                    color: "#E34935",
                    boxShadow: "none",
                  },
                }}
                handleClick={() => {
                  handleUnBlock();
                }}
                disabled={updatedProviderLoading}
                text={
                  updatedProviderLoading
                    ? t("pages_corporate-management_details_[id].جاري_التجميل")
                    : t("pages_corporate-management_details_[id].الغاء_الحظر")
                }
                // type="edit"
              />
            )}
          </Box>
        </PageCover>
        <Box
          sx={{
            bgcolor: "#fff",
            padding: { xs: "0px", md: "24px 0px" },
            borderTop: "1px solid #D6D9E1",
          }}
        >
          <CorMainInfo info={provider?.data} />
        </Box>
        <Backdrop open={open} onClick={handleClose} sx={{ zIndex: "99" }}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxHeight: "85%",
              overflow: "auto",
              bgcolor: "white",
              borderRadius: "12px",
              // padding: "20px",
              boxShadow: 3,
              width: {
                xs: "90%",
                sm: "80%",
                md: "60%",
                lg: "45%",
                xl: "30%",
              },
            }}
          >
            {showBackDropContent()}
          </Box>
        </Backdrop>
        <CustomSnackbar
          type={alert.type}
          open={alertOpen}
          setOpen={setAlertOpen}
          message={alert.msg}
        />
      </Box>
    </>
  );
}
