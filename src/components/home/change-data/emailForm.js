import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { styles } from "@/components/globalStyle.js";
import Input from "@/components/inputs/index";
import Button from "@/components/button/index";
import ErrorMsg from "@/components/error-message/index";
import { login_style } from "@/components/login/style";
import PopupTitle from "@/components/popup-title";

export default function EmailForm({
  error,
  data,
  errors,
  handleInputChange,
  handleSubmitResetEmail,
  handleClose,
}) {
  const { t } = useTranslation();
  return (
    <Box sx={{ ...styles.boxContainer, height: "auto", minHeight: "auto" }}>
      <Box sx={{ p: 3 }}>
        <PopupTitle title={t("components_home_change-data_emailForm.البريد_الالكتروني")} handleClose={handleClose} />

        <Box sx={{ py: 3 }}>
          <Box sx={{ mt: 2.5 }}>
            <Input
              label={t("components_home_change-data_emailForm.البريد_الالكتروني_الجديد")}
              value={data?.email ? data?.email : ""}
              placeholder={t("components_home_change-data_emailForm.ادخل_البريد_الالكتروني_الجديد")}
              handleChange={handleInputChange}
              type="email"
              name="email"
              startIcon="/images/icons/email.svg"
              customStyle={{ width: "100%" }}
            />
            {errors?.email && <ErrorMsg message={errors?.email} />}
          </Box>
        </Box>
      </Box>

      {/* <Divider /> */}

      <Box sx={{ p: 3, textAlign: "center" }}>
        {error && <ErrorMsg message={error} />}
        <Button
          handleClick={handleSubmitResetEmail}
          customeStyle={{ width: "100%" }}
          disabled={false}
          text={t("components_home_change-data_emailForm.التالي")}
        />
      </Box>
    </Box>
  );
}
