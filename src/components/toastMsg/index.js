import * as React from "react";
import Box from "@mui/material/Box";
import { Snackbar, Alert } from "@mui/material";

export default function CustomSnackbar({
  message,
  open,
  setOpen,
  type = "error",
  noDuration = false,
}) {
  const handleClose = () => {
    setOpen(false);
  };
  console.log("meee", message);

  return (
    <Box sx={{ maxWidth: { xs: 350, md: 500 } }}>
      <Snackbar
        // autoHideDuration={4000}
        autoHideDuration={noDuration ? null : 4000} // Set null if noDuration is true
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        onClose={handleClose}
        key={"top" + "center"}
        sx={{ zIndex: "999" }}
      >
        <Alert
          onClose={handleClose}
          severity={type}
          variant="filled"
          sx={{
            width: "100%",
            "& .MuiAlert-message": { fontSize: "0.9rem" },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
