import { useTranslation } from "next-i18next";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { login_style } from "./style";
import { styles } from "../globalStyle";
import CustomSnackbar from "../toastMsg";
import CustomButton from "../button";
import ErrorMsg from "../error-message";
import { useEffect, useState } from "react";
import Input from "../inputs";
import constants from "@/services/constants";
import { isEmptyObject } from "@/services/utils";
import { login } from "@/Redux/slices/authSlice";
import { getProfile } from "@/Redux/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import OTPForm from "./resetPassword/otpForm";
export default function LoginBox({ customeStyle = {} }) {
  const { t } = useTranslation();
  const messages = {
    identityNumber: t("components_login_login-box.رقم_الهوية_اجباري"),
    pswd: t("components_login_login-box.كلمة_المرور_اجباري"),
  };
  const [data, setData] = useState({ identityNumber: "", pswd: "" });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [openOTP, setOpenOTP] = useState(false);
  const [otpcode, setOTPCode] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { data: profile } = useSelector((state) => state.profile);
  const { data: auth, loading } = useSelector((state) => state.auth);
  const handleInputChange = (value, name) => {
    setErrors({ ...errors, [name]: "" });
    setData({ ...data, [name]: value });
  };

  const handleLoginSubmit = async () => {
    const errors = isEmptyObject(data, messages);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    let authLogin = await dispatch(
      login({
        identityNumber: data.identityNumber,
        password: data.pswd,
        // phoneNumber: {
        //   key: "+966",
        //   number: "599999999",
        // },
        // password: "12345678",
      })
    );
    // router.push("/");

    if (authLogin?.meta?.requestStatus === "fulfilled") {
      await dispatch(getProfile());
      router.push("/");
    } else {
      if (
        authLogin?.payload?.message ===
        t("components_login_login-box.الحساب_غير_مؤكد")
      ) {
        setOTPCode(`${authLogin?.payload?.metadata?.code}`);
        setAlert({
          msg: `${authLogin?.payload?.metadata?.code} يرجي تأكيد الحساب اولا `,

          type: "error",
        });
        setOpenOTP(true);
        // setOpenOTPsnack(true);
      } else if (
        authLogin?.payload?.message.includes("حظر ") ||
        authLogin?.payload?.message.includes(
          t("components_login_login-box.محظور")
        )
      ) {
        setAlert({
          msg: authLogin?.payload,
          type: "error",
        });
      } else {
        setAlert({
          msg: t("components_login_login-box.اسم_المستخدم_أو_كلمة"),
          type: "error",
        });
      }
      setOpen(true);
    }
    // else {
    //   setOpen(true);
    // }
  };
  const handleRedirect = (path) => {
    router.push(`/${path}`);
  };
  useEffect(() => {
    if (profile?.data?._id) router.push("/");
  }, [profile]);
  return (
    <>
      <Box
        sx={{
          ...styles.boxContainer,
          ...login_style,
          height: "auto",
          minHeight: "auto",
          width: "100%",
        }}
      >
        {!openOTP ? (
          <>
            <Box
              sx={{
                p: 3,
                display: "flex",
                // gap: "24px",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ ...login_style.typography, mb: -0.5 }}>
                {t("components_login_login-box.تسجيل_الدخول")}
              </Typography>
              <Box>
                <Box>
                  <Input
                    label=" رقم الهوية / الاقامة "
                    value={data.identityNumber}
                    handleChange={handleInputChange}
                    // placeholder=" ادخل رقم الهوية / الاقامة"
                    type="text"
                    disabled={false}
                    startIcon="/images/icons/nid.svg"
                    endIcon={<Typography></Typography>}
                    name="identityNumber"
                    noLabel
                    customStyle={{ width: "100%", mt: 3 }}
                    inputStyle={{ border: "none" }}
                  />
                  {errors?.identityNumber && (
                    <ErrorMsg message={errors?.identityNumber} />
                  )}
                </Box>
                <Box sx={{ mt: 2.5 }}>
                  <Input
                    label={t("components_login_login-box.كلمة_المرور")}
                    value={data.pswd}
                    handleChange={handleInputChange}
                    // placeholder={t("components_login_login-box.ادخل_كلمة_المرور")}
                    type="password"
                    disabled={false}
                    startIcon="/images/icons/lock.svg"
                    name="pswd"
                    noLabel
                    customStyle={{ width: "100%", mt: 3 }}
                    inputStyle={{ border: "none" }}
                  />
                  {errors?.pswd && <ErrorMsg message={errors?.pswd} />}
                </Box>
                {/* <Typography
            onClick={() => handleRedirect("reset-password")}
            sx={{
              ...login_style.typography,
              color: constants.colors.main,
              cursor: "pointer",
              fontSize: "0.9rem",
              textAlign: "end",
              mt: 2,
            }}
          >{t("components_login_login-box.نسيت_كلمة_المرور")}</Typography> */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  {/* <CustomButton
                    handleClick={() => handleRedirect("reset-password")}
                    customeStyle={{
                      variant: "outlined",
                      background: "transparent",
                      color: constants.colors.main,
                      border: "none",
                      boxShadow: "none",
                      "&:hover": {
                        background: "transparent", // Ensures no background color on hover
                        boxShadow: "none",
                      },
                    }}
                    text={t("components_login_login-box.نسيت_كلمة_المرور")}
                  /> */}
                  <Typography
                    onClick={() => handleRedirect("reset-password")}
                    sx={{
                      cursor: "pointer",
                      color: constants.colors.main,
                      fontWeight: { xs: 400, sm: 700 },
                      fontSize: { xs: 12, sm: 16 },
                      textAlign: "end",
                      // width: "100%",
                      mt: 3,
                      ml: 0.5,
                    }}
                  >
                    {t("components_login_login-box.نسيت_كلمة_المرور")}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                p: 3,
                display: "flex",
                gap: "24px",
                mt: -2,
                flexDirection: "column",
              }}
            >
              <CustomButton
                handleClick={handleLoginSubmit}
                customeStyle={{ width: "100%" }}
                text={
                  loading ? (
                    <CircularProgress color="#ffffff"></CircularProgress>
                  ) : (
                    t("components_login_login-box.تسجيل_الدخول")
                  )
                }
              />
            </Box>
          </>
        ) : (
          <OTPForm
            setOpen={setOpen}
            otpcode={otpcode}
            setOTPCode={setOTPCode}
            open={open}
            NID={data.identityNumber}
            setAlert={setAlert}
          />
        )}
      </Box>
      {/* {!otpcode && ( */}
      <CustomSnackbar open={open} setOpen={setOpen} message={alert.msg} />
      {/* )} */}
    </>
    // </Box>
  );
}
