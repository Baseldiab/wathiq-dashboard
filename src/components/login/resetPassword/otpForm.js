import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { styles } from "@/components/globalStyle.js";
import { login_style } from "@/components/login/style";
import Button from "@/components/button/index";
import ErrorMsg from "@/components/error-message/index";
import OtpInput from "react-otp-input";
import Timer from "@/components/Timer/index";
import { useDispatch, useSelector } from "react-redux";
import { hideAllExceptLastFour } from "@/services/utils";
import { verifyCode } from "@/Redux/slices/globalSlice";
import CustomSnackbar from "@/components/toastMsg";
import { useRouter } from "next/router";

export default function OTPForm({
  setFormType,
  setOpen,
  otpcode,
  setOTPCode,
  open,
  NID,
  setAlert,
}) {
  const { t } = useTranslation();
  const [error, setError] = useState();
  const [otp, setOtp] = useState("");
  const [initialSeconds, setInitialSeconds] = useState(60);
  const { updateData } = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      setError(t("components_login_resetPassword_otpForm.رمز_التأكيد_اجباري"));
      return;
    }

    let response = await dispatch(
      verifyCode({
        identityNumber: NID ?? updateData?.identityNumber,
        code: otp,
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      if (NID) {
        setAlert({ msg: t("components_login_resetPassword_otpForm.تم_تأكيد_الحساب_بنجاح"), type: "success" });
        router.push("/");
      } else {
        setFormType("confirm-password");
      }
      // setFormType("confirm-password");
    } else {
      setError(response?.payload);
      return;
    }
  };

  const handleOTPChange = (val) => {
    setError("");
    if (!/^[0-9]*$/.test(val)) return;
    setOtp(val);
  };

  return (
    <Box sx={{ ...styles.boxContainer, height: "auto", minHeight: "auto" }}>
      <Box sx={{ p: 3 }}>
        <Typography sx={login_style.typography}>{t("components_login_resetPassword_otpForm.أدخل_رمز_التحقق")}</Typography>
        <Box sx={{ opacity: "0.75", mt: 2 }}>
          <Typography
            sx={{
              ...login_style.typography,
              fontWeight: 500,
              fontSize: "0.9rem",
              mt: 1,
            }}
          >
            {t("components_login_resetPassword_otpForm.Otp_تم_إرسال_رمز")}
            {/* إلى رقم الهاتف المنتهي بـ */}
            {/* <span>{hideAllExceptLastFour("01278240560")}</span>  */}
          </Typography>
        </Box>
        <Box sx={{ py: 3 }}>
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
              direction: "ltr",
            }}
            inputStyle="otp-input"
            renderInput={(props) => <input {...props} className="otp-input" />}
            shouldAutoFocus={true}
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
              NID={NID}
              setAlert={setAlert}
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
          text={t("components_login_resetPassword_otpForm.تأكيد")}
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
