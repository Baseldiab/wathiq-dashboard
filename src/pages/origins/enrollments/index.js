import { useTranslation } from "next-i18next";
import AuctionType from "@/components/auctions-tabs/auction-type";
import EnrollmentTable from "@/components/auctions-tabs/enrollment-table";
import { styles } from "@/components/globalStyle";
import BreadcrumbsNav from "@/components/layout/navbar/bread-crumb-nav";
import Loader from "@/components/loader";
import TabItem from "@/components/tab-item";
import { getAuction } from "@/Redux/slices/auctionsSlice";
import { getOrigin, stopWorkAuction } from "@/Redux/slices/originsSlice";
import {
  AuctionTypeFunction,
  convertIso8601ToDate,
  determineAuctionStatuses,
  formatDate,
  formatNumber,
  getMainTabValue,
  hasRole,
  setLargeStatusStyle,
  setStatusStyle,
} from "@/services/utils";
import { io } from "socket.io-client";
import { Backdrop, Box, Container, Grid, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import constants from "@/services/constants";
import UserBidding from "@/components/auctions-tabs/bidding-board/user-bidding";
import BiddingDetail from "@/components/auctions-tabs/bidding-board/bidding-detail";
import { awardAuction, getBiddingBoard } from "@/Redux/slices/enrollmentSlice";
import NoData from "@/components/no-data";
import { useSocketListener } from "@/services/socketHook";
import CustomButton from "@/components/button";
import CustomSnackbar from "@/components/toastMsg";
import ConfirmAction from "@/components/popup-actions/confirm-action";
import DetailBox from "@/components/details-box";
import TotalCard from "@/components/total-card";
import LabelData from "@/components/corporate/main-info/label-data";
import SAR from "@/components/sar";
import { motion, AnimatePresence } from "framer-motion";
import PopupTitle from "@/components/popup-title";

export default function Enrollment() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { auctionId, originId } = router.query;
  const { auction } = useSelector((state) => state.auctions);
  const { origin, loadingOrigin, loadingStopWorkAuction } = useSelector(
    (state) => state.origins
  );
  const auctionData = auction?.data;
  const { reviewStatus, auctionStatus } = determineAuctionStatuses(auctionData);
  const selectedOrigin = origin?.data?.auctionOrigins?.find(
    (item) => item._id === originId
  );
  console.log("selectedOrigin", selectedOrigin);
  const { biddingBoard, loadingBiddingBoard, errorBiddingBoard } = useSelector(
    (state) => state.enrollment
  );
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(false);
  const [selectedBid, setSelectedBid] = useState({});
  const awardedUser = biddingBoard?.data.find(
    (item) => item?.user._id === biddingBoard?.awardUser?._id
  );

  const getDescriptionForArea = (selectedOrigin) => {
    const boundaries = selectedOrigin?.details.find(
      (item) =>
        item.title === t("pages_origins_enrollments_index.الحدود_والمساحة")
    );

    if (boundaries) {
      const area = boundaries.auctionDetails.find(
        (detail) =>
          detail.title === t("pages_origins_enrollments_index.المساحة")
      );

      if (area) {
        return +area.description;
      }
    }
    return 0;
  };

  const area = getDescriptionForArea(selectedOrigin);
  console.log("areaDescription", area);
  // console.log("biddingBoard", biddingBoard);
  const [selectedItem, setSelectedItem] = useState(1);
  const tabValue = getMainTabValue(
    auctionData?.auctionReviewStatus?.status,
    auctionData?.status,
    auctionData?.createdByAdmin
  );

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL, {
    withCredentials: true,
    transports: ["websocket"],
  });
  // console.log("biddingBoard", biddingBoard);
  const tabItems =
    auctionData?.type == "hybrid"
      ? [
          { text: t("pages_origins_enrollments_index.الكتروني"), id: 1 },
          { text: t("pages_origins_enrollments_index.حضوري"), id: 2 },
          { text: t("pages_origins_enrollments_index.المغادرين"), id: 3 },
          { text: t("pages_origins_enrollments_index.المستبعدين"), id: 4 },
        ]
      : [
          { text: t("pages_origins_enrollments_index.المشتركين"), id: 1 },
          { text: t("pages_origins_enrollments_index.المغادرين"), id: 2 },
          { text: t("pages_origins_enrollments_index.المستبعدين"), id: 3 },
        ];

  const { response: socketBoardData, error: socketBoardDataError } =
    useSocketListener(`new_bid_bidding_board-${originId}`);

  const dataBoard =
    socketBoardData?.data?.length > 0
      ? socketBoardData.data
      : biddingBoard?.data || [];

  const handleOpen = (popupType, bid) => {
    setType(popupType);
    setOpen(true);
    setSelectedBid(bid);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const showBackDropContent = () => {
    switch (type) {
      case "cancaled-award":
        return (
          <ConfirmAction
            title={t("pages_origins_enrollments_index.عدم_ترسية_المزاد")}
            desc="سيتم إنهاء المزاد سيعتبر المزاد منتهي مع قرار عدم الترسية. واعادة
              كل مبالغ العرابين المدفوعة للمشتركين؟"
            handleClose={handleClose}
            handleClick={() => handleAward("canceled")}
            btnTxt={t("pages_origins_enrollments_index.عدم_ترسية_المزاد")}
            danger
          />
        );

      case "confirm-award":
        return (
          <Box
            sx={{
              ...styles.popupContainer,
              bgcolor: "#FAFAFA",
              alignItems: "space-between",
              gap: 0,
            }}
          >
            {/* <Box
              component="img"
              src="/images/auction-green.svg"
              sx={{
                width: "100%",
                height: "70px",
                alignItems: "center",
                textAlign: "center",
                display: "inline",
              }}
            ></Box> */}
            <PopupTitle
              title={t("pages_origins_enrollments_index.تأكيد_ترسية_المزاد")}
              handleClose={handleClose}
            />

            <Typography
              sx={{
                backgroundColor: "#fff",
                width: " 100%",
                padding: "16px 12px",
                borderRadius: "12px",
                border: "1px solid #D6D9E1",
                my: { xs: 1, md: 2 },
              }}
            >
              {selectedOrigin?.title}
            </Typography>
            <UserBidding
              index={0}
              key={selectedBid._id}
              participantNumber={selectedBid?.participantNumber}
              name={selectedBid?.user?.name}
              amount={formatNumber(selectedBid?.bidAmount)}
              // duration={formatDate(selectedBid?.bidAt)}
            />
            <Box
              sx={{
                border: "1px solid #D6D9E1",
                padding: "12px",
                borderRadius: "12px",
                boxShadow: "2px 0px 16px 0px rgba(0, 0, 0, 0.05)",
                display: "flex",
                my: { xs: 1, md: 2 },
                // flexDirection: { xs: "column", sm: "row" },
                // maxHeight: { lg: "96px" },
              }}
            >
              <Grid container spacing={{ xs: 1, md: 3 }}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  {auctionData?.provider._id ? (
                    <DetailBox
                      title={t("pages_origins_enrollments_index.اسم_الشركة")}
                      value={auctionData?.provider.companyName}
                      withImg
                      img={auctionData?.provider?.companyProfileImage}
                      customStyle={{ fontSize: "12px", px: 0 }}
                      customImgStyle={{ width: "40px", height: "40px" }}
                      noSpacing
                    />
                  ) : (
                    <DetailBox
                      title={t("pages_origins_enrollments_index.اسم_المزاد")}
                      value={auctionData?.title}
                      noSpacing
                      customStyle={{ fontSize: "12px", px: 0 }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DetailBox
                    title={t("pages_origins_enrollments_index.نوع_المزاد")}
                    value={AuctionTypeFunction(auctionData?.type)}
                    noSpacing
                    customStyle={{ fontSize: "12px", px: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DetailBox
                    title={t("pages_origins_enrollments_index.موقع_المزاد")}
                    value={auctionData?.location.title}
                    noSpacing
                    customStyle={{ fontSize: "12px", px: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DetailBox
                    title={t(
                      "pages_origins_enrollments_index.رقم_الموافقة_لإقامة_مزاد"
                    )}
                    value={auctionData?.auctionApprovalNumber}
                    noBorder
                    noSpacing
                    customStyle={{ fontSize: "12px", px: 0 }}
                  />
                </Grid>
              </Grid>
            </Box>
            <BiddingDetail
              title={t("pages_origins_enrollments_index.الاجمالي_الفرعي")}
              price={formatNumber(total)}
              customStyle={{
                color: constants.colors.dark_green,
                fontSize: "1rem",
                // mb: 1,
              }}
            />
            <BiddingDetail
              title={t("pages_origins_enrollments_index.عربون_الدخول")}
              price={formatNumber(-selectedOrigin?.entryDeposit)}
              customStyle={{ color: "#D32F2F", fontSize: "1rem" }}
            />
            <BiddingDetail
              title={t("pages_origins_enrollments_index.الاجمالي")}
              price={formatNumber(total - selectedOrigin?.entryDeposit)}
              customStyle={{ color: constants.colors.main, fontSize: "2rem" }}
              noBorder
            />

            <Box
              sx={{
                display: "flex",
                mt: 2,
                justifyContent: "space-between",
                gap: "24px",
                width: "100%",
              }}
            >
              <CustomButton
                customeStyle={{
                  width: "100%",
                }}
                handleClick={() =>
                  handleAward("awarded", selectedBid?.user?._id)
                }
                text={t("pages_origins_enrollments_index.ترسية_المزاد")}
              />
            </Box>
          </Box>
        );

      default:
        break;
    }
  };
  const completed = auctionData?.status == "completed";
  // useEffect(() => {
  //   if (socketResponse) {
  //     dispatch(
  //       getBiddingBoard({
  //         auctionId: auctionData._id,
  //         originId: originId,
  //       })
  //     );
  //   }
  // }, [socketResponse]);
  useEffect(() => {
    if (auctionId && !auction?.data?._id) {
      dispatch(getAuction(auctionId));
    }
  }, [auctionId]);

  useEffect(() => {
    if (originId && origin?.data?._id !== originId) {
      dispatch(getOrigin(originId));
    }
  }, [originId]);

  useEffect(() => {
    if (auctionData?.status != "in_progress" && originId) {
      // console.log("in if");
      dispatch(
        getBiddingBoard({
          auctionId: auctionData._id,
          originId: originId,
        })
      );
    }
  }, [originId]);

  const handleAward = async (awardStatue, userId = null) => {
    try {
      await dispatch(
        awardAuction({
          data: {
            ...(userId ? { user: userId } : {}),
            status: awardStatue,
          },
          auctionId: auctionId,
          originId: originId,
        })
      ).unwrap();
      await dispatch(getOrigin(originId));
      await dispatch(getAuction(auctionId));

      await dispatch(
        getBiddingBoard({
          auctionId: auctionData._id,
          originId: originId,
        })
      );
      // router.push(
      //   `/origins/enrollments?auctionId=${auctionId}&originId=${originId}`
      // );
      setAlert({
        msg:
          awardStatue == "canceled"
            ? t("pages_origins_enrollments_index.تم_الغاء_الترسية")
            : t("pages_origins_enrollments_index.تم_تأكيد_الترسية"),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
    }
  };
  if (loadingOrigin || loadingStopWorkAuction) return <Loader open={true} />;

  const handleItemChange = (id) => {
    setSelectedItem(id);
  };
  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return (
          <EnrollmentTable
            originId={originId}
            auctionId={auctionId}
            nin={
              auctionData?.type == "hybrid"
                ? ["rejected", "canceled"]
                : ["rejected", "canceled"]
            }
            {...(auctionData?.type === "hybrid" && {
              enrollmentType: "online",
            })}
            auctionStatus={auctionData?.status}
          />
        );
      case 2:
        return auctionData?.type == "hybrid" ? (
          <EnrollmentTable
            originId={originId}
            auctionId={auctionId}
            nin={["rejected", "canceled"]}
            enrollmentType="offline"
            auctionStatus={auctionData?.status}
          />
        ) : (
          <EnrollmentTable
            originId={originId}
            auctionId={auctionId}
            status="canceled"
            auctionStatus={auctionData?.status}
          />
        );
      case 3:
        return auctionData?.type == "hybrid" ? (
          <EnrollmentTable
            originId={originId}
            auctionId={auctionId}
            status="canceled"
            auctionStatus={auctionData?.status}
          />
        ) : (
          <EnrollmentTable
            originId={originId}
            auctionId={auctionId}
            status="rejected"
            auctionStatus={auctionData?.status}
          />
        );
      case 4:
        return (
          auctionData?.type == "hybrid" && (
            <EnrollmentTable
              originId={originId}
              auctionId={auctionId}
              status="rejected"
            />
          )
        );

      default:
        break;
    }
  };
  const biggestBidding =
    biddingBoard?.data?.length > 0
      ? biddingBoard?.data[0].bidAmount
      : selectedOrigin?.openingPrice;
  const total =
    biggestBidding +
    biggestBidding * 0.05 + //
    biggestBidding * 0.025 + //السعي
    biggestBidding * 0.025 * 0.25; //ضريبة السعي
  const handleToggleWorkAuction = async () => {
    try {
      await dispatch(
        stopWorkAuction({ auctionId: auctionData?._id, originId: originId })
      ).unwrap();
      await dispatch(getOrigin(originId));
      setAlert({
        type: "success",
        msg:
          selectedOrigin?.stopped === false
            ? "تم تعليق المزايدات بنجاح"
            : "تم استئناف المزايدات بنجاح",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({
        type: "error",
        msg: error || "حدث خطأ أثناء تعديل المزاد",
      });
      setAlertOpen(true);
      handleClose();
    }
  };
  return (
    <>
      {" "}
      <Head>
        <title> تفاصيل المسجلين في {selectedOrigin?.title}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <BreadcrumbsNav
        title={t("pages_origins_enrollments_index.إدارة_المزادات")}
        links={[
          {
            href: "/auctions",
            label: t("pages_origins_enrollments_index.إدارة_المزادات"),
          },
          {
            href: `/auctions?mainTab=${tabValue}`,
            label: reviewStatus,
          },
          {
            label: auctionStatus + t("pages_origins_enrollments_index.ة"),
            noHref: true,
          },
          {
            href: `/auctions/details/${auctionId}`,
            label: "مزاد " + auctionData?.title,
          },
        ]}
        currentText={selectedOrigin?.title}
      />
      {auctionData?.status == "on_going" && hasRole("manage auction award") && (
        <>
          <Box sx={{ pt: 5, display: "flex", justifyContent: "end" }}>
            <CustomButton
              handleClick={handleToggleWorkAuction}
              customeStyle={
                selectedOrigin?.stopped === false
                  ? {
                      // width: "100px",
                      background: "#EB57571A",
                      border: "1px solid #D32F2F",
                      color: "#D32F2F",
                      fontWeight: 700,
                      "&:hover": {
                        background: "#EB57571A",
                        boxShadow: "none",
                      },
                    }
                  : {}
              }
              // disabled={biddingBoard[0]?.auctionEnrollment == item?._id}
              text={
                selectedOrigin?.stopped === false
                  ? "تعليق المزايدات"
                  : "إستئناف المزايدات"
              }
            />
          </Box>
        </>
      )}
      {completed &&
        hasRole("manage auction award") &&
        selectedOrigin?.awardStatus == "pending" && (
          <Box sx={{ pt: 5, display: "flex", justifyContent: "end" }}>
            <CustomButton
              handleClick={() => {
                handleOpen("cancaled-award");
              }}
              customeStyle={{
                // color: "#fff",
                // height: "36px",
                background: "#D32F2F",
                color: "#fff",
                fontWeight: 700,
                border: "1px solid #D6D9E1",
                "&:hover": {
                  background: "#D32F2F",
                  color: "#fff",
                  boxShadow: "none",
                },
              }}
              // disabled={biddingBoard[0]?.auctionEnrollment == item?._id}
              text={t("pages_origins_enrollments_index.عدم_ترسية_المزاد")}
            />
          </Box>
        )}
      {completed && selectedOrigin?.awardStatus == "canceled" && (
        <Box sx={{ pt: 5, display: "flex", justifyContent: "end" }}>
          <Typography
            sx={{
              ...setLargeStatusStyle("cancaled"),
            }}
          >
            لم يتم ترسية المزاد{" "}
          </Typography>
        </Box>
      )}
      {completed && selectedOrigin?.awardStatus == "awarded" && (
        <>
          <Box sx={{ pt: 5, display: "flex", justifyContent: "end" }}>
            <Typography
              sx={{
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "1.1.25rem",
                color: "#09BB72",
                bgcolor: "rgba(9, 187, 114, 0.1)",
                padding: "16px 30px",
              }}
            >
              تم ترسية المزاد{" "}
            </Typography>
          </Box>
        </>
      )}
      <Box
        sx={{
          ...styles.boxData,
          minHeight: "350px",
          mt: 5,
        }}
      >
        {selectedOrigin?.awardStatus == "awarded" && (
          <>
            {biddingBoard?.awardUser != null && awardedUser && (
              <UserBidding
                key={awardedUser._id || index}
                participantNumber={""}
                name={awardedUser?.user?.name}
                amount={formatNumber(awardedUser?.bidAmount)}
                duration={formatDate(awardedUser?.bidAt)}
                index={0}
                completed={completed}
                awardStatue={selectedOrigin?.awardStatus}
                flag
              />
            )}
            <Box
              sx={{
                border: "1px solid #D6D9E1",
                padding: "12px",
                borderRadius: "12px",
                boxShadow: "2px 0px 16px 0px rgba(0, 0, 0, 0.05)",
                display: "flex",
                my: { xs: 1, md: 2 },
                bgcolor: "transparent",
              }}
            >
              <Grid container spacing={{ xs: 1, md: 3 }}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  {auctionData?.provider._id ? (
                    <DetailBox
                      title={t("pages_origins_enrollments_index.اسم_الشركة")}
                      value={auctionData?.provider.companyName}
                      withImg
                      img={auctionData?.provider?.companyProfileImage}
                      customStyle={{ fontSize: "12px", px: 0 }}
                      customImgStyle={{ width: "40px", height: "40px" }}
                      noSpacing
                    />
                  ) : (
                    <DetailBox
                      title={t("pages_origins_enrollments_index.اسم_المزاد")}
                      value={auctionData?.title}
                      noSpacing
                      customStyle={{ fontSize: "12px", px: 0 }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DetailBox
                    title={t("pages_origins_enrollments_index.نوع_المزاد")}
                    value={AuctionTypeFunction(auctionData?.type)}
                    noSpacing
                    customStyle={{ fontSize: "12px", px: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DetailBox
                    title={t("pages_origins_enrollments_index.موقع_المزاد")}
                    value={auctionData?.location.title}
                    noSpacing
                    customStyle={{ fontSize: "12px", px: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DetailBox
                    title={t(
                      "pages_origins_enrollments_index.رقم_الموافقة_لإقامة_مزاد"
                    )}
                    value={auctionData?.auctionApprovalNumber}
                    noBorder
                    noSpacing
                    customStyle={{ fontSize: "12px", px: 0 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        )}
        {(auctionData?.status == "on_going" ||
          auctionData?.status == "completed") && (
          <>
            {" "}
            <Grid
              container
              flexDirection={completed ? "column-reverse" : "row"}
              // gap={2}
              spacing={5}
            >
              <Grid item xs={12} md={completed ? 12 : 6}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{ color: constants.colors.main, fontSize: "1.1rem" }}
                  >
                    {t("pages_origins_enrollments_index.المزايدات")}
                  </Typography>
                  <img
                    src={"/images/icons/pdf2.svg"}
                    style={{ width: "30px" }}
                  />
                </Box>
                <Box
                  sx={{
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    // bgcolor: "#FAFAFA",
                    padding: "16px 0px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <AnimatePresence>
                      {dataBoard.length > 0 ? (
                        dataBoard.map((bid, index) => (
                          <motion.div
                            key={bid._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                          >
                            <UserBidding
                              participantNumber={bid?.participantNumber}
                              name={bid?.user?.name}
                              amount={formatNumber(bid?.bidAmount)}
                              duration={formatDate(bid?.bidAt)}
                              index={index}
                              userId={bid?.user?._id}
                              completed={completed}
                              awardStatue={selectedOrigin?.awardStatus}
                              handleClick={() =>
                                handleOpen("confirm-award", bid)
                              }
                              awardedUser={awardedUser?.user?._id}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <NoData
                          style={{ width: "80px", height: "80px" }}
                          img="/images/icons/auction.svg"
                          desc={t(
                            "pages_origins_enrollments_index.لا_يوجد_مزايدين_حتي"
                          )}
                        />
                      )}
                    </AnimatePresence>
                  </Box>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={completed ? 12 : 6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // gap: "15px",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#F5FFFC",
                    display: "flex",
                    gap: "10px",
                    p: "12px",
                    borderRadius: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: "15px",
                  }}
                >
                  <img src="/images/icons/up.svg" />
                  <Typography sx={{ color: "#2E353F", fontSize: "1rem" }}>
                    {t("pages_origins_enrollments_index.اعلي_مزايدة")}
                  </Typography>
                  <Box
                    sx={{
                      color: constants.colors.dark_green,
                      fontSize: "2rem",
                      fontWeight: "700",
                    }}
                  >
                    {" "}
                    {formatNumber(biggestBidding)}{" "}
                    <SAR img="/images/icons/SAR.svg" />
                  </Box>
                </Box>
                {!completed && (
                  <>
                    <Grid
                      container
                      sx={{ alignItems: "center", mb: "15px" }}
                      spacing={{ xs: 1, md: 3 }}

                      // sx={{ width: { md: "70% !important" } }}
                    >
                      <Grid item xs={12} sm={6} lg={6}>
                        <Box
                          sx={{
                            bgcolor: constants.colors.light_grey,
                            padding: "12px 24px 12px 24px",
                            borderRadius: "10px",
                          }}
                        >
                          <LabelData
                            label={t(
                              "pages_origins_enrollments_index.السعر_الافتتاحي"
                            )}
                            value={
                              <Box
                                Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {formatNumber(selectedOrigin?.openingPrice)}
                                <SAR img="/images/icons/SAR.svg" />
                              </Box>
                            }
                            withImg
                            img="/images/icons/opening-price.svg"
                            customImgStyle={{ width: "32px", heigth: "32px" }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={6}>
                        <Box
                          sx={{
                            bgcolor: constants.colors.light_grey,
                            padding: "12px 24px 12px 24px",
                            borderRadius: "10px",
                          }}
                        >
                          <LabelData
                            label={t(
                              "pages_origins_enrollments_index.عربون_الدخول"
                            )}
                            value={
                              <Box
                                Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {formatNumber(selectedOrigin?.entryDeposit)}
                                <SAR img="/images/icons/SAR.svg" />
                              </Box>
                            }
                            withImg
                            img="/images/icons/enter-price.svg"
                            customImgStyle={{ width: "32px", heigth: "32px" }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <TotalCard
                      title={t("pages_origins_enrollments_index.فرق_السوم")}
                      data={selectedOrigin?.garlicDifference}
                      customStyle={{
                        borderRadius: "10px",
                        background: "#FAFAFA",
                        border: "none",
                        mb: "15px",
                      }}
                      amount
                    />
                  </>
                )}

                <BiddingDetail
                  title={t("pages_origins_enrollments_index.سعر_المتر")}
                  price={
                    area == 0
                      ? t("pages_origins_enrollments_index.ــ")
                      : biggestBidding / area
                  }
                  img="/images/icons/area.svg"
                  // equation={0.05}
                />
                <BiddingDetail
                  title={t("pages_origins_enrollments_index.ضريبة_العقار")}
                  price={biggestBidding}
                  equation={0.05}
                  img="/images/icons/vat-real-estate.svg"
                />
                {/* garlicDifference */}
                <BiddingDetail
                  title={t("pages_origins_enrollments_index.مبلغ_السعي")}
                  price={biggestBidding}
                  equation={0.025}
                  img="/images/icons/amount-SAR.svg"
                />
                <BiddingDetail
                  title={t("pages_origins_enrollments_index.ضريبة_السعي")}
                  price={biggestBidding}
                  equation={0.025 * 0.25}
                  img="/images/icons/vat-SAR.svg"
                />
                {completed && (
                  <>
                    <BiddingDetail
                      title={t(
                        "pages_origins_enrollments_index.الاجمالي_الفرعي"
                      )}
                      price={formatNumber(total)}
                      customStyle={{
                        color: constants.colors.dark_green,
                        fontSize: "1.2rem",
                      }}
                    />
                    <BiddingDetail
                      title={t("pages_origins_enrollments_index.عربون_الدخول")}
                      price={formatNumber(-selectedOrigin?.entryDeposit)}
                      customStyle={{ color: "#D32F2F" }}
                    />
                  </>
                )}
                <BiddingDetail
                  title={t("pages_origins_enrollments_index.الاجمالي")}
                  price={formatNumber(
                    completed ? total - selectedOrigin?.entryDeposit : total
                  )}
                  customStyle={{
                    color: completed ? constants.colors.main : "#202726",
                    fontSize: completed ? "2rem" : "1.5rem",
                  }}
                  noBorder
                />
              </Grid>
            </Grid>
          </>
        )}
        {hasRole("manage auction enrollments") && (
          <>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                flexWrap: "wrap",
                gap: { xs: 1, md: 2 },
              }}
            >
              <Box
                sx={{
                  border: "1px solid #D6D9E1",
                  display: "flex",
                  justifyContent: "start",
                  width: "fit-content",
                  gap: "8px",
                  borderRadius: "12px",
                  padding: "8px",
                  fontWeight: 700,
                }}
              >
                {tabItems.map((item) => (
                  <TabItem
                    item={item}
                    selectedItem={selectedItem}
                    handleItemChange={handleItemChange}
                  />
                ))}
              </Box>

              {auctionData?.status == "pending" ? (
                <Typography sx={{ ...setStatusStyle(reviewStatus) }}>
                  {reviewStatus}
                </Typography>
              ) : (
                <Typography
                  sx={{ ...setLargeStatusStyle(auctionStatus), mr: 3 }}
                >
                  {auctionStatus}
                </Typography>
              )}
              <AuctionType type={auctionData?.type} />
            </Box>
            <Box>{showBoxContent()}</Box>
          </>
        )}
      </Box>
      {hasRole("get auction") && (
        <Box
          sx={{
            ...styles.boxData,
            // minHeight: "350px",
            mt: 5,
            justifyContent: "space-between",
            flexDirection: "row",
            cursor: "pointer",
          }}
          onClick={() => router.push(`/origins/details/${originId}`)}
        >
          <Typography>
            {t("pages_origins_enrollments_index.تفاصيل_الأصل")}
          </Typography>
          <KeyboardArrowLeftRoundedIcon />
        </Box>
      )}
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
              lg: type == "cancaled-award" ? " 45%" : "60%",
            },
          }}
        >
          {showBackDropContent()}
        </Box>
      </Backdrop>
      <CustomSnackbar
        message={alert.msg}
        open={alertOpen}
        setOpen={setAlertOpen}
        type={alert.type}
      />
    </>
  );
}
