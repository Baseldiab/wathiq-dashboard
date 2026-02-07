import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { styles } from "@/components/globalStyle.js";
import Input from "@/components/inputs/index";
import Button from "@/components/button/index";
import ErrorMsg from "@/components/error-message/index";
import { login_style } from "@/components/login/style";
import PopupTitle from "@/components/popup-title";

export default function ConfirmPassword({
  data,
  error,
  errors,
  handleInputChange,
  handleResetPassword,
  handleClose
}) {
  const { t } = useTranslation();
  return (
    <Box sx={{ ...styles.boxContainer, height: "auto", minHeight: "auto" }}>
      <Box sx={{ p: 3 }}>
        {/* <Typography sx={login_style.typography}>{t("components_home_change-data_confirmPasswordForm.تغير_كلمة_المرور")}</Typography> */}
      <PopupTitle title={t("components_home_change-data_confirmPasswordForm.تغير_كلمة_المرور")} handleClose={handleClose} />

        <Box sx={{ py: 3 }}>
          <Box sx={{ mt: 2.5 }}>
            <Input
              label={t("components_home_change-data_confirmPasswordForm.كلمة_المرور_القديمة")}
              value={data?.oldPassword ? data?.oldPassword : ""}
              handleChange={handleInputChange}
              placeholder={t("components_home_change-data_confirmPasswordForm.كلمة_المرور_القديمة")}
              type="password"
              disabled={false}
              startIcon="/images/icons/lock.svg"
              name="oldPassword"
              customStyle={{ width: "100%" }}
            />
            {errors?.oldPassword && <ErrorMsg message={errors?.oldPassword} />}
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <Input
              label=" كلمة المرور الجديدة"
              value={data?.password ? data?.password : ""}
              handleChange={handleInputChange}
              placeholder=" كلمة المرور الجديدة"
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
              label=" تأكيد كلمة المرور الجديدة"
              value={data?.confirmPassword ? data?.confirmPassword : ""}
              handleChange={handleInputChange}
              placeholder={t("components_home_change-data_confirmPasswordForm.تأكيد_كلمة_المرور_الجديدة")}
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
      </Box>

      {/* <Divider /> */}
      <Box sx={{ p: 3, textAlign: "center" }}>
        {errors?.minMatch && <ErrorMsg message={errors?.minMatch} />}
        {error && <ErrorMsg message={error} />}
        <Button
          handleClick={handleResetPassword}
          customeStyle={{ width: "100%" }}
          disabled={false}
          text={t("components_home_change-data_confirmPasswordForm.تغير_كلمة_المرور")}
        />
      </Box>
    </Box>
  );
}
