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
import { formatDate } from "@/services/utils";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { styles } from "@/components/globalStyle";
import CustomSnackbar from "@/components/toastMsg";
import { getAllRealEstate } from "@/Redux/slices/userSlice";
import constants from "@/services/constants";

export default function AuctionsRequest() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [alertOpen, setAlertOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { allRealEstateData, allRealEstateLoading, sallRealEstateDataError } =
    useSelector((state) => state.user);
  useEffect(() => {
    // if (!supportData) {
    dispatch(getAllRealEstate(`page=${page}`));
    // }
  }, []);

  const contactList = allRealEstateData?.data || [];
  const pagination = allRealEstateData?.pagination;

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
  if (allRealEstateLoading) {
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
        <Typography variant="h6" sx={{ mb: 2 }}>
          وصف العقار{" "}
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
            text="إغلاق"
            type="close"
          />
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box>
        <>
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
                  <TableCell> الإسم بالكامل</TableCell>
                  <TableCell align="right">رقم الجوال</TableCell>
                  <TableCell align="right">المساحة</TableCell>
                  <TableCell align="right">المدينة</TableCell>
                  <TableCell align="right">الحي</TableCell>
                  <TableCell align="right">العقار مقيم</TableCell>
                  <TableCell align="right">وصف العقار</TableCell>
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

                      <TableCell align="right">{item.area || "—"}</TableCell>

                      <TableCell align="right">{item?.city || "—"}</TableCell>
                      <TableCell align="right">
                        {item?.neighborhood || "—"}
                      </TableCell>
                      <TableCell align="right">
                        {item?.certified == true ? "نعم" : "لا" || "—"}
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
                              textDecoration: "underline",
                              color: constants.colors.main,
                              cursor: "pointer",
                            }}
                          >
                            إظهار الوصف
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        {/* WhatsApp link icon */}
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
                    <TableCell colSpan={5} align="center">
                      <NoData
                        // img="images/empty.svg"
                        desc="لا توجد رسائل"
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
                >
                  من
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
