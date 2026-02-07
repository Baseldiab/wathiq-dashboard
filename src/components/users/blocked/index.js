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
export default function Blocked({ user }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const {
    agencies_blockedData,
    agencies_blockedLoading,
    agencies_blockedError,
    agencies_blockedData_spacific_user,
    agencies_blockedLoading_spacific_user,
    agencies_blockedError_spacific_user,
  } = useSelector((state) => state.agencies);
  const [selectedItem, setselectedItem] = useState({});
  const [type, setType] = useState("");
  const [dateVal, setdateVal] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const { selectedUser } = useSelector((state) => state.user);

  const Data = user ? agencies_blockedData_spacific_user : agencies_blockedData;

  const router = useRouter();
  const handleOpen = (e) => {
    setType(e);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // useEffect(() => {
  //   dispatch(getAllagencies(buildQueryParams({ status: "blocked", page })));
  // }, []);

  useEffect(() => {
    user &&
      dispatch(
        getAllagencies(
          buildQueryParams({
            status: "blocked",
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
              status: "blocked",
              page,
              user: selectedUser?.data?._id,
            })
          )
        )
      : dispatch(getAllagencies(buildQueryParams({ status: "blocked", page })));
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
              status: "blocked",
              page: currentPage,
              user: selectedUser?.data?._id,
            })
          )
        )
      : dispatch(
          getAllagencies(
            buildQueryParams({ status: "blocked", page: currentPage })
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
                status: "blocked",
                page: page,
                user: selectedUser?.data?._id,
              })
            )
          ).unwrap()
        : await dispatch(
            getAllagencies(buildQueryParams({ status: "blocked", page: page }))
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
      setAlert({ msg: t("components_users_blocked_index.تم_قبول_الوكالة_بنجاح"), type: "success" });
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
      setError(error?.message || t("components_users_blocked_index.حدث_خطأ_غير_متوقع"));
    }
  };
  const showBackDropContent = () => {
    switch (type) {
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
  if (agencies_blockedLoading || agencies_blockedLoading_spacific_user)
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
                <TableCell>{t("components_users_blocked_index.إسم_الوكاله")}</TableCell>
                <TableCell align="right">{t("components_users_blocked_index.رقم_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_blocked_index.تاريخ_إصدار_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_blocked_index.تاريخ_إنتهاء_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_blocked_index.مرفق_الوكالة")}</TableCell>
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
                        title={t("components_users_blocked_index.مرفق_الوكالة")}
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
                          background: "#22A06B",
                          border: "1px solid rgba(202, 0, 0, 0)",
                          color: "#ffff",
                          fontWeight: 700,
                          // minWidth: "auto", // Ensure button width is minimal
                          padding: "6px 12px", // Adjust padding for compact size
                          "&:hover": {
                            background: "#22A06B",
                            boxShadow: "none",
                          },
                        }}
                        handleClick={() => {
                          handleOpen("accept-request");
                          setselectedItem(item);
                        }} ///sa
                        text={t("components_users_blocked_index.تفعيل")}
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
                      desc={t("components_users_blocked_index.لا_يوجد_وكالات_مرفوضة")}
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
              >{t("components_users_blocked_index.من")}</Typography>
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
