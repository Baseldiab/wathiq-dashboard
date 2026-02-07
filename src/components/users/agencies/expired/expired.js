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
import { getAllagencies } from "@/Redux/slices/agenciesSlice";
import File from "@/components/file";
import NoData from "@/components/no-data";

export default function Expired({ user }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const dispatch = useDispatch();

  const {
    agencies_ExpiredData,
    agencies_ExpiredLoading,
    agencies_ExpiredError,
    agencies_ExpiredData_spacific_user,
    agencies_ExpiredLoading_spacific_user,
    agencies_ExpiredError_spacific_user,
  } = useSelector((state) => state.agencies);
  const { selectedUser } = useSelector((state) => state.user);
  const Data = user ? agencies_ExpiredData_spacific_user : agencies_ExpiredData;
  // useEffect(() => {
  //   dispatch(getAllagencies(buildQueryParams({ expired: true, page })));
  // }, []);
  useEffect(() => {
    user &&
      dispatch(
        getAllagencies(
          buildQueryParams({
            expired: true,
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
                expired: true,
                page,
                user: selectedUser?.data?._id,
              })
            )
          )
        : dispatch(getAllagencies(buildQueryParams({ expired: true, page })));
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
              expired: true,
              page: currentPage,
              user: selectedUser?.data?._id,
            })
          )
        )
      : dispatch(
          getAllagencies(buildQueryParams({ expired: true, page: currentPage }))
        );
    // dispatch(
    // getAllagencies(buildQueryParams({ expired: true, page: currentPage }))
    // );
  };

  if (agencies_ExpiredLoading) return <Loader open={true} />;
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
                {!user && <TableCell align="right">{t("components_users_agencies_expired_expired.إسم_المستخدم")}</TableCell>}{" "}
                <TableCell align="right">{t("components_users_agencies_expired_expired.إسم_الوكاله")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_expired_expired.رقم_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_expired_expired.تاريخ_إصدار_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_expired_expired.تاريخ_إنتهاء_الوكالة")}</TableCell>
                <TableCell align="right">{t("components_users_agencies_expired_expired.مرفق_الوكالة")}</TableCell>
                {/* <TableCell align="right">{t("components_users_agencies_expired_expired.الحالة")}</TableCell> */}
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
                        {item?.user?.name}
                      </TableCell>
                    )}
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
                        title={t("components_users_agencies_expired_expired.مرفق_الوكالة")}
                      />
                    </TableCell>
                    {/* <TableCell align="right">
                      <Typography
                        sx={{
                          ...setStatusStyle(t("components_users_agencies_expired_expired.منتهي")),
                        }}
                      >
                        {t("components_users_agencies_expired_expired.منتهي")}
                      </Typography>
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <NoData
                      img="/images/icons/no-agency.svg"
                      desc={t("components_users_agencies_expired_expired.لا_يوجد_وكالات_منتهية")}
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
              >{t("components_users_agencies_expired_expired.من")}</Typography>
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
          </Box>
        )}
      </>
    </Box>
  );
}
