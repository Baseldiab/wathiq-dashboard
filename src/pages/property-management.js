import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Backdrop,
} from "@mui/material";
import { getAllContactUs } from "@/Redux/slices/supportSlice";
import Pagination from "@/components/pagination";
import Loader from "@/components/loader";
import NoData from "@/components/no-data";
import CustomButton from "@/components/button";
import { buildQueryParams, formatDate } from "@/services/utils";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { styles } from "@/components/globalStyle";
import CustomSnackbar from "@/components/toastMsg";
import constants from "@/services/constants";
import { getAllProperty } from "@/Redux/slices/property-management";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import Input from "@/components/inputs";
import FilterMenu from "@/components/filter-menu";

export default function PropertyManagment() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [alertOpen, setAlertOpen] = useState(false);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const { allPropertyData, allPropertyLoading } = useSelector(
    (state) => state.property
  );

  useEffect(() => {
    dispatch(getAllProperty(`page=${page}`));
  }, []); 

  const contactList = allPropertyData?.data || [];
  const pagination = allPropertyData?.pagination;

  useEffect(() => {
    if (pagination?.currentPage) setPage(pagination.currentPage);
    if (pagination?.totalPages) setTotalPages(pagination.totalPages);
  }, [pagination]);

  const handlePaginationChange = (_event, newPage) => {
    setPage(newPage);
  };

  if (allPropertyLoading) return <Loader open={true} />;

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const showBackDropContent = () => {
    if (!selectedItem) return null;
    return (
      <Box sx={{ ...styles.popupContainer, alignItems: "start" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("page_property.وصف_العقار")}
        </Typography>
        <Typography sx={{ mb: 3, wordBreak: "break-word" }}>
          {selectedItem?.description}
        </Typography>
        <Box
          sx={{
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
            text={t("page_property.إغلاق")}
            type="close"
          />
        </Box>
      </Box>
    );
  };

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleSubmitFilter = () => {
    handleCloseMenu();
    dispatch(getAllProperty(buildQueryParams({ ...filterData, page: 1 })));
    setPage(1);
  };
  const handleFilterChange = (value, name) => {
    setFilterData({ ...filterData, [name]: value });
  };
  const handleResetData = () => {
    setFilterData({});
    dispatch(getAllProperty(buildQueryParams({ page: 1 })));
    setPage(1);
    handleCloseMenu();
  };

  return (
    <>
      <Head>
        <title>{t("page_property.إدارة_الأملاك")}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Typography
        sx={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#202726",
          mb: { xs: "16px", md: "24px" },
        }}
      >
        {t("page_property.إدارة_الأملاك")}
      </Typography>

      <Box
        sx={{
          bgcolor: constants.colors.light_grey,
          padding: "20px",
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "8px",
            borderRadius: "12px",
            padding: "8px",
            fontWeight: 700,
          }}
        >
          <Typography
            sx={{
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "#202726",
              my: { xs: "16px" },
            }}
          >
            {t("page_property.طلبات_إدارة_الأملاك")}
          </Typography>

          {/* <Box
            id="basic-button"
            aria-controls={menuOpen ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
          >
            <CustomButton
              customeStyle={{
                background: "#FFFFFF",
                border: "1px solid #D6D9E1",
                color: "#202726",
                "&:hover": {
                  background: "#FFFFFF",
                  border: "1px solid #D6D9E1",
                  boxShadow: "none",
                },
              }}
              handleClick={handleOpenMenu}
              text={t("page_property.تصفية")}
              type="filter"
            />

            <FilterMenu
              anchorEl={anchorEl}
              menuOpen={menuOpen}
              handleCloseMenu={handleCloseMenu}
              title={t("page_property.تصفية")}
              onCloseIconClick={handleCloseMenu}
              handleSubmitFilter={handleSubmitFilter}
              handleResetData={handleResetData}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Input
                  label={t("page_property.الحي")}
                  placeholder={t("page_property.إدخل_الاسم")}
                  handleChange={handleFilterChange}
                  value={filterData?.neighborhood || ""}
                  name="neighborhood"
                  customStyle={{ width: "100%" }}
                />
              </Box>
            </FilterMenu>
          </Box> */}
        </Box>

        <TableContainer
          sx={{
            textAlign: "right",
            boxShadow: "none",
            border: "1px solid #D6D9E1",
            borderRadius: "12px",
            display: "block",
          }}
        >
          <Table sx={{ minWidth: "100%" }} aria-label="auction table">
            <TableHead>
              <TableRow>
                <TableCell>{t("page_property.الإسم_بالكامل")}</TableCell>
                <TableCell align="right">
                  {t("page_property.رقم_الجوال")}
                </TableCell>
                <TableCell align="right">
                  {t("page_property.تاريخ_استقبال_الطلب")}
                </TableCell>
                <TableCell align="right">
                  {t("page_property.نوع_العقار")}
                </TableCell>
                <TableCell align="right">
                  {t("page_property.فئة_العقار")}
                </TableCell>
                <TableCell align="right">
                  {t("page_property.المدينة")}
                </TableCell>
                <TableCell align="right">{t("page_property.الحي")}</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {contactList?.length > 0 ? (
                contactList.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name || "—"}</TableCell>

                    <TableCell sx={{ direction: "ltr" }}>
                      {item.phoneNumber.key}
                      {item.phoneNumber.number}
                    </TableCell>

                    <TableCell align="right">
                      {formatDate(item.createdAt) || "—"}
                    </TableCell>

                    <TableCell align="right">
                      {item?.propertyType || "—"}
                    </TableCell>

                    <TableCell align="right">
                      {item?.propertyCategory || "—"}
                    </TableCell>

                    <TableCell align="right">{item?.city || "—"}</TableCell>

                    <TableCell align="right">
                      {item?.neighborhood || "—"}
                    </TableCell>

                    <TableCell align="right">
                      <Box
                        component="a"
                        href={`https://wa.me/${item.phoneNumber.key}${item.phoneNumber.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          cursor: "pointer",
                        }}
                      >
                        <WhatsAppIcon sx={{ color: constants.colors.main }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <NoData desc={t("page_property.لا_توجد_رسائل")} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {contactList.length > 0 && (
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
                {t("page_property.من")}
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
              count={totalPages}
            />
          </Box>
        )}
      </Box>

      <Backdrop open={open} onClick={handleClose} sx={{ zIndex: "99" }}>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            maxHeight: "85%",
            overflow: "auto",
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: 3,
            width: { xs: "90%", sm: "80%", md: "60%", lg: "45%", xl: "30%" },
          }}
        >
          {showBackDropContent()}
        </Box>
      </Backdrop>

      <CustomSnackbar
        message={alert.msg}
        open={alertOpen}
        setOpen={setAlertOpen}
        type={alert.type}
      />
    </>
  );
}
