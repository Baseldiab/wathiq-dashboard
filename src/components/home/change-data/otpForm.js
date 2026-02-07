import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { styles } from "@/components/globalStyle.js";
import { login_style } from "@/components/login/style";
import Button from "@/components/button/index";
import ErrorMsg from "@/components/error-message/index";
import OtpInput from "react-otp-input";
import Timer from "@/components/Timer/index";
import { useDispatch, useSelector } from "react-redux";
import {
  askForUpdateEmail,
  updateUserData,
} from "@/Redux/slices/globalSlice.js";
import { hideAllExceptLastFour } from "@/services/utils";
import PopupTitle from "@/components/popup-title";
import CustomSnackbar from "@/components/toastMsg";
import { t } from "i18next";

export default function OTPForm({
  otp,
  error,
  handleOTPSubmit,
  initialSeconds,
  setInitialSeconds,
  handleOTPChange,
  title,
  subtitle = {
    head: t("components_home_change-data_otpForm.فضلا_ادخل_الرمز_المكون"),
    subHead: "",
  },
  handleClose,
  setOpen,
  otpcode,
  setOTPCode,
  open,
}) {
  const { data: profile } = useSelector((state) => state.profile);
  const { updateData } = useSelector((state) => state.global);

  return (
    <Box sx={{ ...styles.boxContainer, height: "auto", minHeight: "auto" }}>
      <Box sx={{ p: 3 }}>
        <PopupTitle title={title} handleClose={handleClose} />
        {/* <Typography sx={login_style.typography}>{title}</Typography> */}
        <Box sx={{ textAlign: "start", opacity: "0.75", mt: 2 }}>
          <Typography
            sx={{
              ...login_style.typography,
              fontWeight: 600,
              fontSize: "0.9rem",
              mt: 1,
              color: "#2E353F",
            }}
          >
            {subtitle.head}
          </Typography>
          {/* <Typography sx={{ direction: "ltr", color: "#000" }}>
            {subtitle.subHead
              ? subtitle.subHead
              : hideAllExceptLastFour(
                  `${profile?.data?.phoneNumber?.key} ${profile?.data?.phoneNumber?.number}`
                )}
          </Typography> */}
        </Box>
        <Box sx={{ py: 3, direction: "ltr" }}>
          <OtpInput
            value={otp}
            onChange={handleOTPChange}
            numInputs={6}
            placeholder={"------"}
            inputType="tel"
            containerStyle={{
              display: "flex",
              gap: "5px",
              justifyContent: "center",
            }}
            inputStyle="otp-input"
            renderInput={(props) => <input {...props} className="otp-input" />}
            shouldAutoFocus={true}
            // containerStyle={{ direction: "ltr", justifyContent: "center" }}
          />
          <Box sx={{ mt: 0, textAlign: "center" }}>
            <Timer
              initialSeconds={initialSeconds}
              setInitialSeconds={setInitialSeconds}
              open={open}
              setOpen={setOpen}
              setOTPCode={setOTPCode}
              otpcode={otpcode}
              type="success"
              noDuration={true}
            />
          </Box>
          {error && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <ErrorMsg message={error} />
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ p: 3 }}>
        <Button
          handleClick={handleOTPSubmit}
          customeStyle={{ width: "100%" }}
          disabled={false}
          text={t("components_home_change-data_otpForm.التالي")}
        />
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
