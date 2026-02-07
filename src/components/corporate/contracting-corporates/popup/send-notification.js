import { useTranslation } from "next-i18next";
import * as Yup from "yup";
import { useState } from "react";
import Input from "@/components/inputs";
import CustomButton from "@/components/button";
import { Box, Typography } from "@mui/material";
import { styles as globalStyles } from "@/components/globalStyle";
import { styles as localStyles } from "../../style";
import PopupTitle from "@/components/popup-title";
const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("العنوان مطلوب"),
  msg: Yup.string().trim().required("الرسالة مطلوبة"),
});

export default function SendNotification({
  handleClose,
  handleNotification,
  loading,
}) {
  const { t } = useTranslation();
  const styles = { ...globalStyles, ...localStyles };

  const [formData, setFormData] = useState({ title: "", msg: "" });
  const [errors, setErrors] = useState({});

  const handleInputChange = (value, name) => {
    if (!name) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("Validation passed, calling handleNotification...");
      handleNotification(formData); // Call the function
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  return (
    <Box sx={{ ...styles.popupContainer, alignItems: "start", border: "none" }}>
      <PopupTitle title={t("components_corporate_contracting-corporates_popup_send-notification.إرسال_اشعار")} handleClose={handleClose} />
      <Box
        sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Input
          label={t("components_corporate_contracting-corporates_popup_send-notification.العنوان")}
          value={formData.title}
          handleChange={handleInputChange}
          placeholder={t("components_corporate_contracting-corporates_popup_send-notification.العنوان")}
          type="text"
          name="title"
          customStyle={{ width: "100%" }}
          error={errors.title}
        />
        <Input
          label={t("components_corporate_contracting-corporates_popup_send-notification.الرسالة")}
          placeholder={t("components_corporate_contracting-corporates_popup_send-notification.الرسالة_هنا")}
          type="text"
          value={formData.msg}
          handleChange={handleInputChange}
          name="msg"
          customStyle={{ width: "100%" }}
          error={errors.msg}
          flag
        />
      </Box>
      <Box
        sx={{
          ...styles.popupBtnsContainer,
        }}
      >
        <CustomButton
          customeStyle={{
            width: "100%",
            // background: "#D32F2F",
            // color: "#fff",
            fontWeight: 700,
          }}
          handleClick={handleSubmit}
          disabled={loading}
          text={loading ? t("components_corporate_contracting-corporates_popup_send-notification.جاري_التحميل") : t("components_corporate_contracting-corporates_popup_send-notification.إرسال")}
        />
      </Box>
    </Box>
  );
}
