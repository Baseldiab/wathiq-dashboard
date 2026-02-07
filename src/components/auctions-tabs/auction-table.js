import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AuctionTypeFunction,
  buildQueryParams,
  formatDate,
  hasRole,
} from "@/services/utils";
import {
  Backdrop,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Pagination from "@/components/pagination";
import Loader from "@/components/loader";
import { useRouter } from "next/router";
import NoData from "@/components/no-data";
import CustomButton from "@/components/button";
import constants from "@/services/constants";
import {
  askForReviewAuction,
  getAllAuctions,
  getAuction,
  reviewAuction,
} from "@/Redux/slices/auctionsSlice";
import CustomSnackbar from "../toastMsg";
import ActiveAuction from "./auction-popup/active-auction";
import { styles } from "../globalStyle";

export default function AuctionTable({
  status,
  specialToSupportAuthority,
  reviewStatus,
  createdByAdmin,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: profile } = useSelector((state) => state.profile);

  const {
    auction,
    loadingAuction,
    loadingReview,
    errorReview,
    loadingAskReview,
    errorAskReview,
  } = useSelector((state) => state.auctions);
  const request_data = useSelector((state) => {
    state.auctions?.auctions_requests?.pending?.[status]?.[
      specialToSupportAuthority
    ]?.[reviewStatus];
  });

  const auctionData = useSelector((state) => {
    if (createdByAdmin == "false") {
      return (
        state.auctions?.auctions_requests?.[status]?.[
          specialToSupportAuthority
        ]?.[reviewStatus] || {
          data: [],
          pagination: {},
        }
      );
    } else {
      return (
        state.auctions?.auctions?.[status]?.[specialToSupportAuthority]?.[
          reviewStatus
        ] || {
          data: [],
          pagination: {},
        }
      );
    }
  });
  const auctionList = auctionData?.data || [];
  const pagination = auctionData?.pagination || {};
  // Access loading and error states based on createdByAdmin
  const isLoading = useSelector((state) =>
    createdByAdmin == "false"
      ? state.auctions?.loading_requests?.[status]?.[specialToSupportAuthority]
      : state.auctions?.loading?.[status]?.[specialToSupportAuthority]
  );

  const error = useSelector((state) =>
    createdByAdmin == "false"
      ? state.auctions?.errors_requests?.[status]?.[specialToSupportAuthority]
      : state.auctions?.errors?.[status]?.[specialToSupportAuthority]
  );

  useEffect(() => {
    if (
      !isLoading &&
      (!auctionList || auctionList.length === 0)
      // &&
      // || (reviewStatus === "approved" && status === "pending")
      // hasRole("get auction")
    ) {
      dispatch(
        getAllAuctions(
          buildQueryParams({
            createdByAdmin,
            status,
            reviewStatus: reviewStatus || "",
            specialToSupportAuthority: specialToSupportAuthority,
            page,
          })
        )
      );
    }
  }, [
    dispatch,
    page,
    auctionList.length,
    specialToSupportAuthority,
    reviewStatus,
    createdByAdmin,
    status,
  ]);

  useEffect(() => {
    if (pagination?.currentPage) {
      setPage(pagination.currentPage);
      setTotalCount(pagination.totalPages);
    }
  }, [pagination]);

  useEffect(() => {
    if (!isLoading && !loadingAuction && !loadingReview && !loadingAskReview) {
      // const timer = setTimeout(() => setLoading(false), 200);
      // return () => clearTimeout(timer);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [isLoading, loadingAuction, loadingReview, loadingAskReview]);
  const handleOpen = (popupType, auction) => {
    setType(popupType);
    setSelectedAuction(auction);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const showBackDropContent = () => {
    switch (type) {
      case "active-auction":
        return (
          <ActiveAuction
            handleClose={handleClose}
            auctionData={selectedAuction}
            setAlertOpen={setAlertOpen}
            setAlert={setAlert}
          />
        );
      case "reason-rejected":
        return (
          <Box sx={{ ...styles.popupContainer, alignItems: "start" }}>
            <Typography
              sx={{ fontSize: "1.3rem", color: "#161008", fontWeight: 700 }}
            >
              سبب الرفض{" "}
            </Typography>
            <Typography sx={{ fontSize: "1rem", color: "#6F6F6F" }}>
              {selectedAuction?.auctionReviewStatus?.reason}{" "}
            </Typography>
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                gap: "24px",
                width: "100%",
              }}
            >
              <CustomButton
                customeStyle={{
                  width: "100%",
                  background: "transparent",
                  color: "#7A7B7A",
                  fontWeight: 700,
                  border: "1px solid #7A7B7A",
                  "&:hover": {
                    background: "transparent",
                    color: "#7A7B7A",
                    boxShadow: "none",
                  },
                }}
                handleClick={handleClose}
                text={t("components_auctions-tabs_auction-table.إغلاق")}
                type="close"
              />
            </Box>
          </Box>
        );

      default:
        break;
    }
  };
  // Handle pagination change
  const handlePaginationChange = (e, currentPage) => {
    setPage(currentPage);
    dispatch(
      getAllAuctions(
        buildQueryParams({
          status: status,
          reviewStatus: reviewStatus ? reviewStatus : "",
          specialToSupportAuthority: specialToSupportAuthority,
          page: currentPage,
        })
      )
    );
  };
  const admin = profile?.data?.type == "admin";

  const renderActionButton = (reviewStatus, item, status) => {
    const actionKey = `${reviewStatus}-${status}-${item?.createdByAdmin}-${admin}`;
    // console.log("createdByAdmin", createdByAdmin);
    // console.log("actionKey", actionKey);
    switch (actionKey) {
      case "pending-pending-true-true":
      case "pending-pending-false-true":
      case "pending-pending-true-false":
      case "pending-pending-false-false":
        return (
          hasRole("update auction") && (
            <CustomButton
              handleClick={() => handleAskForReview(item._id)}
              customeStyle={{
                color: "#fff",
                // width: "90px",
                // height: "40px",
              }}
              text={t(
                "components_auctions-tabs_auction-table.ارسال_طلب_مراجعة"
              )}
            />
          )
        );
      case "need_to_review-pending-false-true":
      case "need_to_review-pending-true-true":
        return (
          hasRole("review auction") && (
            <CustomButton
              handleClick={() => handleApprove(item._id)}
              customeStyle={{
                color: "#fff",
                width: item?.createdByAdmin == true && "150px",
                // height: "40px",
              }}
              text={
                item?.createdByAdmin == false
                  ? t("components_auctions-tabs_auction-table.قبول_الطلب")
                  : t("components_auctions-tabs_auction-table.تنفيذ")
              }
            />
          )
        );
      case "approved-pending-true-true":
      case "approved-pending-false-true":
        return (
          hasRole("update auction") && (
            <CustomButton
              handleClick={() => {
                handleOpen("active-auction", item);
              }}
              customeStyle={{
                color: "#fff",
                width: "160px",
                // height: "40px",
                // p: {
                //   sm: "1.3rem",
                //   lg: "1.3rem 0.8rem",
                // },
              }}
              text={t("components_auctions-tabs_auction-table.تفعيل_المزاد")}
              type="broker"
            />
          )
        );

      case "rejected-pending-false-true":
      case "rejected-pending-false-false":
        return (
          <CustomButton
            handleClick={() => handleOpen("reason-rejected", item)}
            customeStyle={{
              color: "#fff",
              // width: "90px",
              // height: "40px",
              border: "1px solid #D6D9E1",
              bgcolor: "transparent",
              color: "#202726",
              "&:hover": {
                background: "transparent",
                color: "#6F6F6F",
                boxShadow: "none",
              },
            }}
            text={t("components_auctions-tabs_auction-table.سبب_الرفض")}
          />
        );
      default:
        return "";
    }
  };
  const handleAskForReview = async (auctionId) => {
    try {
      await dispatch(
        askForReviewAuction({
          id: auctionId,
        })
      ).unwrap();

      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status,
            reviewStatus,
            specialToSupportAuthority: specialToSupportAuthority,
            createdByAdmin,
          })
        )
      );
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status,
            reviewStatus: "need_to_review",
            specialToSupportAuthority: specialToSupportAuthority,
            createdByAdmin,
          })
        )
      ).unwrap();

      setAlert({
        msg: t("components_auctions-tabs_auction-table.تم_ارسال_طلب_المراجعة"),
        type: "success",
      });
      setAlertOpen(true);
      // router.push({
      //   pathname: "/auctions",
      //   query: {
      //     mainTab: 2,
      //   },
      // });
    } catch (error) {
      setAlert({
        msg: error || t("components_auctions-tabs_auction-table.حدث_خطأ"),
        type: "error",
      });

      setAlertOpen(true);
    }
  };
  const handleApprove = async (auctionId) => {
    try {
      await dispatch(
        reviewAuction({
          id: auctionId,
          data: { status: "approved" },
        })
      ).unwrap();

      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status,
            reviewStatus,
            specialToSupportAuthority: specialToSupportAuthority,
            createdByAdmin,
          })
        )
      );
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status,
            reviewStatus: "approved",
            specialToSupportAuthority: specialToSupportAuthority,
            createdByAdmin,
          })
        )
      ).unwrap();

      setAlert({
        msg:
          createdByAdmin === "false"
            ? t("components_auctions-tabs_auction-table.تمت_الموافقة_ع_الطلب")
            : t("components_auctions-tabs_auction-table.تم_تنفيذ_المزاد_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      // router.push({
      //   pathname: "/auctions",
      //   query: {
      //     mainTab: createdByAdmin === "false" ? 3 : 2,
      //   },
      // });
    } catch (error) {
      setAlert({
        msg: errorReview || t("components_auctions-tabs_auction-table.حدث_خطأ"),
        type: "error",
      });

      setAlertOpen(true);
    }
  };
  const handleAuctionsDetails = async (id) => {
    if (auction?.data?._id != id) {
      let response = await dispatch(getAuction(id));

      if (response?.meta?.requestStatus === "fulfilled") {
        router.push(`/auctions/details/${id}`);
      }
    } else {
      router.push(`/auctions/details/${id}`);
    }
  };
  // if (isLoading || loadingAuction || loadingReview || loadingAskReview)
  //   return <Loader open={true} />;

  if (loading) return <Loader open={true} />;
  return (
    <Box>
      {hasRole("get auction") && (
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
                  <TableCell>
                    {t("components_auctions-tabs_auction-table.إسم_المزاد")}
                  </TableCell>
                  {status != "pending" ? (
                    <TableCell align="right">
                      {t(
                        "components_auctions-tabs_auction-table.تاريخ_ووقت_البدأ"
                      )}
                    </TableCell>
                  ) : (
                    <TableCell align="right">
                      {t(
                        "components_auctions-tabs_auction-table.تاريخ_إنشاء_المزاد"
                      )}
                    </TableCell>
                  )}
                  {status != "pending" && (
                    <TableCell align="right">
                      {t("components_auctions-tabs_auction-table.العنوان")}
                    </TableCell>
                  )}
                  <TableCell align="right">
                    {t("components_auctions-tabs_auction-table.نوع_المزاد")}
                  </TableCell>
                  <TableCell align="right">
                    {t("components_auctions-tabs_auction-table.الأصول")}
                  </TableCell>
                  <TableCell align="right">
                    {t("components_auctions-tabs_auction-table.تابع_لـ")}
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auctionList.length > 0 ? (
                  auctionList.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item?.title}</TableCell>
                      <TableCell align="right">
                        {status != "pending"
                          ? formatDate(item?.startDate)
                          : formatDate(item?.createdAt)}
                      </TableCell>
                      {status != "pending" && (
                        <TableCell
                          sx={{
                            maxWidth: 200,
                            whiteSpace: "wrap",
                            // overflow: "hidden",
                            // textOverflow: "ellipsis",
                          }}
                        >
                          {item?.location?.title}
                        </TableCell>
                      )}
                      <TableCell align="right">
                        {" "}
                        {AuctionTypeFunction(item?.type)}
                      </TableCell>
                      <TableCell align="right">
                        {item?.auctionOrigins?.length > 0
                          ? item?.auctionOrigins?.length
                          : t("components_auctions-tabs_auction-table.لا_يوجد")}
                      </TableCell>
                      <TableCell align="right">
                        {item?.createdByAdmin == true &&
                        !item?.provider?.companyName
                          ? t("components_auctions-tabs_auction-table.وثيق")
                          : item?.provider?.companyName}
                      </TableCell>
                      {/* {item.createdByAdmin == true &&
                        item.status == "pending" && ( */}
                      <TableCell align="right">
                        <Box
                          sx={{
                            ...styles.tableActionRow,
                          }}
                        >
                          <CustomButton
                            handleClick={() => handleAuctionsDetails(item?._id)}
                            customeStyle={{
                              border: "1px solid #7A7B7A",
                              bgcolor: "transparent",
                              color: "#7A7B7A",
                              "&:hover": {
                                bgcolor: "transparent",
                                color: "#7A7B7A",
                                boxShadow: "none",
                              },
                            }}
                            text={t(
                              "components_auctions-tabs_auction-table.التفاصيل"
                            )}
                          ></CustomButton>

                          {renderActionButton(reviewStatus, item, status)}
                        </Box>
                      </TableCell>
                      {/* )} */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <NoData
                        img="images/icons/no-auction.svg"
                        desc={t(
                          "components_auctions-tabs_auction-table.لا_يوجد_مزادات"
                        )}
                        btnTitle={t(
                          "components_auctions-tabs_auction-table.إنشاء_مزاد"
                        )}
                        onClick={() => router.push("/auctions/create-auction")}
                        {...(reviewStatus === "pending" ? { add: true } : {})}
                        role={hasRole("create auction")}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {auctionList.length > 0 && (
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
                <Typography
                  sx={{ color: "#6F6F6F", fontWeight: 700, fontSize: "1rem" }}
                >
                  {t("components_auctions-tabs_auction-table.من")}
                </Typography>
                <Typography
                  sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}
                >
                  {pagination?.resultCount}
                </Typography>
              </Box>
              <Pagination
                handleChange={handlePaginationChange}
                page={page}
                count={totalCount}
              />
            </Box>
          )}
        </>
      )}
      {hasRole(["update auction"]) && (
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
      )}

      <CustomSnackbar
        message={alert.msg}
        open={alertOpen}
        setOpen={setAlertOpen}
        type={alert.type}
      />
    </Box>
  );
}
