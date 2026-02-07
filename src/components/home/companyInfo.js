import { useTranslation } from "next-i18next";
import { useState, useEffect, useRef } from "react";
import { Typography, Box, Grid } from "@mui/material";
import Button from "@/components/button";
import Image from "next/image";
import Input from "@/components/inputs";
import Backdrop from "@/components/backdrop";
import Success from "@/components/login/resetPassword/success.js";
import { updateProfile, getProfile } from "@/Redux/slices/profileSlice";
import { updatePassword } from "@/Redux/slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ConfirmPassword from "./change-data/confirmPasswordForm";
import { isEmptyObject } from "@/services/utils";
import { styles } from "../globalStyle";
import CorMainInfo from "../corporate/main-info";

export default function CompanyInfo() {
  const { t } = useTranslation();
  
const messages = {
  oldPassword: t("components_home_companyInfo.كلمة_المرور_القديمة_اجباري"),
  password: t("components_home_companyInfo.كلمة_المرور_اجباري"),
  confirmPassword: t("components_home_companyInfo.اعادة_كلمة_المرور_اجباري"),
  minMatch: t("components_home_companyInfo.كلمة_المرور_وتأكيد_كلمة"),
};
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("");
  const [action, setAction] = useState("");
  const [errors, seErrors] = useState({});
  const [error, setError] = useState("");
  const [data, setData] = useState();

  const {
    data: profile,
    reload,
    updateProfileFlag,
  } = useSelector((state) => state.profile);

  const dispatch = useDispatch();

  useEffect(() => {
    if (action === "password") {
      setData({
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [action]);

  useEffect(() => {
    if (!profile || updateProfileFlag || reload) dispatch(getProfile());
  }, [reload]);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    let response = await dispatch(
      updateProfile({ profileImage: event.target.files[0] })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      dispatch(getProfile());
    }
  };

  const handleInputChange = (value, name) => {
    seErrors({ ...errors, [name]: "" });
    setData({ ...data, [name]: value });
  };

  const handleSubmitResetPassword = async () => {
    const errors = isEmptyObject(data, messages);
    if (Object.keys(errors).length > 0) {
      seErrors(errors);
      return;
    }
    if (data.password !== data.confirmPassword) {
      seErrors({
        minMatch: t("components_home_companyInfo.كلمة_المرور_وتأكيد_كلمة"),
      });
      return;
    }
    let response = await dispatch(
      updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.password,
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      setFormType("success");
    } else {
      setError(response?.payload);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    handleResetData();
  };

  const handleChangeDate = (action, type) => {
    setAction(action);
    setFormType(type);
    handleOpen();
  };

  const handleResetData = () => {
    setError();
    setFormType("");
    setAction("");
    seErrors({});
    setData();
  };

  const showBackDropContent = () => {
    if (action === "password") {
      switch (formType) {
        case "password":
          return (
            <ConfirmPassword
              handleInputChange={handleInputChange}
              data={data}
              errors={errors}
              error={error}
              handleResetPassword={handleSubmitResetPassword}
            />
          );
        case "success":
          return <Success showBtn={false} />;
        default:
          break;
      }
    }
  };

  return (
    <Box
      sx={{
        padding: "24px",
        width: "100%",
      }}
    >
      <Backdrop
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpen}
        handleClose={handleClose}
        component={
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxHeight: "85%",
              overflow: "auto",
              width: {
                xs: "90%",
                sm: "80%",
                md: "50%",
                lg: "35%",
              },
            }}
          >
            {showBackDropContent()}
          </Box>
        }
      />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mb: "35px" }}
      >
        <Box sx={{ flex: 1, display: "flex", position: "relative" }}>
          <Box
            sx={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              border: "6px solid #D6D9E1",
              overflow: "hidden",
            }}
          >
            <img
              width={0}
              height={0}
              objectFit
              alt="profile-img"
              style={{ height: "100%", width: "100%" }}
              src={
                profile?.data?.companyProfileImage ??
                profile?.data?.provider?.companyProfileImage
              }
            />
          </Box>
          {/* <Image
            onClick={handleIconClick}
            width="40"
            height="40"
            style={{
              zIndex: 10,
              position: "absolute",
              right: "70px",
              bottom: 0,
              cursor: "pointer",
            }}
            src="/images/edit.svg"
          /> */}
          {/* <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          /> */}
        </Box>
        <Box sx={{ flex: 1, flex: "none" }}>
          <Button
            handleClick={() => handleChangeDate("password", "password")}
            text={t("components_home_companyInfo.تغير_كلمة_المرور")}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "24px",
        }}
      >
        {/* <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            lineHeight: "24px",
            color: "#202726",
          }}
        >{t("components_home_companyInfo.معلومات_الموظف")}</Typography> */}
        <Grid
          container
          spacing={3}
          sx={{ width: { xs: "100%", sm: "100%", lg: "70%" } }}
        >
          <Grid item xs={12} md={6}>
            <Input
              label={t("components_home_companyInfo.الإسم_بالكامل")}
              value={profile?.data?.name}
              placeholder={t("components_home_companyInfo.الإسم_بالكامل")}
              type="text"
              disabled
              name="name"
              startIcon="/images/icons/user.svg"
              endIcon={<Typography></Typography>}
              noLabel
              customStyle={{ width: "100%" }}
              inputStyle={{ background: "#fff", border: "none" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              label={t("components_home_companyInfo.رقم_الجوال")}
              value={profile?.data?.phoneNumber?.number}
              placeholder={t("components_home_companyInfo.ادخل_رقم_الجوال")}
              type="text"
              disabled
              name="phone"
              noLabel
              startIcon="/images/icons/phone.svg"
              customStyle={{ width: "100%" }}
              inputStyle={{ background: "#fff", border: "none" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label={t("components_home_companyInfo.الهوية_الوطنة_رقم_الاقامة")}
              value={profile?.data?.identityNumber ?? "لا يوجد رقم للاقامه "}
              placeholder={t("components_home_companyInfo.الهوية_الوطنة_رقم_الاقامة")}
              type="text"
              disabled
              name="national"
              noLabel
              startIcon="/images/icons/nid.svg"
              endIcon={<Typography></Typography>}
              customStyle={{ width: "100%" }}
              inputStyle={{ background: "#fff", border: "none" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label={t("components_home_companyInfo.البريد_الالكتروني")}
              value={profile?.data?.email ?? t("components_home_companyInfo.لا_يوجد_بريد_الكتروني")}
              placeholder={t("components_home_companyInfo.البريد_الالكتروني")}
              type="email"
              disabled
              name="email"
              noLabel
              startIcon="/images/icons/email.svg"
              endIcon={<Typography></Typography>}
              customStyle={{ width: "100%" }}
              inputStyle={{ background: "#fff", border: "none" }}
            />
          </Grid>
        </Grid>
   
     
        {profile.data.role.name == t("components_home_companyInfo.مقدم_خدمة") && (
          <CorMainInfo info={profile?.data} />
        )}
      </Box>
    </Box>
  );
}
