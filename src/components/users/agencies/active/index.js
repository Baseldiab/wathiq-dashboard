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
import {
  getAllProviders,
  getAllProvidersRequests,
  getAnalysisProvider,
  getProvider,
  getProviderRequest,
  handleAccepted,
  handleReload,
} from "@/Redux/slices/providerSlice";
import Loader from "@/components/loader";
import { useRouter } from "next/router";
import CustomButton from "@/components/button";
import RequestReject from "@/components/corporate/contract-requests/popup/request-reject";
// import RequestAccept from "@/components/corporate/contract-requests/popup/request-accept";
import {
  getAllagencies,
  updateAgenciesStatues,
} from "@/Redux/slices/agenciesSlice";
import File from "@/components/file";
import dayjs from "dayjs";
import CustomSnackbar from "@/components/toastMsg";
import NoData from "@/components/no-data";
export default function NewRequsets({ user }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const { data: profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");
  const {
    agencies_ApprovedData,
    agencies_ApprovedLoading,
    agencies_ApprovedData_spacific_user,
    agencies_ApprovedLoading_spacific_user,
    agencies_ApprovedError,
  } = useSelector((state) => state.agencies);
  const { selectedUser } = useSelector((state) => state.user);
  const [selectedItem, setselectedItem] = useState({});
  const [dateVal, setdateVal] = useState(""); // Start with an empty string
  const [alert, setAlert] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const Data = user
    ? agencies_ApprovedData_spacific_user
    : agencies_ApprovedData;
  const handleOpen = (popupType) => {
    setType(popupType);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setError("");
    setRejectReason("");
  };
  // useEffect(() => {
  //   dispatch(getAllagencies(buildQueryParams({ status: "approved", page })));
  // }, []);
  useEffect(() => {
    user &&
      dispatch(
        getAllagencies(
          buildQueryParams({
            status: "approved",
            page,
            user: selectedUser?.data?._id,
            expired: false,
          })
        )
      );
  }, [selectedUser, dispatch]);
  useEffect(() => {
    // if (!Data) {
    user
      ? dispatch(
          getAllagencies(
            buildQueryParams({
              status: "approved",
              page,
              user: selectedUser?.data?._id,
              expired: false,
            })
          )
        )
      : dispatch(
          getAllagencies(
            buildQueryParams({ status: "approved", page, expired: false })
          )
        );
    // }
  }, [dispatch, selectedUser]);
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
              status: "approved",
              page: currentPage,
              user: selectedUser?.data?._id,
              expired: false,
            })
          )
        )
      : dispatch(
          getAllagencies(
            buildQueryParams({
              status: "approved",
              page: currentPage,
              expired: false,
            })
          )
        );
  };
  const handleDisableAgency = async () => {
    if (!rejectReason) return setError(t("components_users_agencies_active_index.يرجى_إدخال_سبب_التعطيل"));

    try {
      await dispatch(
        updateAgenciesStatues({
          id: selectedItem?._id,
          status: "blocked",
          reason: rejectReason,
        })
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
      setAlert({ msg: t("components_users_agencies_active_index.تم_تعطيل_الوكالة_بنجاح"), type: "success" });
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
      setError(error);
    }
  };
  const showBackDropContent = () => {
    switch (type) {
      case "reject-request":
        return (
          <RequestReject
            handleClose={handleClose}
            setRejectReason={setRejectReason}
            handleReject={handleDisableAgency}
            error={error}
            setError={setError}
            type="agenciesDissabled"
          />
        );

      default:
        break;
    }
  };
  if (agencies_ApprovedLoading || agencies_ApprovedLoading_spacific_user)
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
                {!user && <TableCell>{t("components_users_agencies_active_index.إسم_المستخدم")}</TableCell>}{" "}
                <TableCell align="right">{t("components_users_agencies_active_index.رقم_هوية_الموكل")}</TableCell>

                <TableCell align="right">{t("components_users_agencies_active_index.رقم_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_active_index.تاريخ_إصدار_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_active_index.تاريخ_إنتهاء_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_active_index.مرفق_الوكالة")}</TableCell>
                {/* <TableCell align="right">{t("components_users_agencies_active_index.الحالة")}</TableCell> */}
                <TableCell align="right"></TableCell>
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
                    {!user && (
                      <TableCell component="th" scope="row">
                        {item?.user.name}
                      </TableCell>
                    )}
                      <TableCell component="th" scope="row">
                      {item?.identityNumber}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item?.agencyNumber}
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      {formatDate(item?.createdAt)}
                    </TableCell>
                    <TableCell align="right">
                      {formatDate(item?.expireAt)}
                    </TableCell>

                    <TableCell align="right">
                      {" "}
                      <File
                        href={item?.agencyAttachment}
                        type={getFileType(item?.agencyAttachment)}
                        title={t("components_users_agencies_active_index.مرفق_الوكالة")}
                      />
                    </TableCell>
                    {/* <TableCell align="right">
                      <Typography
                        sx={{
                          ...setStatusStyle(t("components_users_agencies_active_index.نشط")),
                        }}
                      >
                        {" نشط"}
                      </Typography> */}
                    {/* </TableCell> */}
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
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
                          text={t("components_users_agencies_active_index.تعطيل_الوكالة")}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <NoData
                      img="/images/icons/no-agency.svg"
                      desc={t("components_users_agencies_active_index.لا_يوجد_وكالات_نشطة")}
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
              >{t("components_users_agencies_active_index.من")}</Typography>
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
