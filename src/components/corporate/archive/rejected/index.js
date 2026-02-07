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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  getAllProviders,
  getAllProvidersRequests,
  getProvider,
  getProviderRequest,
  handleReload,
} from "@/Redux/slices/providerSlice";
import { getAllRoles } from "@/Redux/slices/roleSlice";
import Loader from "@/components/loader";
import { useRouter } from "next/router";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import CustomButton from "@/components/button";
import NoCorporate from "../../no-corporate";
import BasicPagination from "@/components/pagination";
import constants from "@/services/constants";
import Input from "@/components/inputs";
import NoData from "@/components/no-data";
import PopupTitle from "@/components/popup-title";
export default function Rejected() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const {
    rejectedProviders,
    loadingPending,
    requestProvider,
    loadingRequestProvider,
    loadingRejected,
  } = useSelector((state) => state.provider);
  const { data: profile } = useSelector((state) => state.profile);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleOpen = (provider) => {
    setSelectedProvider(provider);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //   useEffect(() => {
  //     if (
  //       (!rejectedProviders || reload) &&
  //       hasRole("get providers") &&
  //       page !== 1
  //     ) {
  //       dispatch(
  //         getAllProvidersRequests(buildQueryParams({ status: "pending", page }))
  //       );
  //     }
  //   }, [dispatch, page, reload]);

  useEffect(() => {
    if (rejectedProviders) {
      setPage(rejectedProviders?.pagination?.currentPage);
      setTotalCount(rejectedProviders?.pagination?.totalPages);
    }
  }, [rejectedProviders]);
  useEffect(() => {
    if (
      !rejectedProviders &&
      // profile?.data?.type === "admin" &&
      hasRole("manage provider requests")
    )
      dispatch(
        getAllProvidersRequests(buildQueryParams({ status: "rejected", page }))
      );
  }, []);

  const handlePaginationChange = (e, currentPage) => {
    setPage(currentPage);
    dispatch(
      getAllProvidersRequests(
        buildQueryParams({ status: "rejected", page: currentPage })
      )
    );
  };
  const handleCorporateDetails = async (id) => {
    if (requestProvider?.data._id != id) {
      let response = await dispatch(getProviderRequest(id));
      if (response?.meta?.requestStatus === "fulfilled") {
        router.push(`/corporate-management/request-details/${id}`);
      }
    } else {
      router.push(`/corporate-management/request-details/${id}`);
    }
  };

  if (loadingPending || loadingRequestProvider || loadingRejected)
    return <Loader open={true} />;
  return (
    <Box>
      {hasRole("get providers") && (
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
                  <TableCell>
                    {t(
                      "components_corporate_archive_rejected_index.إسم_الشركة"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {t(
                      "components_corporate_archive_rejected_index.تاريخ_إرسال_الطلب"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {t(
                      "components_corporate_archive_rejected_index.معتمد_من_إنفاذ"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {t("components_corporate_archive_rejected_index.المفوض")}
                  </TableCell>
                  <TableCell align="right">
                    {t("components_corporate_archive_rejected_index.الحالة")}
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedProviders?.data?.length > 0 ? (
                  rejectedProviders?.data.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {item?.companyName}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        {formatDate(item?.createdAt)}
                      </TableCell>
                      <TableCell align="right">
                        {item?.approvedByNafath == true
                          ? t("components_corporate_archive_rejected_index.نعم")
                          : t("components_corporate_archive_rejected_index.لا")}
                      </TableCell>
                      <TableCell align="right">{item?.user?.name}</TableCell>

                      <TableCell align="right">
                        <Typography
                          sx={{
                            ...setStatusStyle(
                              t(
                                "components_corporate_archive_rejected_index.مرفوض"
                              )
                            ),
                          }}
                        >
                          {t(
                            "components_corporate_archive_rejected_index.مرفوضة"
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            ...styles.tableActionRow,
                          }}
                        >
                          <Typography
                            onClick={() => handleCorporateDetails(item?._id)}
                            sx={{
                              ...styles.detailsBtnTable,
                            }}
                          >
                            {t(
                              "components_corporate_archive_rejected_index.التفاصيل"
                            )}
                          </Typography>
                          <Typography
                            onClick={() => handleOpen(item)}
                            sx={{
                              ...styles.detailsBtnTable,
                              border: "1px solid #202726",
                              color: "#202726",
                            }}
                          >
                            سبب الرفض{" "}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <NoData
                        img="images/no-corporate.svg"
                        desc={t(
                          "components_corporate_archive_rejected_index.لا_يوجد_شركات"
                        )}
                      />{" "}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {rejectedProviders?.data?.length > 0 && (
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
                  {t("components_corporate_archive_rejected_index.من")}
                </Typography>
                <Typography
                  sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}
                >
                  {rejectedProviders?.pagination?.resultCount}
                </Typography>
              </Box>

              <BasicPagination
                handleChange={handlePaginationChange}
                page={page}
                count={totalCount}
              />
            </Box>
          )}
          <Backdrop open={open} onClick={handleClose}>
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
              <Box sx={{ alignItems: "start" }}>
                <PopupTitle
                  title={t(
                    "components_corporate_archive_rejected_index.سبب_الرفض"
                  )}
                  handleClose={handleClose}
                />

                <Typography sx={{ fontSize: "1rem", color: "#6F6F6F" }}>
                  {selectedProvider?.status.reason}{" "}
                </Typography>
              </Box>{" "}
            </Box>
          </Backdrop>
        </>
      )}
    </Box>
  );
}
