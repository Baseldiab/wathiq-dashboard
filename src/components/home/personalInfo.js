import { useTranslation } from "next-i18next";
import { useState, useEffect, useRef } from "react";
import { Typography, Box, Grid } from "@mui/material";
import constants from "@/services/constants";
import Image from "next/image";
import Input from "@/components/inputs";
import Backdrop from "@/components/backdrop";
import OTPForm from "@/components/home/change-data/otpForm.js";
import ConfirmPasswordForm from "@/components/home/change-data/confirmPasswordForm.js";
import EmailForm from "@/components/home/change-data/emailForm.js";
import PhoneForm from "@/components/home/change-data/phoneForm.js";
import Success from "@/components/login/resetPassword/success.js";
import { isEmptyObject } from "@/services/utils";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/loader";
import {
  updateUserData,
  updateEmail,
  verifyCode,
  resetUserData,
  askForUpdateEmail,
  askForUpdatephoneNumber,
  updatePhone,
  updatePassword,
} from "@/Redux/slices/globalSlice";
import {
  updateUserProfile,
  updateProfile,
  getProfile,
} from "@/Redux/slices/profileSlice";
import ProfileImg from "../image-box/profile-img";
import CustomButton from "@/components/button";

export default function PersonalInfo() {
  const { t } = useTranslation();

  const messages = {
    oldPassword: t("components_home_personalInfo.كلمة_المرور_القديمة_اجباري"),
    password: t("components_home_personalInfo.كلمة_المرور_اجباري"),
    confirmPassword: t("components_home_personalInfo.اعادة_كلمة_المرور_اجباري"),
    minMatch: t("components_home_personalInfo.كلمة_المرور_وتأكيد_كلمة"),
    email: t("components_home_personalInfo.البريد_الالكتروني_اجباري"),
    phone: " رقم الجوال اجباري",
  };
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState();
  const [otp, setOtp] = useState("");
  const [initialSeconds, setInitialSeconds] = useState(60);
  const [formType, setFormType] = useState("");
  const [action, setAction] = useState("");
  const [errors, seErrors] = useState({});
  const [data, setData] = useState();
  const [otpcode, setOTPCode] = useState("");
  const [opensnack, setopenSnack] = useState(false);

  const dispatch = useDispatch();
  const {
    data: profile,
    reload,
    updateProfileFlag,
  } = useSelector((state) => state.profile);
  const [newName, setNewName] = useState(profile?.data?.name || "");

  const { updateData } = useSelector((state) => state.global);
  useEffect(() => {
    if (action === "password") {
      setData({
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
    } else if (action === "email") {
      setData({
        email: "",
      });
    } else if (action === "phone") {
      setData({
        phone: "",
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

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      setError(t("components_home_personalInfo.رمز_التأكيد_اجباري"));
      return;
    }
    let response = await dispatch(
      verifyCode({
        identityNumber: profile?.data?.identityNumber,
        code: otp,
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      setFormType(action);
    } else {
      setError(response?.payload);
      return;
    }
  };

  const handleOTPChange = (val) => {
    setError("");
    if (!/^[0-9]*$/.test(val)) return;
    setOtp(val);
  };

  const handleInputChange = (value, name) => {
    seErrors({ ...errors, [name]: "", minMatch: "" });
    setError("");
    setData({ ...data, [name]: value });
    dispatch(updateUserData({ key: name, value }));
  };

  const handleSubmitResetPassword = async () => {
    const errors = isEmptyObject(data, messages);
    if (Object.keys(errors).length > 0) {
      seErrors(errors);
      return;
    }
    if (data.password !== data.confirmPassword) {
      seErrors({
        minMatch: t("components_home_personalInfo.كلمة_المرور_وتأكيد_كلمة"),
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
    dispatch(resetUserData());
  };

  const handleChangeData = async (action, type) => {
    setAction(action);
    setFormType(type);
    dispatch(updateUserData({ key: "type", value: action }));
    let response;
    if (action === "email") response = await dispatch(askForUpdateEmail());
    if (action === "phone")
      response = await dispatch(askForUpdatephoneNumber());

    if (
      response?.meta?.requestStatus === "fulfilled" ||
      action === "password"
    ) {
      handleOpen();
      setopenSnack(true);
      setOTPCode(response?.payload?.data?.code);
      console.log(response);
    }
  };

  const handleResetData = () => {
    setError();
    setOtp("");
    setInitialSeconds(60);
    setFormType("");
    setAction("");
    seErrors({});
    setData();
  };

  const handleSubmitResetEmail = async () => {
    const errors = isEmptyObject(data, messages);
    if (Object.keys(errors).length > 0) {
      seErrors(errors);
      return;
    }
    let response = await dispatch(updateEmail({ email: updateData?.email }));
    if (response?.meta?.requestStatus === "fulfilled") {
      setOtp("");
      setInitialSeconds(60);
      setopenSnack(true);
      setOTPCode(response?.payload?.data?.code);
      setFormType("confirm-otp");
    } else {
      setError(response?.payload);
    }
  };

  const handleEmailConfirmOTPSubmit = async () => {
    if (otp.length !== 6) {
      setError(t("components_home_personalInfo.رمز_التأكيد_اجباري"));
      return;
    }
    let response = await dispatch(
      verifyCode({
        identityNumber: profile?.data?.identityNumber,
        code: otp,
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      setOtp("");
      setInitialSeconds(60);
      setFormType("success");
      dispatch(updateUserProfile());
    } else {
      setError(response?.payload);
    }
  };

  const handleSubmitResetPhone = async () => {
    const errors = isEmptyObject(data, messages);
    if (Object.keys(errors).length > 0) {
      seErrors(errors);
      return;
    }
    let response = await dispatch(
      updatePhone({
        phoneNumber: {
          number: updateData?.phone,
          key: "+966",
        },
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      setOtp("");
      setInitialSeconds(60);
      setFormType("confirm-otp");
      setopenSnack(true);
      setOTPCode(response?.payload?.data?.code);
    } else {
      setError(response?.payload);
    }
  };

  const handlePhoneConfirmOTPSubmit = async () => {
    if (otp.length !== 6) {
      setError(t("components_home_personalInfo.رمز_التأكيد_اجباري"));
      return;
    }
    let response = await dispatch(
      verifyCode({
        identityNumber: profile?.data?.identityNumber,
        code: otp,
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      setOtp("");
      setInitialSeconds(60);
      setFormType("success");
      dispatch(updateUserProfile());
    } else {
      setError(response?.payload);
    }
  };
  console.log(t("components_home_personalInfo.تم_تغير_البريد_الالكتروني"));
  const showBackDropContent = () => {
    if (action === "password") {
      switch (formType) {
        // case "otp":
        //   return (
        //     <OTPForm
        //       title={t("components_home_personalInfo.أدخل_رمز_التحقق")}
        //       initialSeconds={initialSeconds}
        //       setInitialSeconds={setInitialSeconds}
        //       handleOTPChange={handleOTPChange}
        //       otp={otp}
        //       setOtp={setOtp}
        //       error={error}
        //       handleOTPSubmit={handleOTPSubmit}
        //     />
        //   );
        case "password":
          return (
            <ConfirmPasswordForm
              error={error}
              handleInputChange={handleInputChange}
              data={data}
              errors={errors}
              handleResetPassword={handleSubmitResetPassword}
              handleClose={handleClose}
            />
          );
        case "success":
          return <Success showBtn={false} handleClose={handleClose} />;

        default:
          break;
      }
    } else if (action === "email") {
      switch (formType) {
        case "otp":
          return (
            <OTPForm
              action
              title={t(
                "components_home_personalInfo.تحقق_البريد_الالكتروني_الجديد"
              )}
              subtitle={{
                head: t("components_home_personalInfo.فضلا_ادخل_الرمز_المكون"),
                subHead: "",
              }}
              initialSeconds={initialSeconds}
              setInitialSeconds={setInitialSeconds}
              handleOTPChange={handleOTPChange}
              otp={otp}
              setOtp={setOtp}
              error={error}
              handleOTPSubmit={handleOTPSubmit}
              handleClose={handleClose}
              setOpen={setopenSnack}
              otpcode={otpcode}
              setOTPCode={setOTPCode}
              open={opensnack}
            />
          );
        case "email":
          return (
            <EmailForm
              error={error}
              data={data}
              errors={errors}
              handleInputChange={handleInputChange}
              handleSubmitResetEmail={handleSubmitResetEmail}
              handleClose={handleClose}
            />
          );
        case "confirm-otp":
          return (
            <OTPForm
              title={t(
                "components_home_personalInfo.تأكيد_البريد_الالكتروني_الجديد"
              )}
              subtitle={{
                head: t("components_home_personalInfo.أدخل_رمز_الرسالة_النصية"),
                subHead: `${updateData.email}  لتأكيد البريد الالكتروني `,
              }}
              initialSeconds={initialSeconds}
              setInitialSeconds={setInitialSeconds}
              handleOTPChange={handleOTPChange}
              otp={otp}
              setOtp={setOtp}
              error={error}
              handleOTPSubmit={handleEmailConfirmOTPSubmit}
              setOpen={setopenSnack}
              otpcode={otpcode}
              setOTPCode={setOTPCode}
              open={opensnack}
            />
          );
        case "success":
          return (
            <Success
              showBtn={false}
              text={`${t(
                "components_home_personalInfo.تم_تغير_البريد_الالكتروني"
              )} ${updateData.email}`}
              handleClose={handleClose}
            />
          );

        default:
          break;
      }
    } else if (action === "phone") {
      switch (formType) {
        case "otp":
          return (
            <OTPForm
              title={t("components_home_personalInfo.أدخل_رمز_التحقق")}
              initialSeconds={initialSeconds}
              setInitialSeconds={setInitialSeconds}
              handleOTPChange={handleOTPChange}
              otp={otp}
              setOtp={setOtp}
              error={error}
              handleOTPSubmit={handleOTPSubmit}
              handleClose={handleClose}
              setOpen={setopenSnack}
              otpcode={otpcode}
              setOTPCode={setOTPCode}
              open={opensnack}
            />
          );
        case "phone":
          return (
            <PhoneForm
              data={data}
              error={error}
              errors={errors}
              handleInputChange={handleInputChange}
              handleSubmitResetPhone={handleSubmitResetPhone}
              handleClose={handleClose}
            />
          );
        case "confirm-otp":
          return (
            <OTPForm
              // subtitle={{
              //   head: t("components_home_personalInfo.أدخل_رمز_الرسالة_النصية"),
              //   subHead: `${updateData.phone}  لتأكيد  رقم الجوال الجديد `,
              // }}
              title={t("components_home_personalInfo.التحقق_من_رقم_الجوال")}
              initialSeconds={initialSeconds}
              setInitialSeconds={setInitialSeconds}
              handleOTPChange={handleOTPChange}
              otp={otp}
              setOtp={setOtp}
              error={error}
              handleOTPSubmit={handlePhoneConfirmOTPSubmit}
              handleClose={handleClose}
              setOpen={setopenSnack}
              otpcode={otpcode}
              setOTPCode={setOTPCode}
              open={opensnack}
            />
          );
        case "success":
          return (
            <Success
              showBtn={false}
              text={`تم تغير رقم الجوال رقم الجوال الجديد هو : ${updateData.phone}`}
              handleClose={handleClose}
            />
          );

        default:
          break;
      }
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleSaveChanges = async () => {
    if (newName !== profile?.data?.name) {
      let response = await dispatch(updateProfile({ name: newName }));
      if (response?.meta?.requestStatus === "fulfilled") {
        dispatch(getProfile());
      }
    }
  };
  if (reload || updateProfileFlag) return <Loader open={true} />;
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
                lg: "40%",
              },
            }}
          >
            {showBackDropContent()}
          </Box>
        }
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: "35px",
          flexWrap: "wrap",
        }}
      >
        <ProfileImg
          src={profile?.data?.profileImage}
          defultSrc="/images/icons/Ellipse.svg"
          role={true}
          handleFileChange={handleFileChange}
        />

        {/* <Box sx={{ flex: 1, flex: "none" }}> */}
        <CustomButton
          handleClick={() => handleChangeData("password", "password")}
          text={t("components_home_personalInfo.تغير_كلمة_المرور")}
          customeStyle={{ mb: { xs: 1, md: 0 }, mt: { xs: 1, md: 0 } }}
        />
        {/* </Box> */}
      </Box>

      <Grid
        container
        spacing={3}
        sx={{ width: { xs: "100%", sm: "100%", lg: "70%" } }}
      >
        <Grid item xs={12} md={6}>
          <Input
            label={t("components_home_personalInfo.الإسم_بالكامل")}
            value={newName}
            onChange={handleNameChange}
            placeholder={t("components_home_personalInfo.الإسم_بالكامل")}
            type="text"
            // disabled
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
            label={t("components_home_personalInfo.رقم_الجوال")}
            value={profile?.data?.phoneNumber?.number}
            placeholder={t("components_home_personalInfo.ادخل_رقم_الجوال")}
            type="text"
            disabled
            name="phone"
            noLabel
            startIcon="/images/icons/phone.svg"
            endIcon={
              <CustomButton
                handleClick={() => handleChangeData("phone", "otp")}
                transparentBtn
                text={t("components_home_personalInfo.تغير")}
                customeStyle={{ color: constants.colors.main }}
              />
            }
            customStyle={{ width: "100%" }}
            inputStyle={{ background: "#fff", border: "none" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            label={t("components_home_personalInfo.الهوية_الوطنة_رقم_الاقامة")}
            value={profile?.data?.identityNumber ?? "لا يوجد رقم للاقامه "}
            placeholder={t(
              "components_home_personalInfo.الهوية_الوطنة_رقم_الاقامة"
            )}
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
            label={t("components_home_personalInfo.البريد_الالكتروني")}
            value={
              profile?.data?.email ??
              t("components_home_personalInfo.لا_يوجد_بريد_الكتروني")
            }
            placeholder={t("components_home_personalInfo.البريد_الالكتروني")}
            type="email"
            disabled
            name="email"
            noLabel
            startIcon="/images/icons/email.svg"
            endIcon={
              profile?.data?.email ? (
                <CustomButton
                  handleClick={() => handleChangeData("email", "otp")}
                  transparentBtn
                  text={t("components_home_personalInfo.تغير")}
                  customeStyle={{ color: constants.colors.main }}
                />
              ) : (
                <Typography></Typography>
              )
            }
            customStyle={{ width: "100%" }}
            inputStyle={{ background: "#fff", border: "none" }}
          />
        </Grid>
        <Grid item xs={7}>
          <CustomButton
            handleClick={handleSaveChanges}
            customeStyle={{ width: "100%" }}
            disabled={!newName || newName === profile?.data?.name} // Disable if no changes
            text={t("components_home_personalInfo.حفظ_التعديلات")}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
