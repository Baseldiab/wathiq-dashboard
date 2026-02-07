import { useTranslation } from "next-i18next";
import { useState, useRef, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
import Input from "@/components/inputs";
import ErrorMsg from "@/components/error-message/index";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@/components/toastMsg/index.js";
import { createLogo, getLogos, updateLogo } from "@/Redux/slices/logosSlice";
import FileUpload from "@/components/file/upload-file";
import Loader from "@/components/loader";
import { truncateFileName } from "@/services/utils";
import PopupTitle from "@/components/popup-title";


export default function LogoModification({
  logo = {},
  handleClose,
  source,
  setAlert,
  setOpen,
}) {
  const { t } = useTranslation();
  const messages = {
  name: " الاسم اجباري",
  logo: " الفايل اجباري",
};

  const { loading, errorLogo } = useSelector((state) => state.logos || {});
  console.log("logos", loading);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [data, setData] = useState({
    name: "",
    logo: "",
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (Object.keys(logo).length > 0 && source === "EDIT") {
      setData({
        logo: logo?.logo,
        name: logo?.name,
      });
    } else if (source === "ADD") {
      setData({
        name: "",
        logo: "",
      });
    }
    return () => {
      setData({
        name: "",
        logo: "",
      });
      setErrors({});
    };
  }, [logo, source]);

  const handleInputChange = (value, name) => {
    setErrors({ ...errors, [name]: "" });
    setData({ ...data, [name]: value });
  };
  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };
  const handleSubmit = async () => {
    const errors = isEmptyObject(data, messages);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    let response;
    if (source === "ADD") {
      console.log("at add");
      response = await dispatch(
        createLogo({
          logo: data.logo,
          name: { ar: data.name },
          active: true,
        })
      );
    } else if (source === "EDIT") {
      response = await dispatch(
        updateLogo({
          data: {
            logo: data.logo,
            name: { ar: data.name },
          },
          id: logo?._id,
        })
      );
    }
    await dispatch(getLogos());

    if (response?.meta?.requestStatus === "fulfilled") {
      setAlert({ msg: response?.payload?.message, type: "success" });
      setOpen(true);
      handleClose();
    } else {
      setAlert({ msg: errorLogo || t("components_content_home-logos-popup_logo-modification.حدث_خطأ"), type: "error" });
      setOpen(true);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    if (event?.target?.files?.length > 0) {
      handleInputChange(event.target.files[0], "logo");
    }
  };
  if (loading) return <Loader open={true} />;
  return (
    <Box
      sx={{
        border: "1px solid #EBEEF3",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        background: "#fff",
        width: "100%",
      }}
    >
      <PopupTitle
        title={Object.keys(logo).length > 0 ? "تعديل  اللوجو " : " اضافة  لوجو"}
        handleClose={handleClose}
      />
      <Box>
        <Input
          label={t("components_content_home-logos-popup_logo-modification.اسم_الشركة")}
          value={data?.name}
          handleChange={handleInputChange}
          placeholder={t("components_content_home-logos-popup_logo-modification.الاسم")}
          type="text"
          name="name"
          customStyle={{ width: "100%" }}
        />
        {errors?.name && <ErrorMsg message={errors?.name} />}
      </Box>
      <Box
        sx={{
          borderRadius: "12px",
          border: "1.5px solid #D6D9E1",
          padding: "12px 12px",
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
          alignItems: "center",
        }}
        onClick={() => handleIconClick("logo")}
      >
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontWeight: "500",
            color: "#24262d",
            textDecoration: "none",
          }}
        >
          {data?.logo
            ? truncateFileName(data?.logo)
            : t("components_content_home-logos-popup_logo-modification.حدد")}
        </Typography>
        <img src="/images/upload.svg" style={{ cursor: "pointer" }} />
      </Box>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          gap: "24px",
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
          text={t("components_content_home-logos-popup_logo-modification.الغاء")}
          type="close"
        />
        <Button
          customeStyle={{ width: "50%" }}
          handleClick={handleSubmit}
          text={Object.keys(logo).length > 0 ? t("components_content_home-logos-popup_logo-modification.تحديث") : t("components_content_home-logos-popup_logo-modification.اضافة")}
        />
      </Box>
    </Box>
  );
}
