import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { styles } from "@/components/globalStyle.js";
import Input from "@/components/inputs/index";
import Button from "@/components/button/index";
import ErrorMsg from "@/components/error-message/index";
import { login_style } from "@/components/login/style";
import PopupTitle from "@/components/popup-title";

export default function PhoneForm({
  data,
  error,
  errors,
  handleInputChange,
  handleSubmitResetPhone,
  handleClose,
}) {
  const { t } = useTranslation();
  console.log("errors?.phone", errors);
  console.log("error", error);
  return (
    <Box sx={{ ...styles.boxContainer, height: "auto", minHeight: "auto" }}>
      <Box sx={{ p: 3 }}>
        {/* <Typography sx={login_style.typography}>{t("components_home_change-data_phoneForm.رقم_الجوال_الجديد")}</Typography> */}
        <PopupTitle title={t("components_home_change-data_phoneForm.رقم_الجوال_الجديد")} handleClose={handleClose} />
        <Box sx={{ py: 3 }}>
          <Box sx={{ mt: 2.5 }}>
            <Input
              label={t("components_home_change-data_phoneForm.ادخل_رقم_الجوال_الجديد")}
              value={data?.phone ? data?.phone : ""}
              placeholder={t("components_home_change-data_phoneForm.ادخل_رقم_الجوال_الجديد")}
              handleChange={handleInputChange}
              type="phone"
              name="phone"
              startIcon="/images/icons/phone.svg"
              // endIcon="/images/icones/code.svg"
              customStyle={{ width: "100%" }}
            />
            {errors?.phone ||
              (error && <ErrorMsg message={errors?.phone || error} />)}
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 3, textAlign: "center" }}>
        {error && <ErrorMsg message={error} />}
        <Button
          handleClick={handleSubmitResetPhone}
          customeStyle={{ width: "100%", mt: -8 }}
          disabled={false}
          text={t("components_home_change-data_phoneForm.التالي")}
        />
      </Box>
    </Box>
  );
}
