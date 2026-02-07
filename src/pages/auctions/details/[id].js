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
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

import { useRouter } from "next/router";
import BreadcrumbsNav from "@/components/layout/navbar/bread-crumb-nav";
import CustomButton from "@/components/button";
import Head from "next/head";
import { styles } from "@/components/globalStyle";
import Input from "@/components/inputs";
import CustomSnackbar from "@/components/toastMsg";
import {
  addExtraTime,
  getAllAuctions,
  getAuction,
  publishAuction,
  reviewAuction,
} from "@/Redux/slices/auctionsSlice";
import ImageBox from "@/components/image-box";
import {
  AuctionTypeFunction,
  buildQueryParams,
  determineAuctionStatuses,
  formatDate,
  formatNumber,
  getFileType,
  hasRole,
  isAdmin,
  setLargeStatusStyle,
  setStatusStyle,
} from "@/services/utils";
import TotalCard from "@/components/total-card";
import DetailBox from "@/components/details-box";
import File from "@/components/file";
import Loader from "@/components/loader";
import { deleteOrigin, getOrigin } from "@/Redux/slices/originsSlice";
import ActiveAuction from "@/components/auctions-tabs/auction-popup/active-auction";
import DeleteAuction from "@/components/auctions-tabs/auction-popup/delete-auction";
import NotFound from "@/pages/404";
import RequestReject from "@/components/corporate/contract-requests/popup/request-reject";
import AuctionType from "@/components/auctions-tabs/auction-type";
import EnrolledCount from "@/components/auctions-tabs/enrolled-count";
import ConfirmAction from "@/components/popup-actions/confirm-action";
import LabelData from "@/components/corporate/main-info/label-data";
import SectionHead from "@/components/corporate/main-info/section-head";
import constants from "@/services/constants";
import SAR from "@/components/sar";
import WalletAvailable from "@/components/auctions-tabs/wallet-available";

export default function AuctionDetails() {
  const { t } = useTranslation();
  const {
    auction,
    loadingAuction,
    errorAuction,
    loadingReview,
    errorReview,
    loadingExtraTime,
  } = useSelector((state) => state.auctions);
  const { deleteOriginsLoading, loadingOrigin } = useSelector(
    (state) => state.origins
  );
  const { data: profile } = useSelector((state) => state.profile);
  const { walletBalance } = useSelector((state) => state.wallet);
  const originPrice =
    profile?.data?.employeeType == "provider_staff"
      ? profile?.data?.provider.originPrice
      : profile?.data?.originPrice || 0;
  const wallet = walletBalance?.data?.balance || 0;
  const admin = profile?.data?.type == "admin";

  const maxOrigins = useMemo(() => {
    return !admin ? Math.floor(wallet / originPrice) : true;
  }, [wallet, originPrice, admin]);

  // const [reviewStatus, setReviewState] = useState("");
  // const [auctionStatus, setAuctionStatus] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedOrigin, setselectedOrigin] = useState("");
  const [type, setType] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const auctionData = auction?.data;
  const dispatch = useDispatch();
  const router = useRouter();
  const statueReviewFromApi = auctionData?.auctionReviewStatus?.status;
  const { reviewStatus, auctionStatus } = determineAuctionStatuses(auctionData);
  console.log("auctionData status", auctionData?.status);
  const inPlatform = auctionData?.status != "pending";
  console.log("auctionStatussssss from page", auctionStatus);

  useEffect(() => {
    const auctionId = auction?.data?._id;
    const queryId = router.query.id;

    if (queryId && auctionId !== queryId) {
      dispatch(getAuction(queryId));
    }
  }, [router.query.id, auction?.data?._id]);

  const handleOpen = (popupType, id) => {
    setselectedOrigin(id);
    setType(popupType);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setError("");
    setRejectReason("");
  };
  const getMainTabValue = (reviewStatus, status, createdByAdmin) => {
    const actionKey = `${reviewStatus}-${status}-${createdByAdmin}`;

    switch (actionKey) {
      case "pending-pending-true":
        return 1;
      case "need_to_review-pending-true":
        return 2;
      case "approved-pending-true":
        return 3;
      case "need_to_review-pending-false":
      case "approved-pending-false":
      case "rejected-pending-false":
        return 4;
      case "approved-in_progress-false":
      case "approved-in_progress-true":
      case "approved-completed-false":
      case "approved-completed-true":
      case "approved-on_going-false":
      case "approved-on_going-true":
      case "approved-canceled-true":
      case "approved-canceled-false":
        return 5;
      default:
        return 0;
    }
  };
  const handleEdit = () => {
    router.push(`/auctions/edit/${auctionData?._id}`);
  };
  if (loadingAuction) return <Loader open={true} />;
  const handleOriginssDetails = async (id) => {
    // if (auction?.data?._id != id) {
    await dispatch(getOrigin(id));

    // if (response?.meta?.requestStatus === "fulfilled") {
    router.push(`/origins/details/${id}`);
    //   }
    // } else {
    //   router.push(`/origins/details/${id}`);
    // }
  };
  // const handleOriginssDelete = async (id) => {
  //   // if (auction?.data?._id != id) {
  //   try {
  //     await dispatch(deleteOrigin(id)).unwrap();
  //     await dispatch(getAuction(auctionData?._id)).unwrap();
  //     setAlert({ msg: t("pages_auctions_details_[id].تم_الحذف_بنجاح"), type: "success" });
  //     setOpen(true);
  //   } catch (error) {
  //     setOpen(true);
  //     setAlert({ msg: error, type: "error" });
  //   }
  //   // if (response?.meta?.requestStatus === "fulfilled") {
  //   //   }
  //   // } else {
  //   //   router.push(`/origins/details/${id}`);
  //   // }
  // };
  const handleReject = async () => {
    if (!rejectReason)
      return setError(t("pages_auctions_details_[id].يرجى_إدخال_سبب_الرفض"));
    try {
      await dispatch(
        reviewAuction({
          id: auctionData?._id,
          data: { status: "rejected", reason: rejectReason },
        })
      ).unwrap();

      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: auctionData?.status,
            reviewStatus: statueReviewFromApi || "",
            specialToSupportAuthority: auctionData?.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
          })
        )
      );
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: auctionData?.status,
            reviewStatus: "rejected",
            specialToSupportAuthority: auctionData?.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
          })
        )
      ).unwrap();

      setAlert({
        msg: t("pages_auctions_details_[id].تم_رفض_الطلب_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      // router.push({
      //   pathname: "/auctions",
      //   query: {
      //     mainTab: auctionData?.createdByAdmin === false ? 3 : 2,
      //   },
      // });
    } catch (error) {
      setAlert({
        msg: errorReview || t("pages_auctions_details_[id].حدث_خطأ"),
        type: "error",
      });

      setAlertOpen(true);
    }
  };

  if (deleteOriginsLoading || loadingOrigin || loadingReview)
    return <Loader open={true} />;
  if (errorAuction == t("pages_auctions_details_[id].المزاد_غير_موجود"))
    return <NotFound />;
  const showBackDropContent = () => {
    switch (type) {
      case "active-auction":
        return (
          <ActiveAuction
            handleClose={handleClose}
            auctionData={auctionData}
            setAlertOpen={setAlertOpen}
            setAlert={setAlert}
          />
        );
      case "delete-auction":
        return (
          <DeleteAuction
            auctionData={auctionData}
            handleClose={handleClose}
            setAlertOpen={setAlertOpen}
            setAlert={setAlert}
          />
        );
      case "reject-auction":
        return (
          <RequestReject
            handleClose={handleClose}
            setRejectReason={setRejectReason}
            handleReject={handleReject}
            error={error}
            setError={setError}
            type="reject-auction"
          />
        );
      case "delete-origin":
        return (
          <DeleteAuction
            auctionData={auctionData}
            handleClose={handleClose}
            selectedOrigin={selectedOrigin}
            setAlertOpen={setAlertOpen}
            setAlert={setAlert}
          />
        );
      case "cancel-auction":
        return (
          <ConfirmAction
            title={t("pages_auctions_details_[id].ايقاف_المزاد")}
            desc={t("pages_auctions_details_[id].سيتم_إيقاف_المزاد_واعادة")}
            handleClose={handleClose}
            handleClick={handleCancel}
            btnTxt={t("pages_auctions_details_[id].إيقاف_المزاد")}
            danger
          />
        );
      default:
        break;
    }
  };
  const handleApprove = async () => {
    try {
      await dispatch(
        reviewAuction({
          id: auctionData?._id,
          data: { status: "approved" },
        })
      ).unwrap();

      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: auctionData?.status,
            reviewStatus: statueReviewFromApi || "",
            specialToSupportAuthority: auctionData?.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
          })
        )
      );
      await dispatch(getAuction(auctionData?._id)).unwrap();
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: auctionData?.status,
            reviewStatus: "approved",
            specialToSupportAuthority: auctionData?.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
          })
        )
      ).unwrap();

      setAlert({
        msg:
          auctionData?.createdByAdmin === false
            ? t("pages_auctions_details_[id].تمت_الموافقة_ع_الطلب")
            : t("pages_auctions_details_[id].تم_تنفيذ_المزاد_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      // router.push({
      //   pathname: "/auctions",
      //   query: {
      //     mainTab: auctionData?.createdByAdmin === false ? 3 : 2,
      //   },
      // });
    } catch (error) {
      setAlert({
        msg: errorReview || t("pages_auctions_details_[id].حدث_خطأ"),
        type: "error",
      });

      setAlertOpen(true);
    }
  };
  const handleCancel = async () => {
    try {
      await dispatch(
        publishAuction({
          data: {
            status: "canceled",
          },
          id: auctionData?._id,
        })
      ).unwrap();
      await dispatch(getAuction(auctionData._id)).unwrap();
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: auctionData?.status,
            reviewStatus: "approved",
            specialToSupportAuthority: auctionData.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
          })
        )
      ).unwrap();
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: "canceled",
            reviewStatus: "approved",
            specialToSupportAuthority: auctionData.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
          })
        )
      ).unwrap();
      setAlert({
        msg: t("pages_auctions_details_[id].تم_ايفاف_المزاد_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({
        msg: error || errorPublish || t("pages_auctions_details_[id].حدث_خطأ"),
        type: "error",
      });
      setAlertOpen(true);
    }
  };
  const handleAddExtraTime = async () => {
    try {
      await dispatch(addExtraTime(auctionData?._id)).unwrap();
      setAlert({
        msg: "تم تمديد الوقت بنجاح",
        type: "success",
      });
      setAlertOpen(true);
      await dispatch(getAuction(auctionData?._id));
    } catch (error) {
      setAlert({
        msg: error || "حدث خطأ أثناء تمديد الوقت",
        type: "error",
      });
      setAlertOpen(true);
    }
  };
  return (
    <>
      <Head>
        <title> تفاصيل مزاد {auctionData?.title}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <BreadcrumbsNav
        title={t("pages_auctions_details_[id].إدارة_المزادات")}
        links={[
          {
            href: "/auctions",
            label: t("pages_auctions_details_[id].إدارة_المزادات"),
          },
          {
            href: `/auctions?mainTab=${getMainTabValue(
              statueReviewFromApi,
              auctionData?.status,
              auctionData?.createdByAdmin
            )}`,
            label: reviewStatus,
          },
          inPlatform && {
            label: auctionStatus + t("pages_auctions_details_[id].ة"),
            noHref: true,
          },
        ]}
        currentText={auctionData?.title}
      />
      {/**provider details */}
      {auctionData?.provider._id && (
        <SectionHead
          title={t("pages_auctions_details_[id].معلومات_الشركة")}
          customStyle={{
            bgcolor: "#fff",
            borderRadius: "20px",
            padding: "16px 0px 16px 16px",
          }}
          childrenStyle={{
            bgcolor: constants.colors.light_grey,
            border: "1px solid #E1E1E2",
            borderRadius: { xs: "16px", md: "24px" },
            padding: { xs: "16px", md: " 20px" },
          }}
        >
          <Box
            sx={{
              ...styles.boxGrid,
              bgcolor: "inherit",
            }}
          >
            <LabelData
              label={t("pages_auctions_details_[id].اسم_الشركة")}
              value={auctionData?.provider.companyName}
              withImg
              img={auctionData?.provider?.companyProfileImage}
              customStyle={{ fontSize: "12px", px: 0 }}
              customImgStyle={{ width: "40px", height: "40px" }}
            />
            <LabelData
              label={t("pages_auctions_details_[id].الايميل")}
              value={auctionData?.provider?.companyEmail}
            />
            <LabelData
              label={t("pages_auctions_details_[id].الهاتف")}
              value={auctionData?.provider?.companyPhoneNumber?.number}
            />
            <LabelData
              label={t("pages_auctions_details_[id].رقم_رخصة_فال_للمزادات")}
              value={auctionData?.provider?.valAuctionsLicenseNumber}
            />
          </Box>
        </SectionHead>
      )}
      {/**auction details */}
      <SectionHead
        title={t("pages_auctions_details_[id].معلومات_المزاد")}
        customStyle={{
          bgcolor: "#fff",
          borderRadius: "20px",
          padding: "16px 0px 16px 16px",
        }}
        childrenStyle={{
          bgcolor: constants.colors.light_grey,
          border: "1px solid #E1E1E2",
          borderRadius: { xs: "16px", md: "24px" },
          padding: { xs: "16px", md: " 20px" },
        }}
        actions={
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
              mt: { xs: 1, md: 0 },
            }}
          >
            <AuctionType type={auctionData?.type} />

            {auctionData?.status == "pending" ? (
              <Typography sx={{ ...setStatusStyle(reviewStatus) }}>
                {reviewStatus}
              </Typography>
            ) : (
              <Typography sx={{ ...setLargeStatusStyle(auctionStatus) }}>
                {auctionStatus}
              </Typography>
            )}
            {hasRole("update auction") && (
              <>
                {inPlatform &&
                  auctionData?.status !== "completed" &&
                  auctionData?.status !== "canceled" && (
                    <>
                      {isAdmin && (
                        <CustomButton
                          customeStyle={{
                            // ...styles.deleteBtn,
                            color: "#B12424",
                            bgcolor: "rgba(211, 47, 47, 0.10);",
                            "&:hover": {
                              color: "#B12424",
                              bgcolor: "rgba(211, 47, 47, 0.10)",
                              boxShadow: "none",
                            },
                          }}
                          handleClick={() => handleOpen("cancel-auction")}
                          text={t("pages_auctions_details_[id].إيقاف_المزاد")}
                        />
                      )}
                    </>
                  )}

                {auctionData?.status == "pending" && (
                  <>
                    {hasRole("delete auction") && (
                      <>
                        <CustomButton
                          customeStyle={{
                            // ...styles.deleteBtn,
                            color: "#B12424",
                            bgcolor: "rgba(211, 47, 47, 0.10);",
                            "&:hover": {
                              color: "#B12424",
                              bgcolor: "rgba(211, 47, 47, 0.10)",
                              boxShadow: "none",
                            },
                          }}
                          handleClick={() => {
                            handleOpen("delete-auction");
                          }}
                          type="remove"
                          text={t("pages_auctions_details_[id].حذف_المزاد")}
                        />
                      </>
                    )}

                    <CustomButton
                      customeStyle={{
                        width: "100px",
                        background: "transparent",
                        color: "#6F6F6F",
                        fontWeight: 700,
                        border: "1px solid #D6D9E1",
                        "&:hover": {
                          background: "transparent",
                          color: "#6F6F6F",
                          boxShadow: "none",
                        },
                      }}
                      handleClick={() => {
                        handleEdit();
                      }}
                      text={t("pages_auctions_details_[id].تعديل")}
                      type="edit"
                      smallIcon
                    />
                  </>
                )}
                {inPlatform &&
                  auctionData?.status == "on_going" &&
                  hasRole("extend auction time") && (
                    <CustomButton
                      handleClick={handleAddExtraTime}
                      customeStyle={{
                        color: "#fff",
                        // p: { sm: "1.3rem", lg: "1.3rem 0.8rem" },
                        opacity: loadingExtraTime ? 0.7 : 1,
                        pointerEvents: loadingExtraTime ? "none" : "auto",
                      }}
                      text={
                        loadingExtraTime ? "جاري التمديد..." : "تمديد الوقت"
                      }
                      type="add"
                    />
                  )}
                {statueReviewFromApi == "approved" &&
                  auctionData?.status == "pending" &&
                  isAdmin && (
                    <CustomButton
                      handleClick={() => {
                        handleOpen("active-auction");
                      }}
                      customeStyle={{
                        color: "#fff",
                      }}
                      text={t("pages_auctions_details_[id].تفعيل_المزاد")}
                      type="broker"
                    />
                  )}
                {hasRole("review auction") && (
                  <>
                    {statueReviewFromApi == "need_to_review" && isAdmin && (
                      <>
                        <CustomButton
                          handleClick={() => {
                            handleApprove();
                          }}
                          customeStyle={{
                            color: "#fff",

                            // p: {
                            //   sm: "1.3rem",
                            //   lg: "1.3rem 0.8rem",
                            // },
                          }}
                          text={
                            auctionData?.createdByAdmin == false
                              ? t("pages_auctions_details_[id].قبول_الطلب")
                              : t("pages_auctions_details_[id].تنفيذ_المزاد")
                          }
                        />
                        <CustomButton
                          customeStyle={{
                            // width: "100px",
                            background: "#EB57571A",
                            border: "1px solid #D32F2F",
                            color: "#D32F2F",
                            fontWeight: 700,
                            "&:hover": {
                              background: "#EB57571A",
                              boxShadow: "none",
                            },
                          }}
                          handleClick={() => handleOpen("reject-auction")}
                          text={
                            auctionData?.createdByAdmin == false
                              ? t("pages_auctions_details_[id].رفض_الطلب")
                              : t("pages_auctions_details_[id].رفض_المزاد")
                          }
                        />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        }
      >
        <Box
          sx={{
            ...styles.boxGrid,
            bgcolor: "inherit",
          }}
        >
          <LabelData
            label={t("pages_auctions_details_[id].إسم_المزاد")}
            value={auctionData?.title}
            withImg
            img={auctionData?.cover}
            customStyle={{ fontSize: "12px", px: 0 }}
            customImgStyle={{ width: "40px", height: "40px" }}
          />
          <LabelData
            label={t("pages_auctions_details_[id].نوع_المزاد")}
            value={AuctionTypeFunction(auctionData?.type)}
          />
          <LabelData
            label={t("pages_auctions_details_[id].موقع_المزاد")}
            value={auctionData?.location.title}
          />
          <LabelData
            label={t("pages_auctions_details_[id].رقم_الموافقة_لإقامة_مزاد")}
            value={auctionData?.auctionApprovalNumber}
          />
        </Box>
        <Box
          sx={{
            ...styles.boxGrid,
          }}
        >
          <LabelData
            label={t("pages_auctions_details_[id].تاريخ_ووقت_بدأ_المزاد")}
            value={formatDate(auctionData?.startDate)}
          />{" "}
          <LabelData
            label={t("pages_auctions_details_[id].تاريخ_ووقت_إنتهاء_المزاد")}
            value={formatDate(auctionData?.endDate)}
          />
          <LabelData
            label={t("pages_auctions_details_[id].خاص_أو_تابع_لنفاذ")}
            value={
              auctionData?.specialToSupportAuthority == true
                ? t("pages_auctions_details_[id].نعم")
                : t("pages_auctions_details_[id].لا")
            }
          />
          {auctionData?.auctionBrochure && (
            <Box
              sx={
                {
                  // padding: "12px 24px",
                  // my: { sm: 1, md: 3 },
                  // borderLeft: {
                  //   sm: "1px solid #EBEEF3",
                  // },
                }
              }
            >
              <File
                href={auctionData?.auctionBrochure}
                type={getFileType(auctionData?.auctionBrochure)}
                title={t("pages_auctions_details_[id].برشور_المزاد")}
                underline
              />
            </Box>
          )}
        </Box>
      </SectionHead>

      {profile?.data?.type == "providers" && (
        <WalletAvailable maxOrigins={maxOrigins} />
      )}

      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: "2.5rem" }}
      >
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#202726",
            // mb: { xs: "16px", md: "24px" },
          }}
        >
          الأصول{" "}
          <span>
            {" "}
            (
            {auctionData?.auctionOrigins?.length > 0
              ? auctionData?.auctionOrigins?.length
              : "0"}
            )
          </span>
        </Typography>
        {auctionData?.status == "pending" &&
          !!maxOrigins &&
          hasRole("update auction") && (
            <CustomButton
              handleClick={() =>
                router.push(`/origins/create/${auctionData._id}`)
              }
              customeStyle={{
                bgcolor: constants.colors.light_green,
                "&:hover": {
                  color: "#fff",
                  bgcolor: constants.colors.light_green,
                  boxShadow: "none",
                },
              }}
              text={t("pages_auctions_details_[id].إنشاء_أصل")}
              // type="add"
            />
          )}
      </Box>
      {auctionData?.auctionOrigins?.length > 0 && hasRole("get auction") ? (
        auctionData?.auctionOrigins.map((origin, index) => (
          <Box
            key={index}
            sx={{
              ...styles.boxData,
              // mt: "2px",
              pr: 0,
            }}
          >
            <Box
              sx={{
                border: "1px solid #D6D9E1",
                padding: "8px",
                borderRadius: "12px",
                // boxShadow: "2px 0px 16px 0px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(215, 216, 219, 0.20)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  maxHeight: { lg: "96px" },
                  padding: "16px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    // borderLeft: { sm: "1px solid #EBEEF3" },
                    px: "16px",
                    py: { xs: "16px", sm: "0" },
                    width: { xs: "100%", sm: "80%" },
                    flexWrap: { xs: "nowrap" },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 700,
                      color: "#1A1A1A",
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#333",
                    }}
                  >
                    {origin.title}
                  </Typography>
                </Box>
                <Grid
                  container
                  sx={{ alignItems: "center" }}
                  // spacing={{ xs: 1, md: 3 }}
                  // sx={{ width: { md: "70% !important" } }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={inPlatform ? 5 : 6}
                    lg={inPlatform ? 5 : 6}
                  >
                    <LabelData
                      label={t("pages_auctions_details_[id].السعر_الافتتاحي")}
                      value={
                        <Box Box sx={{ display: "flex", alignItems: "center" }}>
                          {formatNumber(origin?.openingPrice)}
                          <SAR img="/images/icons/SAR.svg" />
                        </Box>
                      }
                      withImg
                      img="/images/icons/opening-price.svg"
                      customImgStyle={{ width: "32px", heigth: "32px" }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={inPlatform ? 5 : 6}
                    lg={inPlatform ? 5 : 6}
                  >
                    <LabelData
                      label={t("pages_auctions_details_[id].عربون_الدخول")}
                      value={
                        <Box Box sx={{ display: "flex", alignItems: "center" }}>
                          {formatNumber(origin?.entryDeposit)}
                          <SAR img="/images/icons/SAR.svg" />
                        </Box>
                      }
                      withImg
                      img="/images/icons/enter-price.svg"
                      customImgStyle={{ width: "32px", heigth: "32px" }}
                    />
                  </Grid>

                  {inPlatform &&
                    origin?.awardStatus == "pending" &&
                    isAdmin && (
                      <Grid item md={1}>
                        <EnrolledCount
                          status={auctionData?.status}
                          count={origin?.enrolledCount}
                        />
                      </Grid>
                    )}
                  {inPlatform &&
                    origin?.awardStatus != "pending" &&
                    isAdmin && (
                      <Grid item md={2}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // gap: "12px",
                            // padding: "0px 16px 0px 16px",
                            my: "0px",

                            height: "100%",
                          }}
                        >
                          <Typography
                            sx={{
                              ...setStatusStyle(
                                origin?.awardStatus == "canceled"
                                  ? "مرفوض"
                                  : "مقبولة"
                              ),
                              width: "100%",
                              // display: "flex",
                              // justifyContent: "center",
                              // alignItems: "center",
                              // gap: "12px",
                              padding: "10px 5px ",
                            }}
                          >
                            {origin?.awardStatus == "canceled"
                              ? " الغيت الترسية "
                              : "تم الترسية"}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: "16px",
                    pt: { xs: "16px", sm: "0" },
                    // width: { xs: "100%", sm: "30%" },
                    flexWrap: { xs: "nowrap" },
                  }}
                >
                  <Typography
                    onClick={() =>
                      inPlatform
                        ? router.push(
                            `/origins/enrollments?auctionId=${auctionData?._id}&originId=${origin?._id}`
                          )
                        : handleOriginssDetails(origin?._id)
                    }
                    sx={{
                      borderRadius: "12px",
                      border: "1px solid #7A7B7A",
                      padding: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#7A7B7A",
                      cursor: "pointer",
                    }}
                  >
                    {t("pages_auctions_details_[id].التفاصيل")}
                  </Typography>
                  {/* <Box sx={{ cursor: "pointer" }}>
                    <img
                      onClick={() =>
                        inPlatform
                          ? router.push(
                              `/origins/enrollments?auctionId=${auctionData?._id}&originId=${origin?._id}`
                            )
                          : handleOriginssDetails(origin?._id)
                      }
                      src="/images/icons/edit-table.svg"
                      width="32px"
                      height="32px"
                    />
                  </Box> */}
                  {auctionData?.status == "pending" && (
                    <Box sx={{ cursor: "pointer" }}>
                      <img
                        onClick={() => handleOpen("delete-origin", origin?._id)}
                        src="/images/icons/trash.svg"
                        width="32px"
                        height="32px"
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            bgcolor: "#fff",
            borderRadius: "12px",
            padding: "16px",
            alignContent: "center",
          }}
        >
          <Box
            sx={{
              padding: "3rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box>
              {" "}
              <img src="/images/icons/origin.svg" />
            </Box>
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#202726",
                mt: 1,
              }}
            >
              لا يوجد أصول{" "}
            </Typography>
          </Box>
        </Box>
      )}
      <CustomSnackbar
        type={alert.type}
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alert.msg}
      />
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
              xl: type == "active-auction" ? " 45%" : "30%",
            },
          }}
        >
          {showBackDropContent()}
        </Box>
      </Backdrop>
    </>
  );
}
