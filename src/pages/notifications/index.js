import Loader from "@/components/loader";
import Notifications from "@/components/notification";
import BasicPagination from "@/components/pagination";
import { getnotificationsPerPage } from "@/Redux/slices/notificationsSlice";
import { buildQueryParams } from "@/services/utils";
import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function index() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const { notifications, loading } = useSelector(
    (state) => state.notifications
  );
  const notificationsdata = notifications?.data;
  const pagination = notifications?.pagination;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getnotificationsPerPage(buildQueryParams({ limit: 6, page })));
  }, [dispatch]);
  useEffect(() => {
    if (notifications) {
      setPage(pagination.currentPage);

      setTotalPages(pagination.totalPages);
    }
  }, [notifications]);

  const handlePaginationChange = (_event, newPage) => {
    dispatch(
      getnotificationsPerPage(buildQueryParams({ limit: 6, page: newPage }))
    );
    setPage(newPage);
  };

  if (loading) return <Loader open={true} />;

  return (
    <>
      <Container sx={{ height: "100%" }}>
        <Notifications />
      </Container>
      {notificationsdata?.length > 0 && (
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
          <BasicPagination
            handleChange={handlePaginationChange}
            page={page}
            count={totalPages}
          />
        </Box>
      )}{" "}
    </>
  );
}
