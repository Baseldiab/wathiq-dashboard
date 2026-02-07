import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  buildQueryParams,
  formatDate,
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
import {
  getAllusers,
  getUser,
  notifySpacificusers,
} from "@/Redux/slices/userSlice";
import SendNotification from "@/components/corporate/contracting-corporates/popup/send-notification";
import CustomSnackbar from "@/components/toastMsg";
import { styles } from "@/components/globalStyle";
export default function User({ filterData }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const {
    usersData,
    selectedUser,
    All_loading,
    selected_loading,
    notifySpacificusersLoading,
  } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [id, setID] = useState("");
  const [alert, setAlert] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!usersData) {
      dispatch(getAllusers(buildQueryParams({ page })));
    }
  }, [dispatch]);
  // useEffect(() => {
  //   dispatch(getAllusers(buildQueryParams({ page })));
  // }, []);
  useEffect(() => {
    if (usersData) {
      setPage(usersData?.pagination?.currentPage);
      setTotalCount(usersData?.pagination?.totalPages);
    }
  }, [usersData]);
  const handleOpen = (id) => {
    console.log(id);
    setID(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setID("");
  };
  const handlePaginationChange = (e, currentPage) => {
    setPage(currentPage);
    dispatch(
      getAllusers(buildQueryParams({ page: currentPage, ...filterData }))
    );
  };
  const handleUserDetails = async (id) => {
    if (usersData?.data?._id != id) {
      let response = await dispatch(getUser(id));
      if (response?.meta?.requestStatus === "fulfilled") {
        router.push(`/users/details/${id}`);
      }
    } else {
      router.push(`/users/details/${id}`);
    }
  };
  // useEffect(() => {
  //   if (!All_loading && !selected_loading && !notifySpacificusersLoading) {
  //     const timer = setTimeout(() => setLoading(false), 200);
  //     return () => clearTimeout(timer);
  //   } else {
  //     setLoading(true);
  //   }
  // }, [All_loading, selected_loading, notifySpacificusersLoading]);
  const handleNotification = async (formData) => {
    try {
      await dispatch(
        notifySpacificusers({
          data: {
            title: { ar: formData.title },
            message: { ar: formData.msg },
            recipient: id,
          },
        })
      ).unwrap();
      setAlert({ msg: t("components_users_user_index.تم_ارسال_الاشعار_بنجاح"), type: "success" });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
    }
  };
  if (All_loading || selected_loading || notifySpacificusersLoading)
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
                <TableCell>{t("components_users_user_index.إسم_المستخدم")}</TableCell>
                <TableCell align="right">{t("components_users_user_index.رقم_الجوال")}</TableCell>
                <TableCell align="right">{t("components_users_user_index.تاريخ_التسجيل")}</TableCell>
                {/* <TableCell align="right">{t("components_users_user_index.الوكالات")}</TableCell> */}
                <TableCell align="right">{t("components_users_user_index.المزادات_الرابحة")}</TableCell>
                <TableCell align="right">{t("components_users_user_index.الحالة")}</TableCell>
                <TableCell align="right"></TableCell>
                {/* <TableCell align="right"></TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData?.data?.length > 0
                ? usersData?.data.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {item?.name}
                      </TableCell>
                      <TableCell align="right">
                        
                        {item?.phoneNumber?.number?`0966${item?.phoneNumber?.number}`:"________________"}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        {formatDate(item?.createdAt)}
                      </TableCell>
                      {/* <TableCell align="right">{item?.agencyCount}</TableCell> */}
                      <TableCell align="center">
                        {item?.successAuctionsCount}
                      </TableCell>

                      <TableCell align="center">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            sx={{
                              ...setStatusStyle(
                                item?.blocked?.value ? t("components_users_user_index.محظور") : t("components_users_user_index.نشط")
                              ),
                              ml: 1,
                            }}
                          >
                            {item?.blocked?.value ? " محظور" : "  نشط"}
                          </Typography>

                          {/* {hasRole("send notification") && (
                            <Box
                              component="img"
                              src="/images/Bell.svg"
                              sx={{
                                padding: "12px",
                                borderRadius: "12px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleOpen(item?._id)}
                            />
                          )} */}
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            gap: "24px",
                            alignItems: "center",
                            justifyContent: "end",
                            ml: 2,
                          }}
                        >
                          <Typography
                            onClick={() => handleUserDetails(item?._id)}
                            sx={{
                              ...styles.detailsBtnTable,
                            }}
                          >
                            التفاصيل{" "}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
        {usersData?.data?.length > 0 && (
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
              >{t("components_users_user_index.من")}</Typography>
              <Typography
                sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}
              >
                {usersData?.pagination?.resultCount}
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
      <Backdrop open={open} onClick={handleClose} sx={{ zIndex: "100000" }}>
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
          <SendNotification
            handleNotification={handleNotification}
            handleClose={handleClose}
          />
        </Box>
      </Backdrop>
      <CustomSnackbar
        type={alert.type}
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alert.msg}
      />
    </Box>
  );
}
