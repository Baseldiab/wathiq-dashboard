import React from "react";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { Box, Typography } from "@mui/material";

export default function EnrolledCount({ status, count }) {
  let color;
  if (status == "in_progress") {
    color = "#BD7611";
  } else if (status == "on_going") {
    color = "#039754";
  } else if (status == "completed") {
    color = "#09BB72";
  }
  return (
    <Box
      sx={{
        color: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        padding: "0px 16px 0px 24px",
        my: "0px",
        height: "100%",
      }}
    >
      {status == "completed" ? (
        <Box
          sx={{
            // bgcolor: "#EEF9E8",
            padding: "12px 16px",
            borderRadius: "12px",
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "1.25rem" }}>{count}</Typography>

          <Box
            component="img"
            src="/images/icons/up.svg"
            // sx={{ width: "16px", height: "24px" }}
          />
        </Box>
      ) : (
        <>
          <Typography sx={{ fontSize: "1.25rem",fontWeight:"bold" }}>{count}</Typography>
          <GroupsOutlinedIcon sx={{ fontSize: 32 }} />
        </>
      )}
    </Box>
  );
}
