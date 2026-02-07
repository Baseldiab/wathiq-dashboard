import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  buildQueryParams,
  formatDate,
  getFileType,
  hasRole,
  setStatusStyle,
} from "@/services/utils";
import {
  Backdrop,
  Box,
  Grid,
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
import CustomButton from "@/components/button";
import {
  getAllagencies,
  updateAgenciesStatues,
} from "@/Redux/slices/agenciesSlice";
import File from "@/components/file";
import { styles } from "@/components/globalStyle";
import RequestAccept from "@/components/corporate/contract-requests/popup/request-accept";
import dayjs from "dayjs";
import CustomSnackbar from "@/components/toastMsg";
import NoData from "@/components/no-data";
export default function Rejected({ user }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const {
    agencies_rejectedData,
    agencies_rejectedLoading,
    agencies_rejectedError,
    agencies_rejectedData_spacific_user,
    agencies_rejectedLoading_spacific_user,
    agencies_rejectedError_spacific_user,
  } = useSelector((state) => state.agencies);
  const [selectedItem, setselectedItem] = useState({});
  const [type, setType] = useState("");
  const [dateVal, setdateVal] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const { selectedUser } = useSelector((state) => state.user);

  const Data = user
    ? agencies_rejectedData_spacific_user
    : agencies_rejectedData;

  const router = useRouter();
  const handleOpen = (e) => {
    setType(e);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // useEffect(() => {
  //   dispatch(getAllagencies(buildQueryParams({ status: "rejected", page })));
  // }, []);

  useEffect(() => {
    user &&
      dispatch(
        getAllagencies(
          buildQueryParams({
            status: "rejected",
            page,
            user: selectedUser?.data?._id,
          })
        )
      );
  }, [dispatch, selectedUser]);
  useEffect(() => {
    // if (!Data) {
    user
      ? dispatch(
          getAllagencies(
            buildQueryParams({
              status: "rejected",
              page,
              user: selectedUser?.data?._id,
            })
          )
        )
      : dispatch(
          getAllagencies(buildQueryParams({ status: "rejected", page }))
        );
    // }
  }, [dispatch]);
  useEffect(() => {
    if (Data) {
      setPage(Data?.pagination?.currentPage);
      setTotalCount(Data?.pagination?.totalPages);
    }
  }, [Data]);
  const handlePaginationChange = (e, currentPage) => {
    setPage(currentPage);
    user
      ? dispatch(
          getAllagencies(
            buildQueryParams({
              status: "rejected",
              page: currentPage,
              user: selectedUser?.data?._id,
            })
          )
        )
      : dispatch(
          getAllagencies(
            buildQueryParams({ status: "rejected", page: currentPage })
          )
        );
  };
  const handleAccept = async () => {
    try {
      await dispatch(
        updateAgenciesStatues({
          id: selectedItem?._id,
          status: "approved",
          expireAt: dayjs(dateVal).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        })
      ).unwrap();
      user
        ? await dispatch(
            getAllagencies(
              buildQueryParams({
                status: "rejected",
                page: page,
                user: selectedUser?.data?._id,
              })
            )
          ).unwrap()
        : await dispatch(
            getAllagencies(buildQueryParams({ status: "rejected", page: page }))
          ).unwrap();
      user
        ? await dispatch(
            getAllagencies(
              buildQueryParams({
                status: "approved",
                page: page,
                user: selectedUser?.data?._id,
              })
            )
          ).unwrap()
        : await dispatch(
            getAllagencies(buildQueryParams({ status: "approved", page: page }))
          ).unwrap();
      setAlert({ msg: t("components_users_agencies_rejected_rejected.تم_قبول_الوكالة_بنجاح"), type: "success" });
      setAlertOpen(true);
      handleClose();
      user
        ? router.push({
            pathname: `/users/details/${selectedUser?.data?._id}`,
          })
        : router.push({
            pathname: "/users",
          });
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
      console.error("API Error:", error);
      setError(error?.message || t("components_users_agencies_rejected_rejected.حدث_خطأ_غير_متوقع"));
    }
  };
  const showBackDropContent = () => {
    switch (type) {
      case "reject-request":
        return (
          <Box sx={{ ...styles.popupContainer, alignItems: "start" }}>
            <Typography
              sx={{
                fontSize: "1.3rem",
                color: "#161008",
                fontWeight: 700,
              }}
            >
              سبب الرفض{" "}
            </Typography>
            <Typography sx={{ fontSize: "1rem", color: "#6F6F6F" }}>
              {selectedItem?.status?.reason}{" "}
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
              {/* <Box
                sx={{
                  display: "flex",
                //   alignItems: "center",
                  justifyContent: "space-between",
                  //   gap:,
                }}
              > */}
              <CustomButton
                customeStyle={{
                  width: "50%",
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
                text={t("components_users_agencies_rejected_rejected.إغلاق")}
                type="close"
              />
              <CustomButton
                customeStyle={{
                  width: "50%",
                  background: "#22A06B",
                  "&:hover": {
                    background: "#22A06B",
                  },
                }}
                handleClick={() => {
                  handleOpen("accept-request");
                }}
                text=" قبول الوكالة"
              />
              {/* </Box> */}
            </Box>
          </Box>
        );
      case "accept-request":
        return (
          <RequestAccept
            handleClose={handleClose}
            handleAccept={handleAccept}
            type="agencies"
            dateVal={dateVal}
            setError={setError}
            error={error}
            setdateVal={setdateVal}
          />
        );

      default:
        break;
    }
  };
  if (agencies_rejectedLoading || agencies_rejectedLoading_spacific_user)
    return <Loader open={true} />;
  return (
    <Box>
      <>
        <TableContainer
          sx={{
            textAlign: "right",
            boxShadow: "none",
            border: "1px solid #D6D9E1",
            borderRadius: "12px",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t("components_users_agencies_rejected_rejected.إسم_الوكاله")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_rejected_rejected.رقم_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_rejected_rejected.تاريخ_إصدار_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_rejected_rejected.تاريخ_إنتهاء_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_rejected_rejected.مرفق_الوكالة")}</TableCell>
                <TableCell align="right"></TableCell>
                {/* <TableCell align="right"></TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {Data?.data?.length > 0 ? (
                Data?.data.map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {item?.agencyName}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item?.agencyNumber}
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      {formatDate(item?.createdAt)}
                    </TableCell>
                    <TableCell align="right">
                      {item?.expireAt ? formatDate(item?.expireAt) : "N/A"}
                    </TableCell>

                    <TableCell align="right">
                      {" "}
                      <File
                        href={item?.agencyAttachment}
                        type={getFileType(item?.agencyAttachment)}
                        title={t("components_users_agencies_rejected_rejected.مرفق_الوكالة")}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {/* <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 2,
                          }}
                        > */}
                      <CustomButton
                        customeStyle={{
                          background: "#EB57571A",
                          border: "1px solid #D32F2F",
                          color: "#D32F2F",
                          fontWeight: 700,
                          "&:hover": {
                            background: "#EB57571A",
                            boxShadow: "none",
                          },
                        }}
                        handleClick={() => {
                          handleOpen("reject-request");
                          setselectedItem(item);
                        }}
                        text={t("components_users_agencies_rejected_rejected.سبب_الرفض")}
                      />
                      {/* <CustomButton
                            handleClick={() => {
                              handleOpen("accept-request");
                              setselectedItem(item);
                            }}
                            text=" قبول"
                          /> */}
                      {/* </Box> */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <NoData
                      img="/images/icons/no-agency.svg"
                      desc={t("components_users_agencies_rejected_rejected.لا_يوجد_وكالات_مرفوضة")}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {Data?.data?.length > 0 && (
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
              >{t("components_users_agencies_rejected_rejected.من")}</Typography>
              <Typography
                sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}
              >
                {Data?.pagination?.resultCount}
              </Typography>
            </Box>

            <Pagination
              handleChange={handlePaginationChange}
              page={page}
              count={totalCount}
            />
            {/* <Backdrop open={open} onClick={handleClose}> */}
            <Backdrop open={open} onClick={handleClose} sx={{ zIndex: "99" }}>
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                  maxHeight: "85%",
                  overflow: "auto",
                  bgcolor: "white",
                  borderRadius: "12px",
                  padding: "20px",
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
                {" "}
                {showBackDropContent()}
              </Box>
            </Backdrop>
          </Box>
        )}
      </>
      <CustomSnackbar
        type={alert.type}
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alert.msg}
      />
    </Box>
  );
}
