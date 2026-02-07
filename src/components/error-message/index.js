import * as React from "react";
import { Typography } from "@mui/material";

export default function ErrorMsg({ message }) {
  return (
    <Typography sx={{ color: "red", fontSize: "0.7rem", my: 1 }}>
      {message}
    </Typography>
  );
}
