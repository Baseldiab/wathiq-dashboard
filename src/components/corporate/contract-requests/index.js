import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import NoCorporate from "../no-corporate";
import { useDispatch, useSelector } from "react-redux";
import {
  buildQueryParams,
  formatDate,
  hasRole,
  setStatusStyle,
} from "@/services/utils";
import {
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
import NoData from "@/components/no-data";
import constants from "@/services/constants";
import { styles } from "@/components/globalStyle";
export default function ContractRequests() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const {
    pendingProviders,
    loadingPending,
    requestProvider,
    loadingRequestProvider,
    reload,
  } = useSelector((state) => state.provider);
  const { data: profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!pendingProviders && hasRole("manage provider requests")) {
      dispatch(
        getAllProvidersRequests(buildQueryParams({ status: "pending", page }))
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (pendingProviders) {
      setPage(pendingProviders?.pagination?.currentPage);
      setTotalCount(pendingProviders?.pagination?.totalPages);
    }
  }, [pendingProviders]);

  const handlePaginationChange = (e, currentPage) => {
    setPage(currentPage);
    dispatch(
      getAllProvidersRequests(
        buildQueryParams({ status: "pending", page: currentPage })
      )
    );
  };
  const handleCorporateDetails = async (id) => {
    // dispatch(providerStatus("pending"));
    if (requestProvider?.data._id != id) {
      let response = await dispatch(getProviderRequest(id));
      if (response?.meta?.requestStatus === "fulfilled") {
        router.push(`/corporate-management/request-details/${id}`);
      }
    } else {
      router.push(`/corporate-management/request-details/${id}`);
    }
  };
  if (loadingPending || loadingRequestProvider) return <Loader open={true} />;
  return (
    <Box>
      {hasRole("manage provider requests") && (
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
                      "components_corporate_contract-requests_index.إسم_الشركة"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {t(
                      "components_corporate_contract-requests_index.تاريخ_إرسال_الطلب"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {t(
                      "components_corporate_contract-requests_index.معتمد_من_إنفاذ"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {t("components_corporate_contract-requests_index.المفوض")}
                  </TableCell>
                  <TableCell align="right">
                    {t("components_corporate_contract-requests_index.الحالة")}
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingProviders?.data?.length > 0 ? (
                  pendingProviders?.data.map((item) => (
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
                          ? t(
                              "components_corporate_contract-requests_index.نعم"
                            )
                          : t(
                              "components_corporate_contract-requests_index.لا"
                            )}
                      </TableCell>
                      <TableCell align="right">{item?.user?.name}</TableCell>

                      <TableCell align="right">
                        <Typography
                          sx={{
                            ...setStatusStyle(
                              t(
                                "components_corporate_contract-requests_index.تحت_الإجراء"
                              )
                            ),
                          }}
                        >
                          {t(
                            "components_corporate_contract-requests_index.تحت_الإجراء"
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
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
                            مراجعة الطلب{" "}
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
                          "components_corporate_contract-requests_index.لا_يوجد_شركات"
                        )}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {pendingProviders?.data?.length > 0 && (
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
                  {t("components_corporate_contract-requests_index.من")}
                </Typography>
                <Typography
                  sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}
                >
                  {pendingProviders?.pagination?.resultCount}
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
    </Box>
  );
}
