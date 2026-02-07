import { useTranslation } from "next-i18next";
import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { ResendCode } from "@/Redux/slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import constants from "@/services/constants";
import CustomSnackbar from "../toastMsg";

function Timer({
  initialSeconds,
  setInitialSeconds,
  open,
  setOpen,
  setOTPCode,
  otpcode,
  NID,
  setAlert,
}) {
  const { t } = useTranslation();
  const [timeOut, setTimeOut] = useState(false);
  const dispatch = useDispatch();
  const { data: profile } = useSelector((state) => state.profile);
  const { updateData } = useSelector((state) => state.global);
  useEffect(() => {
    if (initialSeconds <= 0) {
      setTimeOut(true);
      return;
    }

    const timer = setInterval(() => {
      setInitialSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [initialSeconds]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const initialSeconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${initialSeconds
      .toString()
      .padStart(2, "0")}`;
  };
  const handleResendOTPCode = async () => {
    if (!timeOut) return;
    let response = await dispatch(
      ResendCode({
        identityNumber: NID
          ? NID
          : profile?.data?.identityNumber || updateData?.identityNumber,
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      // !NID ??
      setOpen(true);
      NID && setAlert({ msg: response?.payload?.data?.code, type: "success" });
      // NID ? setOpen(false) : setOpen(true);
      // console.log(response?.payload?.data?.code);
      setOTPCode(response?.payload?.data?.code);
      setTimeOut(false);
      setInitialSeconds(60);
    } else {
      !NID ?? setOpen(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
        width: "100%",
        mt: 3,
      }}
    >
      <Typography sx={{ fontSize: "0.8rem" }}>{t("components_Timer_index.ينتهي_الكود_في")}</Typography>
      <Box
        style={{
          fontWeight: "bold",
          color: !timeOut ? constants.colors.secondary : "#EAEAEA",
          fontSize: "0.8rem",
        }}
      >
        {formatTime(initialSeconds)}
      </Box>
      <Box
        onClick={handleResendOTPCode}
        style={{
          cursor: "pointer",
          color: timeOut ? constants.colors.secondary : "#EAEAEA",
          fontSize: "0.8rem",
        }}
      >
        إعادة إرسال الرمز
        {/* إعادة إرسال الرمز */}
      </Box>
      <CustomSnackbar
        open={open}
        setOpen={setOpen}
        message={otpcode}
        type="success"
        noDuration={true}
      />
    </Box>
  );
}

export default Timer;
