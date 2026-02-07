import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
// import { deleteLogo } from "@/Redux/slices/logoSlice";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@/components/toastMsg/index.js";
import { styles } from "@/components/globalStyle";
import { deleteLogo, getLogos } from "@/Redux/slices/logosSlice";
import Loader from "@/components/loader";

export default function LogoRemove({ handleClose, logo, setAlert, setOpen }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { logos, loading, errorLogo } = useSelector((state) => state.logos);
  const handleRemoveLogo = async () => {
    try {
      await dispatch(deleteLogo(logo._id)).unwrap();
      await dispatch(getLogos()).unwrap();
      setAlert({ msg: t("components_content_home-logos-popup_logo-remove.تم_حذف_الاشعار_بنجاح"), type: "error" });
      setOpen(true);
      handleClose();
    } catch (error) {
      
      setAlert({ msg: errorLogo || t("components_content_home-logos-popup_logo-remove.حدث_خطأ"), type: "error" });
      setOpen(true);
    }
  };
  if (loading) return <Loader open={true} />;

  return (
    <Box
      sx={{
        ...styles.popupContainer,
      }}
    >
      <img src="/images/icons/trash-icon.svg" width="72px" height="72px" />
      <Typography
        sx={{ fontSize: "1.3rem", color: "#161008", fontWeight: 700 }}
      >{t("components_content_home-logos-popup_logo-remove.حذف_اللوجو")}</Typography>
      <Typography sx={{ fontSize: "1rem", color: "#6F6F6F", fontWeight: 600 }}>{t("components_content_home-logos-popup_logo-remove.هل_أنت_متأكد_أنك")}</Typography>
      <Box
        sx={{
          display: "flex",
          mt: 2,
          justifyContent: "space-between",
          gap: "24px",
          width: "100%",
        }}
      >
        <Button
          customeStyle={{
            width: "50%",
            background: "transparent",
            color: "#6F6F6F",
            fontWeight: 700,
            border: "1px solid #D6D9E1",
            "&:hover": {
              background: "transparent",
              color: "#6F6F6F",
              boxShadow: "none",
            },
          }}
          handleClick={handleClose}
          text={t("components_content_home-logos-popup_logo-remove.الغاء")}
          type="close"
        />
        <Button
          // disabled={updateLoading}
          customeStyle={{
            width: "50%",
            background: "#D32F2F",
            color: "#fff",
            fontWeight: 700,
            border: "1px solid #D6D9E1",
            "&:hover": {
              background: "#D32F2F",
              color: "#fff",
              boxShadow: "none",
            },
          }}
          handleClick={handleRemoveLogo}
          type="remove"
          text={t("components_content_home-logos-popup_logo-remove.حذف")}
        />
      </Box>
    </Box>
  );
}
