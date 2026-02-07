import { useTranslation } from "next-i18next";
import CustomButton from "@/components/button";
import Input from "@/components/inputs";
import { Box, Typography } from "@mui/material";
import React from "react";
import { styles as globalStyles } from "@/components/globalStyle";
import { styles as localStyles } from "../../style";
import PopupTitle from "@/components/popup-title";
export default function BlockCorporate({
  reason,
  error,
  handleInputChange,
  handleClose,
  handleBlock,
  loadingBlocked,
}) {
  const { t } = useTranslation();
  const styles = { ...globalStyles, ...localStyles };

  return (
    <Box sx={{ ...styles.popupContainer, alignItems: "start", border: "none" }}>
      <PopupTitle title={t("components_corporate_contracting-corporates_popup_block-corporate.حظر_الشركة")} handleClose={handleClose} />

      <Input
        label={t("components_corporate_contracting-corporates_popup_block-corporate.سبب_الحظر")}
        placeholder={t("components_corporate_contracting-corporates_popup_block-corporate.السبب_هنا")}
        type="text"
        value={reason}
        handleChange={handleInputChange}
        name="reasonBlock"
        customStyle={{ width: "100%" }}
        error={error}
        flag
      />
      <Box
        sx={{
          ...styles.popupBtnsContainer,
        }}
      >
        <CustomButton
          customeStyle={{
            width: { xs: "100%" },
            ...styles.deleteBtn,
          }}
          handleClick={handleBlock}
          disabled={loadingBlocked}
          text={loadingBlocked ? t("components_corporate_contracting-corporates_popup_block-corporate.جاري_التحميل") : t("components_corporate_contracting-corporates_popup_block-corporate.حظر_الشركة")}
        />
      </Box>
    </Box>
  );
}
