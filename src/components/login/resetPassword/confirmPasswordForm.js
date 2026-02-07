import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { styles } from "@/components/globalStyle.js";
import Input from "@/components/inputs/index";
import Button from "@/components/button/index";
import ErrorMsg from "@/components/error-message/index";
import { ResetPassword } from "@/Redux/slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { isEmptyObject } from "@/services/utils";
import { login_style } from "../style";

export default function ConfirmPassword({ setFormType }) {
  const { t } = useTranslation();
  
  const messages = {
    password: t("components_login_resetPassword_confirmPasswordForm.كلمة_المرور_اجباري"),
    confirmPassword: t("components_login_resetPassword_confirmPasswordForm.اعادة_كلمة_المرور_اجباري"),
    minMatch: t("components_login_resetPassword_confirmPasswordForm.كلمة_المرور_وتأكيد_كلمة"),
  };
  const [data, setData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState();

  const { updateData } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const handleInputChange = (value, name) => {
    setErrors({ ...errors, [name]: "" });
    setError("");
    setData({ ...data, [name]: value });
  };

  const handleResetPassword = async () => {
    const errors = isEmptyObject(data, messages);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    if (data.password !== data.confirmPassword) {
      setErrors({ minMatch: t("components_login_resetPassword_confirmPasswordForm.كلمة_المرور_وتأكيد_كلمة") });
      return;
    }
    let response = await dispatch(
      ResetPassword({
        identityNumber: updateData?.identityNumber,
        newPassword: data.password,
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      setFormType("success");
    } else {
      setError(response?.payload);
      return;
    }
  };

  return (
    <Box sx={{ ...styles.boxContainer, height: "auto", minHeight: "auto" }}>
      <Box sx={{ p: 3 }}>
        <Typography sx={login_style.typography}>{t("components_login_resetPassword_confirmPasswordForm.اعادة_تعيين_كلمة_المرور")}</Typography>

        <Box sx={{ py: 3 }}>
          <Box sx={{ mt: 2.5 }}>
            <Input
              label={t("components_login_resetPassword_confirmPasswordForm.كلمة_المرور")}
              value={data.password}
              handleChange={handleInputChange}
              placeholder={t("components_login_resetPassword_confirmPasswordForm.ادخل_كلمة_المرور")}
              type="password"
              disabled={false}
              startIcon="/images/icons/lock.svg"
              name="password"
              customStyle={{ width: "100%" }}
            />
            {errors?.password && <ErrorMsg message={errors?.password} />}
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Input
              label={t("components_login_resetPassword_confirmPasswordForm.اعد_ادخل_كلمة_المرور")}
              value={data.confirmPassword}
              handleChange={handleInputChange}
              placeholder={t("components_login_resetPassword_confirmPasswordForm.اعد_ادخل_كلمة_المرور")}
              type="password"
              disabled={false}
              startIcon="/images/icons/lock.svg"
              name="confirmPassword"
              customStyle={{ width: "100%" }}
            />
            {errors?.confirmPassword && (
              <ErrorMsg message={errors?.confirmPassword} />
            )}
          </Box>
        </Box>
      </Box>{" "}
      <Box sx={{ p: 3 }}>
        {errors?.minMatch && <ErrorMsg message={errors?.minMatch} />}
        <Button
          handleClick={handleResetPassword}
          customeStyle={{ width: "100%", mt: -6 }}
          disabled={false}
          text={t("components_login_resetPassword_confirmPasswordForm.تأكيد")}
        />
      </Box>
    </Box>
  );
}
