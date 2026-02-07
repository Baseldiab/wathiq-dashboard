import constants from "@/services/constants";
import { Padding } from "@mui/icons-material";

export const styles = {
  input: {
    "& .MuiOutlinedInput-root": {
      border: "1px solid #E9E9E9",
      outline: "0px",
      borderRadius: "12px", // Set your desired border radius
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: "24px",
      // padding: "3px",
      bgcolor: constants.colors.light_grey,

      color: `${constants.colors.black} !important`,
      "& fieldset": {
        borderRaduis: "12px",
        border: "1px solid #E9E9E9",
        padding: "16px",
      },
      "&:hover fieldset": {
        border: "1px solid #E9E9E9",
      },

      "&.Mui-focused fieldset": {
        border: `2px solid ${constants.colors.main}`,
      },
    },
    "& .MuiOutlinedInput-root.Mui-disabled": {
      backgroundColor: "#23614F0D", // Custom background color
      border: "1px solid #E9E9E9",

      "&:hover": {
        border: "1px solid #E9E9E9",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc",
    },

    "& .MuiInputLabel-outlined": {
      right: "30px",
      left: "unset",
    },
    "& legend": {
      width: "0",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: constants.colors.main,
    },
  },
  label: {
    fontSize: "1rem",
    color: constants.colors.black,
    mb: 1.2,
    fontFamily: "inherit",
    fontWeight: "600",
  },
  checkbox: {
    color: constants.colors.main,
    "&.Mui-checked": {
      color: constants.colors.main,
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  checkboxLabel: {
    color: "#6F6F6F",
    textDecoration: "underline",
    fontSize: "1rem",
    fontWeight: 400,
    mx: 0,
  },
  //
  outlinedInputRoot: {
    "& fieldset": {
      border: "1px solid #E9E9E9",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #E9E9E9",
    },
  },
  datePicker: {
    day: {
      sx: {
        "&.MuiPickersDay-today": {
          color: "lightgrey",
        },
        "&.Mui-selected": {
          backgroundColor: constants.colors.main,
          color: "#fff",
        },
        "&:hover": {
          color: "#fff",
          opacity: "0.4",
          backgroundColor: constants.colors.main,
        },
        "&:focus.Mui-selected": {
          backgroundColor: constants.colors.main,
          color: "#fff",
        },
        "&.Mui-current": {
          border: `5px solid ${constants.colors.main}`,
          color: "#fff",
        },
        "&.Mui-selected:hover": {
          color: "#fff",
          opacity: "0.4",
          backgroundColor: constants.colors.main,
        },
        "&.Mui-current:not(.Mui-selected)": {
          // border: `5px solid ${constants.colors.main}`,
        },
        "&:focus": {
          backgroundColor: constants.colors.main,
        },
        "&:not(.Mui-selected)": {
          border: `1px solid ${constants.colors.main}`,
        },
      },
    },
    desktopPaper: {
      sx: {
        ".MuiPickersYear-yearButton.Mui-selected": {
          backgroundColor: `${constants.colors.main} !important`,
          color: "#fff",
        },
        ".MuiPickersYear-yearButton:hover": {
          color: "#fff",
          opacity: "0.4",
          backgroundColor: constants.colors.main,
        },
        ".MuiPickersYear-yearButton:focus": {
          backgroundColor: constants.colors.main,
          color: "#fff",
        },
        ".MuiPickersYear-yearButton.Mui-selected.Mui-current": {
          backgroundColor: constants.colors.main,
          color: "#fff",
        },
      },
    },
    // timeSelection: {
    //   sx: {
    //     ".MuiMultiSectionDigitalClockSection-item.Mui-selected": {
    //       backgroundColor: constants.colors.main, // Custom selected time background
    //       color: "#fff", // Custom selected time text color
    //       borderRadius: "8px", // Optional rounded corners
    //     },
    //     ".MuiMultiSectionDigitalClockSection-item:hover": {
    //       backgroundColor: "#66BB6A", // Custom hover effect
    //     },
    //   },
    // },
  },
  InputLabelProps: {
    color: `${constants.colors.black} !important`,
    fontWeight: 400,
    right: 0,
    transformOrigin: "top right",
    backgroundColor: "white",
    
    // bgcolor: constants.colors.light_grey,
    // paddingX: !focused ? "40px" : "10px",
    paddingX: "10px",
    // color: "inherit",
    zIndex: 1,
    pointerEvents: "none",
    // position: "absolute", // Ensures label stays in position
    // left: focused ? "10px" : "50px", // Moves label to prevent overlap
    transition: "all 0.2s ease-in-out", // Smooth animation
  },
};
