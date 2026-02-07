import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  InputLabel,
  FormControlLabel,
  Checkbox,
  ThemeProvider,
  createTheme,
  Switch,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import { styles } from "./style.js";
import InputAdornment from "@mui/material/InputAdornment";
//
import IconButton from "@mui/material/IconButton";
import constants from "@/services/constants.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
//
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

export default function Input({
  label,
  value,
  handleChange,
  placeholder,
  type,
  disabled = false,
  startIcon,
  endIcon,
  customStyle = {},
  inputStyle = {},
  name,
  multiple = false,
  valuesOption = [],
  handleBlur,
  error,
  flag,
  withTime,
  company,
  descreption,
  noLabel,
  shrink,
  ...reset
}) {
  const theme = createTheme({
    direction: "rtl",
    typography: {
      fontFamily: "inherit",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleTogglePassword = () => {
    if (disabled) return;
    setShowPassword((prev) => !prev);
  };
  return type === "switch" ? (
    <FormGroup>
      <FormControlLabel
        onClick={(e) => e.stopPropagation()}
        sx={{
          color: constants.colors.main,
          fontWeight: "700",
          "& .MuiFormControlLabel-label": {
            mx: 2,
          },
          ...customStyle,
        }}
        control={<IOSSwitch onChange={handleChange} checked={value} />}
        label={label}
      />
    </FormGroup>
  ) : type === "selectbox" ? (
    <div>
      <FormControl
        sx={{
          ...styles.input,
          ...customStyle,
          position: "relative", // Ensures correct positioning of the label
        }}
      >
        <InputLabel
          sx={{
            color: focused
              ? `${constants.colors.main} !important`
              : `${constants.colors.dark_black} !important`,
            fontWeight: 400,
            right: 0,
            transformOrigin: "top right",
            backgroundColor: "white",
            paddingX: "6px",
            zIndex: 1,
            pointerEvents: "none",
            // mr: 2,
            transition: "all 0.2s ease-in-out",
          }}
          shrink={focused || shrink}
        >
          {label}
        </InputLabel>
        <Select
          sx={{
            "& .MuiSvgIcon-root.MuiSelect-icon": {
              // right: "0px", // Adjust for spacing if needed
              // width:"100%"
            },
            "& .MuiSelect-icon": {
              right: "auto",
              left: 8, // خلي المسافة اللي انت عايزها من الشمال
            },
          }}
          disabled={disabled}
          multiple={multiple}
          displayEmpty
          IconComponent={KeyboardArrowDownIcon}
          value={value}
          onBlur={(e) => {
            handleBlur && handleBlur(e);
            setFocused(false);
          }}
          onFocus={(e) => {
            setFocused(true);
          }}
          onChange={(e) => handleChange(e.target.value, name)}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (!selected || selected.length === 0) {
              // return (
              //   <Typography sx={{ fontSize: "1rem", color: "#BBBBBB" }}>
              //     {placeholder}
              //   </Typography>
              // );
            }

            return multiple
              ? selected
                  .map((item) => (typeof item === "object" ? item.name : item))
                  .join(", ")
              : typeof selected === "object"
              ? selected?.name
              : selected;
          }}
          MenuProps={MenuProps}
        >
          <MenuItem disabled value="">
            <Typography sx={{ fontSize: "1rem" }}>{placeholder}</Typography>
          </MenuItem>
          {valuesOption.map((option) => {
            const isString = typeof option === "string";
            // console.log("option.name", option.name);
            // console.log(
            //   "is name ",
            //   isString ? option : company ? option.companyName : option.name
            // );
            return (
              <MenuItem
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: `${constants.colors.main} !important`,
                    color: "white !important",
                  },
                }}
                key={isString ? option : option._id}
                value={isString ? option : option}
              >
                {isString ? option : company ? option.companyName : option.name}
              </MenuItem>
            );
          })}
        </Select>
        {error && (
          <Box sx={{ color: "#E34935", fontSize: "0.75rem", m: 1 }}>
            {error}
          </Box>
        )}
      </FormControl>
    </div>
  ) : type === "date" ? (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <InputLabel sx={{ ...styles.label }}>{label}</InputLabel> */}
        {withTime ? (
          <DateTimePicker
            sx={{
              ...styles.input,
              ...customStyle,
              "&.MuiButtonBase-root MuiIconButton-root": {
                mx: 5,
              },
              "& .MuiInputLabel-outlined": {
                right: "25px",
                left: "unset",
                bgcolor: "#fff",
              },
            }}
            slots={{
              openPickerIcon: () => (
                <img src="/images/icons/calender.svg" alt="calendar" />
              ),
            }}
            slotProps={{
              ...styles.datePicker,
              inputAdornment: {
                sx: {
                  mx: 1,
                  zIndex: 0, // ✅ prevent label from overlapping popup
                },
                position: "end",
              },
              popper: {
                sx: { zIndex: 1500 }, // override popup to stay on top
              },
            }}
            // format={value ? "YYYY-MM-DD HH:mm" : placeholder}
            // value={value}
            // onChange={(newDateTime) => {
            //   handleChange && handleChange(newDateTime, name);
            // }}
            onBlur={(e) => {
              handleBlur && handleBlur(e);
              setFocused(false);
            }}
            onFocus={(e) => {
              setFocused(true);
            }}
            disablePast={true}
            format={value ? null : placeholder}
            value={value ? dayjs(value) : null}
            onChange={(newDate) => {
              if (newDate && dayjs(newDate).isValid()) {
                handleChange && handleChange(newDate.toISOString(), name);
              }
            }}
            label={placeholder}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...inputStyle,
                  ...params.InputProps,
                }}
              />
            )}
          />
        ) : (
          <DatePicker
            onBlur={(e) => {
              handleBlur && handleBlur(e);
              setFocused(false);
            }}
            onFocus={(e) => {
              setFocused(true);
            }}
            slots={{
              openPickerIcon: () => (
                <img src="/images/icons/calender.svg" alt="calendar" />
              ),
            }}
            sx={{
              ...styles.input,
              ...customStyle,
              "&.MuiButtonBase-root MuiIconButton-root": {
                mx: 5,
              },
              "& .MuiInputLabel-outlined": {
                right: "25px",
                left: "unset",
                bgcolor: "#fff",
              },
            }}
            slotProps={{
              ...styles.datePicker,
              inputAdornment: {
                sx: {
                  mx: 1,
                },
                position: "end",
              },
            }}
            format={value ? null : placeholder}
            value={value ? dayjs(value) : null}
            onChange={(newDate) => {
              if (newDate && dayjs(newDate).isValid()) {
                handleChange && handleChange(newDate.toISOString(), name);
              }
            }}
            label={placeholder}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...inputStyle,
                  ...params.InputProps,
                }}
              />
            )}
          />
        )}
      </LocalizationProvider>
      {error && (
        <Box sx={{ color: "#E34935", fontSize: "0.75rem", m: 1 }}>{error}</Box>
      )}
    </ThemeProvider>
  ) : type === "checkbox" ? (
    <FormControlLabel
      control={<Checkbox sx={styles.checkbox} />}
      label={label}
      checked={value}
      onChange={handleChange}
      sx={{
        ...styles.checkboxLabel,
        textDecoration: flag && "none",
        // color: flag && constants.colors.black,
        color: constants.colors.black,
      }}
    />
  ) : type === "radio" ? (
    <>
      <InputLabel
        sx={{ color: constants.colors.dark_black }}
        // InputLabelProps={{
        //   shrink: Boolean(value) || focused,
        // }}
      >
        {label}
      </InputLabel>
      <FormControl component="fieldset" sx={{ ...customStyle }}>
        <RadioGroup
          value={value}
          onChange={(e) => handleChange(e.target.value, name)}
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {valuesOption.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
              sx={{
                mx: "0px",
                "& .MuiFormControlLabel-label": {
                  // fontWeight: "600",
                  color: constants.colors.dark_black,
                },
                "& .MuiRadio-root.Mui-checked": {
                  color: constants.colors.main,
                },
                "& .MuiFormControlLabel-label.Mui-checked": {
                  color: constants.colors.main,
                },
              }}
            />
          ))}
        </RadioGroup>
        {error && (
          <Box sx={{ color: "#E34935", fontSize: "0.75rem", m: 1 }}>
            {error}
          </Box>
        )}
      </FormControl>
    </>
  ) : (
    <Box sx={{ width: flag && "100%" }}>
      {/* {!noLabel && label && (
        <InputLabel sx={{ ...styles.label }} htmlFor={label}>
          {label && label?.includes("*") ? (
            <>
              {label.split("*")[0]}
              <span style={{ color: "red" }}>*</span>
            </>
          ) : (
            label
          )}
        </InputLabel>
      )} */}
      <TextField
        id={label}
        value={value}
        label={label}
        onChange={(e) => handleChange(e.target.value, name)}
        // onBlur={handleBlur}
        onBlur={(e) => {
          handleBlur && handleBlur(e);
          setFocused(false);
        }}
        onFocus={(e) => {
          setFocused(true);
        }}
        disabled={disabled}
        variant="outlined"
        dir={type == "phone" ? "ltr" : "rtl"}
        sx={{
          ...styles.input,
          ...customStyle,
        }}
        placeholder={placeholder}
        type={showPassword ? "text" : type}
        multiline={flag || (descreption && true)}
        minRows={descreption ? 7 : undefined}
        InputLabelProps={{
          shrink: Boolean(value) || focused,
          sx: {
            // color: `${constants.colors.main} !important`,
            fontWeight: 400,
            right: 0,
            transformOrigin: "top right",
            backgroundColor: "white",
            // paddingX: !focused ? "40px" : "10px",
            paddingX: "10px",
            mr: focused ? 0 : type != "phone" && startIcon && 4,

            // :value?.trim() == "" && type != "phone" && startIcon && 4,
            // color: "inherit",
            zIndex: 1,
            pointerEvents: "none",
            // position: "absolute", // Ensures label stays in position
            // left: focused ? "10px" : "50px", // Moves label to prevent overlap
            transition: "all 0.2s ease-in-out", // Smooth animation
            // color: focused ? "red" : "inherit",
          },
        }}
        InputProps={{
          style: {
            ...inputStyle,
            height: flag && "200px",
            alignItems: flag && "start",
          },
          startAdornment:
            type === "phone" ? (
              <>
                <Typography
                  sx={{
                    px: "8px",
                    borderRight: "2px solid #E1E1E2",
                    mr: 1,
                    fontWeight: "600",
                  }}
                >
                  +996
                </Typography>
                <img
                  src={startIcon}
                  alt="startIcon icon"
                  style={{ paddingRight: "2px" }}
                />
              </>
            ) : (
              startIcon && (
                <IconButton edge="start" sx={{ mx: 0.2, zIndex: 2 }}>
                  <img src={startIcon} alt="start icon" />
                </IconButton>
              )
            ),

          endAdornment:
            type === "password" ? (
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                sx={{ mx: 0.2 }}
                aria-label="toggle password visibility"
              >
                {showPassword ? (
                  <img src="/images/icons/open-eye.png" alt="Show password" />
                ) : (
                  <img src="/images/icons/close-eye.png" alt="Hide password" />
                )}
              </IconButton>
            ) : (
              endIcon && (
                <InputAdornment position="end">
                  {typeof endIcon === "string" ? (
                    <img src={endIcon} alt="end icon" />
                  ) : (
                    endIcon
                  )}
                </InputAdornment>
              )
            ),
        }}
        {...reset}
      />
      {error && (
        <Box sx={{ color: "#E34935", fontSize: "0.75rem", m: 1 }}>{error}</Box>
      )}
    </Box>
  );
}
