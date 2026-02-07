import { useTranslation } from "next-i18next";
import CustomButton from "@/components/button";
import Input from "@/components/inputs";
import { getAllProvidersRequests } from "@/Redux/slices/providerSlice";
import { Height } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { styles as globalStyles } from "@/components/globalStyle";
import { styles as localStyles } from "../../style";
import PopupTitle from "@/components/popup-title";
export default function RequestReject({
  handleClose,
  setRejectReason,
  handleReject,
  error,
  setError,
  type,
}) {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const styles = { ...globalStyles, ...localStyles };
  const getLabelText = (type) => {
    switch (type) {
      case "agencies":
        return t("components_corporate_contract-requests_popup_request-reject.سبب_رفض_الوكالة");
      case "agenciesDissabled":
        return t("components_corporate_contract-requests_popup_request-reject.سبب_تعطيل_الوكالة");
      case "blockUser":
        return t("components_corporate_contract-requests_popup_request-reject.سبب_حظر_المسخدم");
      case "reject-auction":
        return t("components_corporate_contract-requests_popup_request-reject.سبب_رفض_المزاد");
      case "enrollment":
        return t("components_corporate_contract-requests_popup_request-reject.السبب");
      default:
        return t("components_corporate_contract-requests_popup_request-reject.سبب_الرفض");
    }
  };

  // Function to get the title for the button
  const getButtonTitle = (type) => {
    switch (type) {
      case "agencies":
        return t("components_corporate_contract-requests_popup_request-reject.رفض_الوكالة");
      case "agenciesDissabled":
        return "تعطيل ";
      case "blockUser":
        return t("components_corporate_contract-requests_popup_request-reject.حظر_المسخدم");
      case "reject-auction":
        return t("components_corporate_contract-requests_popup_request-reject.رفض_المزاد");
      case "enrollment":
        return t("components_corporate_contract-requests_popup_request-reject.إستبعاد");
      default:
        return t("components_corporate_contract-requests_popup_request-reject.رفض_الطلب");
    }
  };

  // Function to get the title of the popup
  const getPopupTitle = (type) => {
    switch (type) {
      case "agencies":
        return t("components_corporate_contract-requests_popup_request-reject.رفض_الوكالة");
      case "agenciesDissabled":
        return "تعطيل وكالة ";
      case "blockUser":
        return "   ";
      case "reject-auction":
        return t("components_corporate_contract-requests_popup_request-reject.رفض_المزاد");
      case "enrollment":
        return " سبب إستبعاد المشارك";
      default:
        return t("components_corporate_contract-requests_popup_request-reject.رفض_الطلب");
    }
  };
  const handleInputChange = (value) => {
    setReason(value);
    setRejectReason(value);
    setError("");
  };

  return (
    <Box sx={{ ...styles.popupContainer, alignItems: "start", border: "none" }}>
      <PopupTitle title={getPopupTitle(type)} handleClose={handleClose} />

      <Input
        label={getLabelText(type)}
        placeholder={t("components_corporate_contract-requests_popup_request-reject.السبب_هنا")}
        type="text"
        value={reason}
        handleChange={handleInputChange}
        name="reasonReject"
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
            background: "#FFEDEA",
            color: "#E34935",
            fontWeight: 700,
            border: "1px solid #E34935",
            "&:hover": {
              background: "#FFEDEA",
              color: "#E34935",
              boxShadow: "none",
            },
          }}
          handleClick={handleReject}
          // type="remove"
          text={getButtonTitle(type)}
        />
      </Box>
    </Box>
  );
}
