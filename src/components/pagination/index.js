import * as React from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import constants from "@/services/constants";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

export default function BasicPagination({ handleChange, page = 1, count }) {
  return (
    <Stack spacing={2}>
      <Pagination
        count={count}
        sx={{
          "& .MuiPaginationItem-root": {
            padding: "16px",
            borderRadius: "16px",
            fontSize: "1rem",
            color: "#161008",
            width: { xs: "30px", md: "42px" },
            height: { xs: "30px", md: "42px" },
            border: "1px solid #D6D9E1",
          },
          "& .MuiPaginationItem-root:hover": {
            background: "transparent",
          },

          "& .Mui-selected": {
            backgroundColor: `${constants.colors.main} !important`,
            border: `1px solid ${constants.colors.main}`,
            color: "#fff",
          },
          "& .Mui-selected:hover": {
            backgroundColor: "transparent",
            border: `1px solid ${constants.colors.dark_grey}`,
            color: constants.colors.dark_black,
          },
        }}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            components={{
              previous: ArrowRightIcon,
              next: ArrowLeftIcon,
            }}
          />
        )}
        page={page}
        onChange={handleChange}
      />
    </Stack>
  );
}
