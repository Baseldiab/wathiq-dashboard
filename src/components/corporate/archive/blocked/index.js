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
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getAllProviders, getProvider } from "@/Redux/slices/providerSlice";
import { getAllRoles } from "@/Redux/slices/roleSlice";
import Loader from "@/components/loader";
import { useRouter } from "next/router";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import CustomButton from "@/components/button";
import NoCorporate from "../../no-corporate";
import NoData from "@/components/no-data";
import constants from "@/services/constants";

export default function Blocked() {
  const { t } = useTranslation();
  const { blockedProviders, loading, loadingBlocked, errorBlocked } =
    useSelector((state) => state.provider);
  const { data: profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (
      !blockedProviders &&
      // profile?.data?.type === "admin" &&
      hasRole("get providers")
    )
      dispatch(getAllProviders(buildQueryParams({ status: "blocked" })));
  }, []);

  const handleCorporateDetails = async (id) => {
    if (blockedProviders?.data?._id != id) {
      let response = await dispatch(getProvider(id));
      if (response?.meta?.requestStatus === "fulfilled") {
        router.push(`/corporate-management/details/${id}`);
      }
    } else {
      router.push(`/corporate-management/details/${id}`);
    }
  };
  if (loadingBlocked) return <Loader open={true} />;
  if (errorBlocked) return <>404</>;

  return (
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
            <TableCell>{t("components_corporate_archive_blocked_index.إسم_الشركة")}</TableCell>
            <TableCell align="rigth">{t("components_corporate_archive_blocked_index.تاريخ_الحظر")}</TableCell>
            <TableCell align="right">{t("components_corporate_archive_blocked_index.معتمد_من_إنفاذ")}</TableCell>
            <TableCell align="right">{t("components_corporate_archive_blocked_index.المفوض")}</TableCell>
            <TableCell align="right">{t("components_corporate_archive_blocked_index.الحالة")}</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blockedProviders?.data?.length > 0 ? (
            blockedProviders?.data.map((item) => (
              <TableRow
                key={item._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item?.companyName}
                </TableCell>
                <TableCell align="right">
                  {" "}
                  {formatDate(item?.status?.blockedAt)}
                </TableCell>
                <TableCell align="right">
                  {item?.approvedByNafath == true ? t("components_corporate_archive_blocked_index.نعم") : t("components_corporate_archive_blocked_index.لا")}
                </TableCell>{" "}
                <TableCell align="right">{item?.name}</TableCell>
                <TableCell align="right">
                  <Typography
                    sx={{
                      ...setStatusStyle(t("components_corporate_archive_blocked_index.محظورة")),
                    }}
                  >
                    {t("components_corporate_archive_blocked_index.محظورة")}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      gap: "24px",
                      justifyContent: "end",
                      ml: 2,
                    }}
                  >
                    <Typography
                      onClick={() => handleCorporateDetails(item._id)}
                      sx={{
                        ...styles.detailsBtnTable,
                      }}
                    >{t("components_corporate_archive_blocked_index.التفاصيل")}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <NoData img="images/no-corporate.svg" desc={t("components_corporate_archive_blocked_index.لا_يوجد_شركات")} />{" "}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
