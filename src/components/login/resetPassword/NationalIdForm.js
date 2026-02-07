import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styles } from "@/components/globalStyle.js";
import { login_style } from "@/components/login/style";
import Input from "@/components/inputs/index";
import Button from "@/components/button/index";
import ErrorMsg from "@/components/error-message/index";
import { useDispatch } from "react-redux";
import { isEmptyObject } from "@/services/utils";
import {
  askForResetPassword,
  updateUserData,
} from "@/Redux/slices/globalSlice";

export default function NationalIdForm({ setFormType, setOTPCode, setOpen }) {
  const { t } = useTranslation();
  const messages = {
    identityNumber: t("components_login_resetPassword_NationalIdForm.رقم_الهوية_اجباري"),
  };
  const [data, setData] = useState({ identityNumber: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const handleInputChange = (value, name) => {
    setErrors({ ...errors, [name]: "" });
    setData({ ...data, [name]: value });
    setError("");
  };

  const handleNationalIDSubmit = async () => {
    const errors = isEmptyObject(data, messages);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    let response = await dispatch(
      askForResetPassword({
        identityNumber: data.identityNumber,
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      setOpen(true);
      dispatch(
        updateUserData({ key: "identityNumber", value: data.identityNumber })
      );
      setOTPCode(response?.payload?.data?.code);
      setFormType("get-otp");
    } else {
      setOpen(false);

      setError(
        response?.payload ? response?.payload : t("components_login_resetPassword_NationalIdForm.حدث_خطأ_يرجي_المحاولة")
      );
    }
  };
  console.log("Snackbar Open State:", open);

  return (
    <>
      <Box sx={{ ...styles.boxContainer, height: "auto", minHeight: "auto" }}>
        <Box sx={{ p: 3 }}>
          <Typography sx={login_style.typography}>{t("components_login_resetPassword_NationalIdForm.اعادة_تعيين_كلمة_المرور")}</Typography>
          {/* <Typography
            sx={{
              ...login_style.typography,
              fontWeight: 500,
              fontSize: "0.9rem",
              mt: 1,
            }}
          >
            أدخل رقم الهوية الخاصة بك.{" "}
          </Typography> */}
          <Box sx={{ py: 3 }}>
            <Box>
              <Input
                label={t("components_login_resetPassword_NationalIdForm.رقم_الهوية_الاقامة")}
                value={data.identityNumber}
                handleChange={handleInputChange}
                // placeholder={t("components_login_resetPassword_NationalIdForm.ادخل_رقم_الهوية")}
                type="text"
                disabled={false}
                startIcon="/images/icons/nid.svg"
                name="identityNumber"
                noLabel
                customStyle={{ width: "100%" }}
                inputStyle={{ border: "none" }}
              />
              {errors?.identityNumber && (
                <ErrorMsg message={errors?.identityNumber} />
              )}
              {error && <ErrorMsg message={error} />}
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Button
            handleClick={handleNationalIDSubmit}
            customeStyle={{ width: "100%", mt: -7 }}
            disabled={false}
            text={t("components_login_resetPassword_NationalIdForm.إرسال_الرمز")}
          />
        </Box>
      </Box>
    </>
  );
}
