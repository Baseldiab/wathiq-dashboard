import * as React from "react";
import Backdrop from "@mui/material/Backdrop";

export default function CustomBackdrop({
  open = false,
  setOpen,
  handleClose,
  handleOpen,
  component,
}) {
  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        {component}
      </Backdrop>
    </div>
  );
}
