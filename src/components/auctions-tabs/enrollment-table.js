import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addUserBid,
  getAllEnrollments,
  getBiddingBoard,
  updateEnrollmentStatus,
} from "@/Redux/slices/enrollmentSlice";
import {
  Backdrop,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import NoData from "../no-data";
import {
  buildQueryParams,
  formatDate,
  formatNumber,
  setStatusStyle,
} from "@/services/utils";
import Loader from "../loader";
import CustomButton from "../button";
import CustomSnackbar from "../toastMsg";
import RequestReject from "../corporate/contract-requests/popup/request-reject";
import { emitEvent, socket } from "@/services/socketEmitter";
import { styles } from "../globalStyle";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import ConfirmAction from "../popup-actions/confirm-action";
import constants from "@/services/constants";
import PopupTitle from "../popup-title";
import { useSocketListener } from "@/services/socketHook";
import SAR from "../sar";
import { t } from "i18next";
function mapParamsToStatusKey(queryString = "") {
  const { t } = useTranslation();
  const qs = new URLSearchParams(queryString);

  // If "type" is present, store under "online" or "offline"
  const typeParam = qs.get("type");
  if (typeParam === "online") {
    return "online";
  }
  if (typeParam === "offline") {
    return "offline";
  }

  // If we get here, there was no "type" param – use your original logic:
  const ninArray = [];
  for (let i = 0; ; i++) {
    const value = qs.get(`nin[${i}]`);
    if (!value) break;
    ninArray.push(value);
  }

  // Check if nin includes "canceled" AND "rejected"
  const hasCanceled = ninArray.includes("canceled");
  const hasRejected = ninArray.includes("rejected");
  if (hasCanceled && hasRejected) {
    return "subscribed";
  }

  // If not nin => see if status=canceled or status=rejected
  const status = qs.get("status");
  if (status === "canceled") {
    return "departure";
  }
  if (status === "rejected") {
    return "excluded";
  }

  // Default
  return "subscribed";
}

export default function EnrollmentTable({
  originId,
  auctionId,
  status,
  nin,
  enrollmentType,
  auctionStatus,
}) {
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [errorReject, setErrorReject] = useState("");
  const [counts, setCounts] = useState({});

  const getCountForItem = (itemId) => {
    return counts[itemId] ?? 1;
  };

  // Increment for a specific item
  const incrementCount = (itemId) => {
    setCounts((prev) => {
      const oldValue = prev[itemId] ?? 1;
      return { ...prev, [itemId]: oldValue + 1 };
    });
  };
  // Decrement for a specific item (min value = 1)
  const decrementCount = (itemId) => {
    setCounts((prev) => {
      const oldValue = prev[itemId] ?? 1;
      if (oldValue <= 1) return prev; // don't go below 1
      return { ...prev, [itemId]: oldValue - 1 };
    });
  };
  const { origin } = useSelector((state) => state.origins);
  const selectedOrigin = origin?.data?.auctionOrigins?.find(
    (item) => item._id === originId
  );
  const { biddingBoard, loadingBiddingBoard, errorBiddingBoard } = useSelector(
    (state) => state.enrollment
  );
  const { response: socketBoardData, error: socketBoardDataError } =
    useSocketListener(`new_bid_bidding_board-${originId}`);

  const dataBoard =
    socketBoardData?.data.length > 0
      ? socketBoardData?.data
      : biddingBoard?.data || [];
  console.log("**********dataBoard********", dataBoard);
  console.log("**********socketBoardData********", socketBoardData);
  // console.log("selectedOrigin", selectedOrigin);
  // console.log("originnnnn", origin);
  // let newBidValue =
  //   count * selectedOrigin?.garlicDifference +
  //   (biddingBoard?.[0]?.bidAmount || 0);
  const openingPrice = selectedOrigin?.openingPrice;
  const biggestBidding =
    dataBoard?.length > 0 ? dataBoard[0].bidAmount : openingPrice;
  let noDataDesc = "";
  let noDataImg = "";
  if (status == "canceled") {
    noDataDesc = t(
      "components_auctions-tabs_enrollment-table.لا_يوجد_مستخدمين_غادرو"
    );
    noDataImg = "/images/icons/user-no-active.svg";
  } else if (status == "rejected") {
    noDataDesc = t(
      "components_auctions-tabs_enrollment-table.لا_يوجد_مستخدمين_مستبعدين"
    );
    noDataImg = "/images/icons/user-no-active.svg";
  } else {
    noDataDesc = t(
      "components_auctions-tabs_enrollment-table.لا_يوجد_مشتركين_حتي"
    );
    noDataImg = "/images/icons/group.svg";
  }
  const dispatch = useDispatch();

  const queryObj = { originId, auctionId };
  if (status) {
    queryObj.status = status;
  }
  if (enrollmentType) {
    queryObj.type = enrollmentType;
  }
  if (nin && nin.length) {
    nin.forEach((value, index) => {
      queryObj[`nin[${index}]`] = value;
    });
  }
  // console.log("selectedEnrollment", selectedEnrollment);
  const params = buildQueryParams(queryObj);
  // Example: originId=XX&auctionId=YY&nin[0]=rejected&nin[1]=canceled

  // Determine sub-state key based on the final query string
  const statusKey = mapParamsToStatusKey(params);

  const enrollmentData = useSelector((state) => state.enrollment[statusKey]);
  const data = enrollmentData?.data || [];
  const loading = enrollmentData?.loading || false;
  const error = enrollmentData?.error || null;
  useEffect(() => {
    if (originId && auctionId) dispatch(getAllEnrollments(params));
  }, [params]);

  const handleOpen = (popupType, auction) => {
    setType(popupType);
    setSelectedEnrollment(auction);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setErrorReject("");
    setRejectReason("");
  };
  if (loading) {
    return <Loader open={true} />;
  }
  const renderActionButton = (item) => {
    const status = item?.status;
    const type = item?.type;
    const EnrollmentKey = `${status}-${type}`;
    // For THIS item, retrieve its rowCount from `counts`.
    const rowCount = getCountForItem(item._id);

    // Example: your newBidValue might be:
    const newBidValue =
      rowCount * (selectedOrigin?.garlicDifference || 0) +
      (dataBoard[0]?.bidAmount || 0);
    switch (EnrollmentKey) {
      case "approved-online":
        return (
          <CustomButton
            handleClick={() => {
              handleOpen("exclude-enrollment", item);
            }}
            customeStyle={{
              // height: "36px",
              background: "transparent",
              border: "1px solid #D32F2F",
              color: "#D32F2F",
              fontWeight: 700,
              padding: "8px 12px",
              "&:hover": {
                background: "transparent",
                boxShadow: "none",
              },
            }}
            text={t("components_auctions-tabs_enrollment-table.إستبعاد")}
          />
        );
      case "pending-offline":
        return (
          <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <CustomButton
              handleClick={() => handleOpen("confirm-attendance", item)}
              customeStyle={{
                color: "#fff",
                padding: "8px 12px",
                // height: "36px",
              }}
              text={t("components_auctions-tabs_enrollment-table.تأكيد_الحضور")}
            />
            <CustomButton
              handleClick={() => {
                handleOpen("exclude-enrollment", item);
              }}
              customeStyle={{
                color: "#fff",
                // height: "36px",
                background: "transparent",
                border: "1px solid #D32F2F",
                color: "#D32F2F",
                fontWeight: 700,
                padding: "8px 12px",
                "&:hover": {
                  background: "transparent",
                  boxShadow: "none",
                },
              }}
              text={t("components_auctions-tabs_enrollment-table.إستبعاد")}
            />
          </Box>
        );
      case "approved-offline":
        return (
          <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {auctionStatus == "on_going" ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "14px",
                  // maxWidth: "300px",
                  ...styles.customPaper,
                }}
              >
                <IconButton
                  disabled={rowCount === 1}
                  onClick={() => decrementCount(item._id)}
                  sx={{
                    bgcolor: "rgba(227, 232, 239,  0.4) !important",
                    borderRadius: "8px",
                    padding: "8px",
                    width: "48px",
                    height: "48px",
                    "&:disabled svg": {
                      fill: "#7A7B7A",
                    },
                  }}
                >
                  <RemoveCircleOutlineRoundedIcon
                    sx={{
                      color: "#1C4F92",
                      fontSize: "30px",
                    }}
                  />
                </IconButton>
                <Box
                  sx={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#202726",
                    borderRadius: "8px",
                    border: "0.5px solid #E6E6E6",
                    padding: "12px",
                    minWidth: "140px",
                    height: "48px",
                    textAlign: "center",
                  }}
                >
                  {formatNumber(newBidValue)}{" "}
                  <SAR img="/images/icons/SAR.svg" />
                </Box>
                <IconButton
                  onClick={() => incrementCount(item._id)}
                  disabled={dataBoard[0]?.auctionEnrollment == item?._id}
                  sx={{
                    bgcolor: "rgba(28, 79, 146,  0.1) !important",
                    borderRadius: "8px",
                    padding: "8px",
                    width: "48px",
                    height: "48px",
                    "&:disabled svg": {
                      fill: "#7A7B7A",
                    },
                  }}
                >
                  <AddCircleOutlineRoundedIcon
                    sx={{
                      color: "#1C4F92",
                      fontSize: "30px",
                    }}
                  />
                </IconButton>

                <CustomButton
                  handleClick={() => handleUserBid(item, rowCount)}
                  customeStyle={{
                    color: "#fff",
                    // height: "36px",
                    padding: "8px 12px",
                  }}
                  disabled={dataBoard[0]?.auctionEnrollment == item?._id}
                  text={t(
                    "components_auctions-tabs_enrollment-table.أضف_مزايدة"
                  )}
                />
              </Box>
            ) : (
              <Typography
                sx={{
                  ...setStatusStyle(
                    t("components_auctions-tabs_enrollment-table.مقبولة")
                  ),
                  p: "12px 16px", //
                  borderRadius: "12px",
                  width: "fit-content",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                {t("components_auctions-tabs_enrollment-table.تم_تأكيد_الحضور")}
              </Typography>
            )}

            <CustomButton
              handleClick={() => {
                handleOpen("exclude-enrollment", item);
              }}
              customeStyle={{
                color: "#fff",
                // height: "36px",
                background: "transparent",
                border: "1px solid #D32F2F",
                color: "#D32F2F",
                fontWeight: 700,
                padding: "8px 12px",
                "&:hover": {
                  background: "transparent",
                  boxShadow: "none",
                },
              }}
              text={t("components_auctions-tabs_enrollment-table.إستبعاد")}
            />
          </Box>
        );
      case "rejected-offline":
      case "rejected-online":
        return (
          <CustomButton
            handleClick={() => {
              handleOpen("reason-exclude", item);
            }}
            customeStyle={{
              // height: "36px",
              background: "transparent",
              border: "1px solid #6F6F6F",
              color: "#6F6F6F",
              fontWeight: 700,
              padding: "6px 12px",
              "&:hover": {
                background: "transparent",
                boxShadow: "none",
              },
            }}
            text={t("components_auctions-tabs_enrollment-table.سبب_الاستبعاد")}
          />
        );
      default:
        return "";
    }
  };
  const showBackDropContent = () => {
    switch (type) {
      case "exclude-enrollment":
        return (
          <RequestReject
            handleClose={handleClose}
            setRejectReason={setRejectReason}
            handleReject={handleExclude}
            error={errorReject}
            setError={setErrorReject}
            type="enrollment"
          />
        );

      case "reason-exclude":
        return (
          <Box sx={{ ...styles.popupContainer, alignItems: "start" }}>
            <PopupTitle
              title={t(
                "components_auctions-tabs_enrollment-table.سبب_الاستبعاد"
              )}
              handleClose={handleClose}
            />
            <Typography sx={{ fontSize: "1rem", color: "#6F6F6F" }}>
              {selectedEnrollment?.reject?.reason}{" "}
            </Typography>
            <CustomButton
              customeStyle={{
                mt: 3,
                width: "100%",
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
              handleClick={handleClose}
              text={t("components_auctions-tabs_enrollment-table.إغلاق")}
              type="close"
            />
          </Box>
        );
      case "confirm-attendance":
        return (
          <ConfirmAction
            title={t("components_auctions-tabs_enrollment-table.المشارك_حضوري")}
            desc={t(
              "components_auctions-tabs_enrollment-table.سيتم_تحويل_المستخدم_الي"
            )}
            handleClose={handleClose}
            handleClick={handleConfirm}
            btnTxt={t("components_auctions-tabs_enrollment-table.تأكيد_الحضور")}
          />
        );

      default:
        break;
    }
  };
  const handleExclude = async () => {
    if (!rejectReason)
      return setErrorReject(
        t("components_auctions-tabs_enrollment-table.يرجى_إدخال_سبب_الاستبعاد")
      );

    try {
      await dispatch(
        updateEnrollmentStatus({
          data: {
            user: selectedEnrollment?.user._id,
            status: "rejected",
            reject: { reason: rejectReason },
          },
          auctionId: selectedEnrollment?.auction,
          originId: selectedEnrollment?.auctionOrigin,
          enrollmentId: selectedEnrollment?._id,
        })
      ).unwrap();
      await dispatch(getAllEnrollments(params)).unwrap();
      setAlert({
        msg: t("components_auctions-tabs_enrollment-table.تم_الاستبعاد_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
    }
  };

  const handleConfirm = async () => {
    try {
      await dispatch(
        updateEnrollmentStatus({
          data: {
            user: selectedEnrollment?.user._id,
            status: "approved",
          },
          auctionId: selectedEnrollment?.auction,
          originId: selectedEnrollment?.auctionOrigin,
          enrollmentId: selectedEnrollment?._id,
        })
      ).unwrap();
      await dispatch(getAllEnrollments(params)).unwrap();
      setAlert({
        msg: t("components_auctions-tabs_enrollment-table.تم_التأكيد_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
    }
  };
  console.log("originId", originId);
  const handleUserBid = async (item, rowCount) => {
    console.log("item", item);

    const userBid = dataBoard?.find((b) => b.auctionEnrollment === item._id);

    let amount;
    if (
      dataBoard?.length > 0 &&
      userBid
      //  &&
      // biddingBoard[0].auctionEnrollment != item._id
    ) {
      amount =
        biggestBidding -
        userBid?.bidAmount +
        rowCount * selectedOrigin?.garlicDifference;
      // console.log("amount in if", amount);
    } else if (!userBid) {
      // console.log("first user enrollment");
      amount =
        biggestBidding -
        openingPrice +
        rowCount * selectedOrigin?.garlicDifference;
    } else if (dataBoard?.length < 0) {
      // console.log("from no enrollment found");
      amount = rowCount * selectedOrigin?.garlicDifference;
    }
    // biddingBoard?.length > 0;
    // console.log("item", item);
    try {
      await dispatch(
        addUserBid({
          data: {
            user: item?.user._id,
            amount: amount,
          },
          auctionId: item?.auction,
          originId: item?.auctionOrigin,
          enrollmentId: item?._id,
        })
      ).unwrap();
      await dispatch(
        getBiddingBoard({
          auctionId: item?.auction,
          originId: item?.auctionOrigin,
        })
      ).unwrap();
      setAlert({
        msg: t(
          "components_auctions-tabs_enrollment-table.تم_اضافه_المزايده_بنجاح"
        ),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
      setCounts((prev) => ({
        ...prev,
        [item._id]: 1,
      }));
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
    }
  };
  return (
    <>
      <TableContainer
        sx={{
          textAlign: "right",
          boxShadow: "none",
          border: "1px solid #D6D9E1",
          borderRadius: "12px",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="auction table">
          <TableHead>
            <TableRow>
              <TableCell align="right">
                {t("components_auctions-tabs_enrollment-table.إسم_المستخدم")}
              </TableCell>
              <TableCell align="right">
                {t("components_auctions-tabs_enrollment-table.تاريخ_الاشتراك")}
              </TableCell>
              <TableCell align="right">
                {t("components_auctions-tabs_enrollment-table.نوع_الاشتراك")}
              </TableCell>
              <TableCell align="right">
                {t("components_auctions-tabs_enrollment-table.رقم_الهاتف")}
              </TableCell>
              <TableCell>
                {t("components_auctions-tabs_enrollment-table.تعريف_المشترك")}
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.length > 0 ? (
              data?.data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell align="right">{item?.user?.name}</TableCell>
                  <TableCell align="right">
                    {formatDate(item?.enrollmentDate)}
                  </TableCell>
                  <TableCell align="right">
                    {item.shareAs == "genuine"
                      ? t("components_auctions-tabs_enrollment-table.أصيل")
                      : item?.agency?.agencyName}
                  </TableCell>
                  <TableCell align="right">
                    {item?.user?.phoneNumber.number}
                  </TableCell>
                  <TableCell
                  // align="center"
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: `#2E353F !important`,
                      }}
                    >
                      {item.participantNumber}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    {selectedOrigin?.awardStatus == "pending" &&
                      // auctionStatus == "on_going" &&
                      renderActionButton(item)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <NoData img={noDataImg} desc={noDataDesc} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
      <CustomSnackbar
        message={alert.msg}
        open={alertOpen}
        setOpen={setAlertOpen}
        type={alert.type}
      />
    </>
  );
}
