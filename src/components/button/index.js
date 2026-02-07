import constants from "@/services/constants";
import Button from "@mui/material/Button";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Box } from "@mui/material";
export default function CustomButton({
  handleClick,
  disabled = false,
  text,
  customeStyle = {},
  type,
  transparentBtn = false,
  smallIcon,
}) {
  const getIcon = () => {
    switch (type) {
      case "user":
        return (
          <PersonOutlineOutlinedIcon sx={{ ml: 0.8, textAlign: "center" }} />
        );
      case "add":
        return transparentBtn ? (
          <AddCircleOutlineIcon
            sx={{ ml: 1, textAlign: "center", color: constants.colors.main }}
          />
        ) : (
          <AddCircleIcon sx={{ ml: 1, textAlign: "center", color: "white" }} />
        );
      case "filter":
        return (
          <Box
            component="img"
            src="/images/icons/filter.svg"
            sx={{
              ml: 1,
              textAlign: "center",
              color: "#fff",
              width: smallIcon && "20px",
            }}
          ></Box>
        );
      // return (
      //   <TuneIcon sx={{ ml: 1, textAlign: "center", color: "#1C4F92" }} />
      // );
      case "close":
        return (
          <CloseIcon sx={{ ml: 1, textAlign: "center", color: "#6F6F6F" }} />
        );
      case "remove":
        return (
          <Box
            component="img"
            src="/images/icons/trash.svg"
            sx={{
              ml: 1,
              textAlign: "center",
              color: "#fff",
              width: smallIcon && "20px",
            }}
          ></Box>
          // <DeleteIcon sx={{ ml: 1, textAlign: "center", color: "#fff" }} />
        );
      case "edit":
        return (
          <Box
            component="img"
            src="/images/icons/edit-table.svg"
            sx={{
              ml: 1,
              textAlign: "center",
              color: "#fff",
              width: smallIcon && "20px",
            }}
          ></Box>
        );
      case "deposit":
        return (
          <Box
            component="img"
            src="/images/icons/withdraw-Icon.svg"
            sx={{
              ml: 1,
              textAlign: "center",
              color: "#fff",
              width: smallIcon && "20px",
            }}
          ></Box>
        );
      case "auctions":
        return (
          <Box
            component="img"
            src="/icons/auctions.svg"
            sx={{
              ml: 1,
              textAlign: "center",
              color: "#fff",
              width: "20px",
            }}
          ></Box>
        );
      case "send_notification":
        return (
          <Box
            component="img"
            src="/images/icons/notification-2.svg"
            sx={{
              ml: 2,
              width: "24px",
              height: "24px",

              textAlign: "center",
              filter: "brightness(0) invert(1)",
            }}
          ></Box>
        );
      default:
    }
  };
  return (
    <Button
      disabled={disabled}
      onClick={handleClick}
      variant="contained"
      sx={{
        p: "12px 16px", //
        borderRadius: "12px",
        width: "fit-content",
        // height: "3.5rem",
        // maxHeight: "56px",
        background: transparentBtn ? "transparent" : constants.colors.main,
        boxShadow: "none",
        "&:hover": {
          background: transparentBtn ? "transparent" : constants.colors.main,
          boxShadow: "none",
        },
        alignSelf: "center",
        fontSize: "16px",
        ...customeStyle,
      }}
      startIcon={type && getIcon()}
    >
      {text}
    </Button>
  );
}
