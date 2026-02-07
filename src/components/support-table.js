import { useTranslation } from "next-i18next";
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
import { styles } from "./globalStyle";
import CustomSnackbar from "./toastMsg";
import { buildQueryParams, formatDate, HtmlRenderer } from "@/services/utils";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import constants from "@/services/constants";
import PopupTitle from "./popup-title";
import FilterMenu from "./filter-menu";
import Input from "./inputs";

export default function SupportTable({ supportType, supportTypear }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // if your API returns total pages
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [alertOpen, setAlertOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const {
    data: supportData,
    loading: supportLoading,
    error: supportError,
  } = useSelector((state) => {
    return state.support.entities[supportType] || {};
  });

  useEffect(() => {
    // if (!supportData) {
    console.log("type", `type=${supportType}&page=${page}`);

    dispatch(getAllContactUs(`type=${supportType}&page=${page}`));
    // }
  }, [supportType, page]);

  const contactList = supportData?.data || [];
  const pagination = supportData?.pagination;
  console.log("contactList", contactList);
  useEffect(() => {
    if (pagination?.currentPage) {
      setPage(pagination.currentPage);
    }
    if (pagination?.totalPages) {
      setTotalPages(pagination.totalPages);
    }
  }, [pagination]);

  const handlePaginationChange = (_event, newPage) => {
    setPage(newPage);
  };
  if (supportLoading && !contactList?.length) {
    return <Loader open={true} />;
  }

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
        <PopupTitle title={t("components_support-table.الرسالة")} handleClose={handleClose}></PopupTitle>
        <Typography sx={{ mb: 3, wordBreak: "break-word" }}>
          <HtmlRenderer html={selectedItem?.message} />
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
            width: "100%",
          }}
        ></Box>
      </Box>
    );
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSubmitFilter = () => {
    handleCloseMenu();
    dispatch(
      getAllContactUs(
        buildQueryParams({ ...filterData, type: supportType, page: 1 })
      )
    );
    setPage(1); // reset pagination to first page when filter is applied
  };

  // ✅ handleResetData المعدل:
  const handleResetData = () => {
    setFilterData({});
    dispatch(getAllContactUs(buildQueryParams({ type: supportType, page: 1 })));
    setPage(1);
    handleCloseMenu();
  };

  const handleFilterChange = (value, name) => {
    setFilterData({ ...filterData, [name]: value });
  };

  return (
    <>
      <Box
        sx={{
          // minHeight: "350px",
          bgcolor: constants.colors.light_grey,
          padding: "20px",
          borderRadius: "20px",
          // width: "100%",
          // display: "flex",
          // flexDirection: "column",
        }}
      >
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent:"space-between",
              // width: "fit-content",
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
              {supportTypear}
            </Typography>
            <Box
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
                text="تصفية"
                type="filter"
              />
              <FilterMenu
                anchorEl={anchorEl}
                menuOpen={menuOpen}
                handleCloseMenu={handleCloseMenu}
                title="تصفية"
                onCloseIconClick={handleCloseMenu}
                handleSubmitFilter={handleSubmitFilter}
                handleResetData={handleResetData}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Input
                    label="البريد الالكتروني"
                    placeholder="إدخل الاسم "
                    handleChange={handleFilterChange}
                    value={filterData?.email || ""}
                    name="email"
                    customStyle={{ width: "100%" }}
                  />

                  <Input
                    label="من تاريخ التسجيل"
                    placeholder="من تاريخ التسجيل"
                    value={filterData?.["createdAt[from]"] || ""}
                    handleChange={handleFilterChange}
                    type="date"
                    name="createdAt[from]"
                    customStyle={{ width: "100%" }}
                  />

                  <Input
                    label="إلى تاريخ التسجيل"
                    placeholder="إلى تاريخ التسجيل"
                    value={filterData?.["createdAt[to]"] || ""}
                    handleChange={handleFilterChange}
                    type="date"
                    name="createdAt[to]"
                    customStyle={{ width: "100%" }}
                  />
                </Box>
              </FilterMenu>
            </Box>{" "}
          </Box>
          <TableContainer
            sx={{
              textAlign: "right",
              boxShadow: "none",
              border: "1px solid #D6D9E1",
              borderRadius: "12px",
              display: "block",
              // bgcolor: "#ffffff",
            }}
          >
            <Table sx={{ minWidth: "100%" }} aria-label="auction table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("components_support-table.إسم_المستخدم")}</TableCell>
                  <TableCell align="right">{t("components_support-table.رقم_الجوال")}</TableCell>
                  <TableCell align="right">{t("components_support-table.البريد_الالكتروني")}</TableCell>
                  <TableCell align="right">{t("components_support-table.تاريخ_الإرسال")}</TableCell>
                  {/* <TableCell align="right"></TableCell> */}
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

                      <TableCell align="right">{item.email || "—"}</TableCell>

                      <TableCell align="right">
                        {formatDate(item?.createdAt)}
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            gap: "24px",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            onClick={() => handleOpen(item)}
                            sx={{
                              ...styles.detailsBtnTable,
                            }}
                          >
                            الرسالة{" "}
                          </Typography>
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
                            <WhatsAppIcon
                              sx={{ color: constants.colors.main }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <NoData
                        // img="images/empty.svg"
                        desc={t("components_support-table.لا_توجد_رسائل")}
                        // If you want a button to do something, pass `btnTitle`, `onClick`, etc.
                        // btnTitle="..."
                        // onClick={() => ...}
                      />
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
                >{t("components_support-table.من")}</Typography>
                <Typography
                  sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}
                >
                  {pagination?.totalPages}
                </Typography>
              </Box>
              <Pagination
                handleChange={handlePaginationChange}
                page={page}
                count={totalPages}
              />
            </Box>
          )}
        </>
        <Backdrop open={open} onClick={handleClose} sx={{ zIndex: "99" }}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxHeight: "85%",
              overflow: "auto",
              bgcolor: "white",
              borderRadius: "12px",
              // padding: "20px",
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
        <CustomSnackbar
          message={alert.msg}
          open={alertOpen}
          setOpen={setAlertOpen}
          type={alert.type}
        />
      </Box>
    </>
  );
}
