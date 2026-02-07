import { useTranslation } from "next-i18next";
import CorMainInfo from "@/components/corporate/main-info";
import CompanyInfo from "@/components/home/companyInfo";
import { updateProfile } from "@/Redux/slices/profileSlice";
import {
  getAllProviders,
  getAllProvidersRequests,
  getAnalysisProvider,
  getProvider,
  getProviderRequest,
  syncCreateProvider,
  updateProvider,
  updateProviderRequest,
} from "@/Redux/slices/providerSlice";
import { Backdrop, Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/button";
import Image from "next/image";
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
import constants from "@/services/constants";
import RequestReject from "@/components/corporate/contract-requests/popup/request-reject";
import RequestAccept from "@/components/corporate/contract-requests/popup/request-accept";
import PageCover from "@/components/page-cover";

export default function CorporateDetails() {
  const { t } = useTranslation();
  const {
    requestProvider,
    loadingRequestProvider,
    errorRequestProvider,
    loadingPending,
    loadingRejected,
    syncCreateProviderError,
    syncCreateProviderFlag,
    updatedProviderRequestloading,
    loadingProvider,
  } = useSelector((state) => state.provider);
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [password, setPassword] = useState("");
  const [originPrice, setOriginPrice] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  let requestStatus = requestProvider?.data?.status?.value;
  useEffect(() => {
    if (typeof router.query.id === "undefined") return;
    const queryId = router.query.id;
    const providerId = requestProvider?.data?._id;

    if (queryId && providerId !== queryId) {
      dispatch(getProviderRequest(queryId));
    }
  }, [router.query.id]);

  if (loadingRequestProvider) return <Loader open={true} />;

  if (errorRequestProvider) {
    return <>404</>;
  }


  const handleOpen = (popupType) => {
    setType(popupType);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setError("");
    setRejectReason("");
  };
  const handleReject = async () => {
    if (!rejectReason)
      return setError(
        t(
          "pages_corporate-management_request-details_[id].يرجى_إدخال_سبب_الرفض"
        )
      );
    try {
      await dispatch(
        updateProviderRequest({
          id: requestProvider?.data?._id,
          data: { status: "rejected", reason: rejectReason },
        })
      ).unwrap();
      await dispatch(
        getAllProvidersRequests(buildQueryParams({ status: "rejected" }))
      ).unwrap();
      await dispatch(
        getAllProvidersRequests(buildQueryParams({ status: "pending" }))
      ).unwrap();
      await dispatch(getProviderRequest(requestProvider?.data?._id)).unwrap();

      router.push({
        pathname: "/corporate-management",
        query: { mainTab: 3, subTab: 2 },
      });
      handleClose();
    } catch (error) {
      setError(error);
    }
  };
  const handleAccept = async () => {
    if (!password)
      return setError(
        t(
          "pages_corporate-management_request-details_[id].يرجى_إدخال_كلمة_المرور"
        )
      );

    try {
      await dispatch(
        syncCreateProvider({
          id: requestProvider?.data?._id,
          data: { password, originPrice },
        })
      ).unwrap();

      await dispatch(
        getAllProvidersRequests(buildQueryParams({ status: "pending" }))
      ).unwrap();
      if (hasRole("get providers")) {
        await dispatch(
          getAllProviders(buildQueryParams({ status: "approved" }))
        ).unwrap();
        await dispatch(getProvider(requestProvider?.data?._id)).unwrap();
      }
      handleClose();
      router.push({
        pathname: "/corporate-management",
      });
    } catch (error) {
      setError(error);
    }
  };
  console.log("requestStatus", requestStatus);
  if (
    loadingPending ||
    loadingRejected ||
    updatedProviderRequestloading ||
    loadingProvider
  )
    return <Loader open={true} />;

  const showBackDropContent = () => {
    switch (type) {
      case "reject-request":
        return (
          <RequestReject
            handleClose={handleClose}
            setRejectReason={setRejectReason}
            handleReject={handleReject}
            error={error}
            setError={setError}
          />
        );
      case "accept-request":
        return (
          <RequestAccept
            handleClose={handleClose}
            handleAccept={handleAccept}
            setPassword={setPassword}
            setOriginPrice={setOriginPrice}
            originPrice={originPrice}
            password={password}
            error={error}
            setError={setError}
            phone={requestProvider?.data?.user?.phoneNumber?.number}
            email={requestProvider?.data?.user?.email}
          />
        );

      default:
        break;
    }
  };
  return (
    <>
      <Head>
        <title> تفاصيل شركة {requestProvider?.data?.companyName}</title>
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
            mb: { xs: 2, md: 3 },
          }}
        >
          <BreadcrumbsNav
            title={t(
              "pages_corporate-management_request-details_[id].إدارة_الشركات"
            )}
            links={[
              {
                href: "/corporate-management",
                label: t(
                  "pages_corporate-management_request-details_[id].إدارة_الشركات"
                ),
              },
              {
                href: {
                  pathname: "/corporate-management",
                  query: {
                    mainTab: requestStatus == "rejected" ? 3 : 2,
                    ...(requestStatus === "rejected" && { subTab: 2 }),
                  },
                },
                label:
                  requestStatus == "rejected"
                    ? t(
                        "pages_corporate-management_request-details_[id].الأرشيف"
                      )
                    : t(
                        "pages_corporate-management_request-details_[id].طلبات_التعاقد"
                      ),
              },
            ]}
            currentText={requestProvider?.data?.companyName}
          />
        </Box>

        <PageCover
          img={requestProvider?.data?.companyProfileImage}
          title={requestProvider?.data?.companyName}
          noUpdate
        >
          {" "}
          {hasRole("manage provider requests") && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {requestStatus !== "rejected" && (
                <CustomButton
                  customeStyle={{
                    // width: "100px",
                    background: "#FFEDEA",
                    border: "1px solid #E34935",
                    color: "#E34935",
                    fontWeight: 700,
                    "&:hover": {
                      background: "#FFEDEA",
                      boxShadow: "none",
                    },
                  }}
                  handleClick={() => handleOpen("reject-request")}
                  text={t(
                    "pages_corporate-management_request-details_[id].رفض_الطلب"
                  )}
                />
              )}
              {requestStatus == "rejected" && (
                <Typography
                  sx={{
                    ...setStatusStyle(
                      t("pages_corporate-management_request-details_[id].مرفوض")
                    ),
                    py: "8px",
                    color: "#C21818",
                    bgcolor: "#FFEDEA",
                    border: "none",
                  }}
                >
                  {t("pages_corporate-management_request-details_[id].مرفوض")}
                </Typography>
              )}

              <CustomButton
                handleClick={() => handleOpen("accept-request")}
                customeStyle={{
                  // width: "100px",
                  background: "#22A06B",
                  color: "#fff",
                  fontWeight: 700,
                  "&:hover": {
                    background: "#22A06B",
                    boxShadow: "none",
                  },
                }}
                text={t(
                  "pages_corporate-management_request-details_[id].قبول_الطلب"
                )}
              />
            </Box>
          )}
        </PageCover>

        <Box
          sx={{
            bgcolor: "#fff",
            padding: { xs: "0px", md: "24px 0px" },
            borderTop: "1px solid #D6D9E1",
          }}
        >
          <CorMainInfo info={requestProvider?.data} request />
        </Box>
        <Backdrop open={open} onClick={handleClose}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxHeight: "85%",
              overflow: "auto",
              bgcolor: "white",
              borderRadius: "12px",
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
      </Box>
    </>
  );
}
