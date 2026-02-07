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
  getAnalysisProvider,
  getProvider,
  handleAccepted,
  handleReload,
} from "@/Redux/slices/providerSlice";
import { getAllRoles } from "@/Redux/slices/roleSlice";
import Loader from "@/components/loader";
import { useRouter } from "next/router";
import NoData from "@/components/no-data";
import constants from "@/services/constants";
import { styles } from "@/components/globalStyle";
export default function Contracts() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const {
    approvedProviders,
    loadingApproved,
    provider,
    providerLoading,
    reload,
  } = useSelector((state) => state.provider);
  const { data: profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!approvedProviders && hasRole("get providers")) {
      dispatch(getAllProviders(buildQueryParams({ status: "approved", page })));
    }
  }, [dispatch]);

  useEffect(() => {
    // Update pagination state when approvedProviders data is available
    if (approvedProviders) {
      setPage(approvedProviders?.pagination?.currentPage);
      setTotalCount(approvedProviders?.pagination?.totalPages);
    }
  }, [approvedProviders]);

  const handlePaginationChange = (e, currentPage) => {
    setPage(currentPage);
    dispatch(
      getAllProviders(
        buildQueryParams({ status: "approved", page: currentPage })
      )
    );
    // dispatch(handleReload());
  };

  const handleCorporateDetails = async (id) => {
    if (provider?.data?._id != id) {
      dispatch(getAnalysisProvider(id));
      let response = await dispatch(getProvider(id));

      if (response?.meta?.requestStatus === "fulfilled") {
        router.push(`/corporate-management/details/${id}`);
      }
    } else {
      router.push(`/corporate-management/details/${id}`);
    }
  };

  if (loadingApproved || providerLoading) return <Loader open={true} />;
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
                  <TableCell>{t("components_corporate_contracting-corporates_index.إسم_الشركة")}</TableCell>
                  <TableCell align="right">{t("components_corporate_contracting-corporates_index.تاريخ_الانضمام")}</TableCell>
                  <TableCell align="right">{t("components_corporate_contracting-corporates_index.معتمد_من_إنفاذ")}</TableCell>
                  <TableCell align="right">{t("components_corporate_contracting-corporates_index.المفوض")}</TableCell>
                  <TableCell align="right">{t("components_corporate_contracting-corporates_index.الحالة")}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedProviders?.data?.length > 0 ? (
                  approvedProviders?.data.map((item) => (
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
                        {item?.approvedByNafath == true ? t("components_corporate_contracting-corporates_index.نعم") : t("components_corporate_contracting-corporates_index.لا")}
                      </TableCell>
                      <TableCell align="right">{item?.name}</TableCell>

                      <TableCell align="right">
                        <Typography
                          sx={{
                            ...setStatusStyle(t("components_corporate_contracting-corporates_index.نشط")),
                          }}
                        >
                          {t("components_corporate_contracting-corporates_index.نشط")}
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
                          >{t("components_corporate_contracting-corporates_index.التفاصيل")}</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <NoData
                        img="images/no-corporate.svg"
                        desc={t("components_corporate_contracting-corporates_index.لا_يوجد_شركات")}
                        btnTitle={t("components_corporate_contracting-corporates_index.إضافة_شركة")}
                        onClick={() =>
                          router.push("/corporate-management/create-provider")
                        }
                        add
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {approvedProviders?.data?.length > 0 && (
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
                >{t("components_corporate_contracting-corporates_index.من")}</Typography>
                <Typography
                  sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}
                >
                  {approvedProviders?.pagination?.resultCount}
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
