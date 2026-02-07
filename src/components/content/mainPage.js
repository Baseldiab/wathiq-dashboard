import { useTranslation } from "next-i18next";
import { useRef } from "react";
import { Typography, Box, Grid, Divider } from "@mui/material";
import Button from "@/components/button";
import Input from "@/components/inputs";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Loader from "@/components/loader";
import Snackbar from "@/components/toastMsg/index.js";
import constants from "@/services/constants";
import {
  getAllPartners,
  deletePartner,
  createPartner,
} from "@/Redux/slices/partnerSlice";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import ErrorMsg from "@/components/error-message/index";
import { getSetting, updateSetting } from "@/Redux/slices/settingSlice";
import {
  getAllSliders,
  createSlider,
  deleteSlider,
} from "@/Redux/slices/sliderSlice";
import { truncateFileName, isEmptyObject, hasRole } from "@/services/utils";


export default function MainPage({}) {
  const { t } = useTranslation();
  
const messages = {
  name: t("components_content_mainPage.الاسم_اجباري"),
  logo: t("components_content_mainPage.الملف_اجباري"),
  title: t("components_content_mainPage.العنوان_اجباري"),
  description: t("components_content_mainPage.الوصف_اجباري"),
  website: t("components_content_mainPage.الملف_اجباري"),
  mobile: t("components_content_mainPage.الملف_اجباري"),
};
  const logoFileInputRef = useRef(null);
  const websiteFileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);

  const [fileType, setFileType] = useState("");
  const [data, setData] = useState({ mainTitle: "", mainDescription: "" });
  const [open, setOpen] = useState(false);
  const [showSubmitPartner, setShowSubmitPartner] = useState(false);
  const [showSubmitSlider, setShowSubmitSlider] = useState(false);
  const [alert, setAlert] = useState({});
  const [partner, setPartner] = useState({ name: "", logo: null });
  const [slider, setSlider] = useState({
    description: "",
    mobile: null,
    website: null,
  });
  const [errors, setErrors] = useState();

  const { allPartners, loading, updateLoading } = useSelector(
    (state) => state.partner
  );

  const { setting, loading: settingLoading } = useSelector(
    (state) => state.setting
  );

  const {
    allSliders,
    loading: sliderLoading,
    updateLoading: sliderUpdateLoading,
  } = useSelector((state) => state.slider);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!allPartners && hasRole("manage partners")) dispatch(getAllPartners());
    if (!allSliders && hasRole("manage sliders")) dispatch(getAllSliders({}));
    if (!setting) dispatch(getSetting());
    else
      setData({
        mainDescription: setting?.data?.mainDescription?.ar,
        mainTitle: setting?.data?.mainTitle?.ar,
      });
  }, [dispatch, allPartners, allSliders, setting]);

  const handleFileChange = async (event) => {
    if (fileType === "logo" && event?.target?.files?.length > 0)
      handlePartnerChange(event.target.files[0], "logo");
    if (fileType === "website" && event?.target?.files?.length > 0)
      handleSliderChange(event.target.files[0], "website");
    if (fileType === "mobile" && event?.target?.files?.length > 0)
      handleSliderChange(event.target.files[0], "mobile");
  };

  const handleIconClick = (name) => {
    setFileType(name);
    if (name === "logo") logoFileInputRef.current.click();
    if (name === "website") websiteFileInputRef.current.click();
    if (name === "mobile") mobileFileInputRef.current.click();
  };

  const handlePartnerChange = (value, name) => {
    setErrors({ ...errors, [name]: "" });
    setPartner({ ...partner, [name]: value });
  };

  const handleSliderChange = (value, name) => {
    setErrors({ ...errors, [name]: "" });
    setSlider({ ...slider, [name]: value });
  };

  const handleSettingChange = (value, name) =>
    setData({ ...data, [name]: value });

  const handleShowSubmitPartner = () => {
    setShowSubmitPartner(true);
  };

  const handleShowSubmitSlider = () => {
    setShowSubmitSlider(true);
  };

  const handleUpdateSetting = async () => {
    let response = await dispatch(
      updateSetting({
        ...setting.data,
        mainDescription: {
          ar: data.mainDescription,
        },
        mainTitle: {
          ar: data.mainTitle,
        },
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      dispatch(getSetting());
    }
  };

  const handleSubmitPartner = async () => {
    const errors = isEmptyObject(partner, messages);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    let response = await dispatch(
      createPartner({ logo: partner.logo, name: { ar: partner.name } })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      setShowSubmitPartner(false);
      setPartner({ logo: null, name: "" });
      dispatch(getAllPartners());
      setAlert({ msg: t("components_content_mainPage.تم_الاضافة_بنجاح"), type: "success" });
    } else {
      setAlert({ msg: response?.payload, type: "error" });
    }
    setOpen(true);
  };

  const handleRemovePartner = async (id) => {
    let response = await dispatch(deletePartner(id));
    if (response?.meta?.requestStatus === "fulfilled") {
      dispatch(getAllPartners());
      setAlert({ msg: t("components_content_mainPage.تم_الحذف_بنجاح"), type: "success" });
    } else setAlert({ msg: response?.payload, type: "error" });
    setOpen(true);
  };

  const handleSubmitSlider = async () => {
    const errors = isEmptyObject(slider, messages);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    let response = await dispatch(
      createSlider({
        websiteImage: slider.website,
        mobileImage: slider.mobile,
        title: { ar: slider.description },
      })
    );
    if (response?.meta?.requestStatus === "fulfilled") {
      setShowSubmitSlider(false);
      setSlider({ website: null, mobile: null, description: "" });
      dispatch(getAllSliders());
      setAlert({ msg: t("components_content_mainPage.تم_الاضافة_بنجاح"), type: "success" });
    } else {
      setAlert({ msg: response?.payload, type: "error" });
    }
    setOpen(true);
  };

  const handleRemoveSlider = async (id) => {
    let response = await dispatch(deleteSlider(id));
    if (response?.meta?.requestStatus === "fulfilled") {
      dispatch(getAllSliders());
      setAlert({ msg: t("components_content_mainPage.تم_الحذف_بنجاح"), type: "success" });
    } else setAlert({ msg: response?.payload, type: "error" });
    setOpen(true);
  };

  if (loading || sliderLoading || settingLoading) return <Loader open={true} />;

  return (
    // <Box
    //   sx={{
    //     padding: "24px 32px",
    //     borderRadius: "20px",
    //     background: "#FFFFFF",
    //     width: "100%",
    //     display: "flex",
    //     flexDirection: "column",
    //     gap: "20px",
    //   }}
    // >
    //   <>
    //     <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
    //       <Typography
    //         sx={{ color: "#202726", fontWeight: 700, fontSize: "1rem" }}
    //       >
    //         القسم الرئيسي
    //       </Typography>
    //       <Input
    //         label={t("components_content_mainPage.العنوان")}
    //         placeholder={t("components_content_mainPage.العنوان")}
    //         type="text"
    //         handleChange={handleSettingChange}
    //         value={data?.mainTitle}
    //         name="mainTitle"
    //         customStyle={{ width: "100%" }}
    //       />
    //       <Input
    //         label={t("components_content_mainPage.الوصف")}
    //         placeholder={t("components_content_mainPage.الوصف")}
    //         type="text"
    //         handleChange={handleSettingChange}
    //         value={data?.mainDescription}
    //         name="mainDescription"
    //         customStyle={{ width: "100%" }}
    //       />
    //     </Box>
    //     {hasRole("update setting") && (
    //       <Box>
    //         <Button handleClick={handleUpdateSetting} text={t("components_content_mainPage.حفظ_التعديلات")} />
    //       </Box>
    //     )}
    //   </>

    //   {hasRole("manage partners") && (
    //     <>
    //       <Divider sx={{ my: 3 }} />
    //       <Box
    //         sx={{
    //           mt: 1,
    //           display: "flex",
    //           flexDirection: "column",
    //           gap: "12px",
    //           justifyContent: "start",
    //         }}
    //       >
    //         <Typography
    //           sx={{ color: "#202726", fontWeight: 700, fontSize: "1rem" }}
    //         >
    //           شركاء المزادات
    //         </Typography>
    //         <Box
    //           sx={{
    //             flexGrow: 1,
    //             alignItems: "center",
    //             // maxHeight: "150px",
    //             overflowY: "auto",
    //             scrollbarXWidth: "none",
    //             overflowX: "hidden",
    //             padding: "0px 5px",
    //           }}
    //         >
    //           {allPartners?.data?.length > 0
    //             ? allPartners.data.map((partner) => (
    //                 <Grid
    //                   sx={{ alignItems: "end", my: 2 }}
    //                   container
    //                   spacing={2}
    //                 >
    //                   <Grid item xs={12} md={6}>
    //                     <Input
    //                       label={t("components_content_mainPage.اسم_الشركة")}
    //                       placeholder={t("components_content_mainPage.اسم_الشركة")}
    //                       type="text"
    //                       disabled={true}
    //                       // handleChange={handleInputChange}
    //                       value={partner?.name}
    //                       name="name"
    //                       customStyle={{ width: "100%" }}
    //                     />
    //                   </Grid>
    //                   <Grid item xs={10} md={5}>
    //                     <a href={partner?.logo} target="_blank">
    //                       <Box
    //                         sx={{
    //                           borderRadius: "12px",
    //                           border: "1.5px solid #D6D9E1",
    //                           padding: "16px 12px",
    //                           display: "flex",
    //                           justifyContent: "space-between",
    //                           gap: "8px",
    //                           alignItems: "center",
    //                         }}
    //                       >
    //                         <Typography
    //                           sx={{
    //                             fontSize: "0.9rem",
    //                             fontWeight: "500",
    //                             color: "#24262d",
    //                             textDecoration: "none",
    //                           }}
    //                         >
    //                           {truncateFileName(partner?.logo)}
    //                         </Typography>
    //                         <CheckCircleSharpIcon sx={{ color: "#23614f" }} />
    //                       </Box>
    //                     </a>
    //                   </Grid>
    //                   <Grid sx={{ p: 0, mb: 1 }} item xs={2} md={1}>
    //                     <img
    //                       onClick={() => handleRemovePartner(partner._id)}
    //                       src="/images/trash-red.svg"
    //                       style={{ cursor: "pointer", marginTop: "-40px" }}
    //                     />
    //                   </Grid>
    //                 </Grid>
    //               ))
    //             : null}
    //         </Box>
    //       </Box>
    //       {(showSubmitPartner || allPartners?.data?.length == 0) && (
    //         <Grid sx={{ alignItems: "end", my: 0 }} container spacing={2}>
    //           <Grid item xs={12} md={6}>
    //             <Input
    //               label={t("components_content_mainPage.اسم_الشركة")}
    //               placeholder={t("components_content_mainPage.اسم_الشركة")}
    //               type="text"
    //               handleChange={handlePartnerChange}
    //               value={partner?.name}
    //               name="name"
    //               customStyle={{ width: "100%" }}
    //             />
    //             {errors?.name && <ErrorMsg message={errors?.name} />}
    //           </Grid>
    //           <Grid item xs={12} md={5}>
    //             <Box
    //               sx={{
    //                 borderRadius: "12px",
    //                 border: "1.5px solid #D6D9E1",
    //                 padding: "12px 12px",
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 gap: "8px",
    //                 alignItems: "center",
    //               }}
    //               onClick={() => handleIconClick("logo")}
    //             >
    //               <Typography
    //                 sx={{
    //                   fontSize: "0.9rem",
    //                   fontWeight: "500",
    //                   color: "#24262d",
    //                   textDecoration: "none",
    //                 }}
    //               >
    //                 {partner?.logo
    //                   ? truncateFileName(partner?.logo)
    //                   : " اللوجو (144px*144px)"}
    //               </Typography>
    //               <img src="/images/upload.svg" style={{ cursor: "pointer" }} />
    //             </Box>
    //             {errors?.logo && <ErrorMsg message={errors?.logo} />}
    //           </Grid>
    //           <input
    //             type="file"
    //             accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg"
    //             ref={logoFileInputRef}
    //             style={{ display: "none" }}
    //             onChange={handleFileChange}
    //           />
    //         </Grid>
    //       )}
    //       <Box>
    //         <Button
    //           type={
    //             showSubmitPartner || allPartners?.data?.length == 0 ? "" : "add"
    //           }
    //           transparentBtn={!showSubmitPartner}
    //           disabled={
    //             (showSubmitPartner || allPartners?.data?.length == 0) &&
    //             updateLoading
    //           }
    //           handleClick={() =>
    //             showSubmitPartner || allPartners?.data?.length == 0
    //               ? handleSubmitPartner()
    //               : handleShowSubmitPartner()
    //           }
    //           customeStyle={
    //             showSubmitPartner || allPartners?.data?.length == 0
    //               ? {}
    //               : {
    //                   color: constants.colors.main,
    //                   background: "transparent",
    //                   border: `1px solid ${constants.colors.main}`,
    //                   "&:hover": {
    //                     color: constants.colors.main,
    //                     background: "transparent",
    //                     border: `1px solid ${constants.colors.main}`,
    //                     boxShadow: "none",
    //                   },
    //                 }
    //           }
    //           text={
    //             showSubmitPartner || allPartners?.data?.length == 0
    //               ? updateLoading
    //                 ? t("components_content_mainPage.جاري_التحميل")
    //                 : t("components_content_mainPage.تأكيد")
    //               : t("components_content_mainPage.اضافة_شركة")
    //           }
    //         />
    //       </Box>
    //     </>
    //   )}

    //   {hasRole("manage sliders") && (
    //     <>
    //       <Divider sx={{ my: 3 }} />
    //       <Box
    //         sx={{
    //           mt: 1,
    //           display: "flex",
    //           flexDirection: "column",
    //           gap: "12px",
    //           justifyContent: "start",
    //         }}
    //       >
    //         <Typography
    //           sx={{ color: "#202726", fontWeight: 700, fontSize: "1rem" }}
    //         >
    //           البانر الدعائي
    //         </Typography>
    //         <Box
    //           sx={{
    //             flexGrow: 1,
    //             alignItems: "center",
    //             // maxHeight: "150px",
    //             overflowY: "auto",
    //             scrollbarXWidth: "none",
    //             overflowX: "hidden",
    //             padding: "0px 5px",
    //           }}
    //         >
    //           {allSliders?.data[0]?.images?.length > 0
    //             ? allSliders.data[0]?.images?.map((slider) => (
    //                 <Grid
    //                   sx={{ alignItems: "end", my: 2 }}
    //                   container
    //                   spacing={2}
    //                 >
    //                   <Grid item xs={12} lg={6} md={12}>
    //                     <Input
    //                       label={t("components_content_mainPage.وصف_البانر")}
    //                       placeholder={t("components_content_mainPage.وصف_البانر")}
    //                       type="text"
    //                       disabled={true}
    //                       value={slider?.title}
    //                       name="title"
    //                       customStyle={{ width: "100%" }}
    //                     />
    //                   </Grid>
    //                   <Grid item xs={5} lg={2.5} md={5}>
    //                     <a href={slider?.websiteImage} target="_blank">
    //                       <Box
    //                         sx={{
    //                           borderRadius: "12px",
    //                           border: "1.5px solid #D6D9E1",
    //                           padding: {
    //                             md: "16px 12px",
    //                             xs: "16px 4px",
    //                           },
    //                           display: "flex",
    //                           justifyContent: "space-between",
    //                           gap: "8px",
    //                           alignItems: "center",
    //                         }}
    //                       >
    //                         <Typography
    //                           sx={{
    //                             fontSize: "0.9rem",
    //                             fontWeight: "500",
    //                             color: "#24262d",
    //                             textDecoration: "none",
    //                           }}
    //                         >
    //                           {truncateFileName(slider?.websiteImage)}
    //                         </Typography>
    //                         <CheckCircleSharpIcon sx={{ color: "#23614f" }} />
    //                       </Box>
    //                     </a>
    //                   </Grid>
    //                   <Grid item xs={5} lg={2.5} md={5}>
    //                     <a href={slider?.mobileImage} target="_blank">
    //                       <Box
    //                         sx={{
    //                           borderRadius: "12px",
    //                           border: "1.5px solid #D6D9E1",
    //                           padding: {
    //                             md: "16px 12px",
    //                             xs: "16px 4px",
    //                           },
    //                           display: "flex",
    //                           justifyContent: "space-between",
    //                           gap: "8px",
    //                           alignItems: "center",
    //                         }}
    //                       >
    //                         <Typography
    //                           sx={{
    //                             fontSize: "0.9rem",
    //                             fontWeight: "500",
    //                             color: "#24262d",
    //                             textDecoration: "none",
    //                           }}
    //                         >
    //                           {truncateFileName(slider?.mobileImage)}
    //                         </Typography>
    //                         <CheckCircleSharpIcon sx={{ color: "#23614f" }} />
    //                       </Box>
    //                     </a>
    //                   </Grid>
    //                   <Grid sx={{ p: 0, mb: 1 }} item xs={1} lg={1} md={1}>
    //                     <img
    //                       onClick={() => handleRemoveSlider(slider._id)}
    //                       src="/images/trash-red.svg"
    //                       style={{ cursor: "pointer", marginTop: "-40px" }}
    //                     />
    //                   </Grid>
    //                 </Grid>
    //               ))
    //             : null}
    //         </Box>
    //       </Box>
    //       {(showSubmitSlider || allSliders?.data[0]?.images?.length == 0) && (
    //         <Grid sx={{ alignItems: "end", my: 0 }} container spacing={2}>
    //           <Grid item xs={12} lg={6} md={12}>
    //             <Input
    //               label={t("components_content_mainPage.وصف_البانر")}
    //               placeholder={t("components_content_mainPage.حمل_تطبيق_وثيق_للمزادات")}
    //               type="text"
    //               handleChange={handleSliderChange}
    //               value={slider?.description}
    //               name="description"
    //               customStyle={{ width: "100%" }}
    //             />
    //             {errors?.description && (
    //               <ErrorMsg message={errors?.description} />
    //             )}
    //           </Grid>
    //           <Grid item xs={6} lg={2.5} md={5}>
    //             <Box
    //               sx={{
    //                 borderRadius: "12px",
    //                 border: "1.5px solid #D6D9E1",
    //                 padding: {
    //                   md: "12px 12px",
    //                   xs: "12px 4px",
    //                 },
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 gap: "8px",
    //                 alignItems: "center",
    //               }}
    //               onClick={() => handleIconClick("website")}
    //             >
    //               <Typography
    //                 sx={{
    //                   fontSize: "0.9rem",
    //                   fontWeight: "500",
    //                   color: "#24262d",
    //                   textDecoration: "none",
    //                 }}
    //               >
    //                 {slider?.website
    //                   ? truncateFileName(slider?.website)
    //                   : t("components_content_mainPage.البانر_للويب")}
    //               </Typography>
    //               <img src="/images/upload.svg" style={{ cursor: "pointer" }} />
    //             </Box>
    //             {errors?.website && <ErrorMsg message={errors?.website} />}
    //           </Grid>
    //           <Grid item xs={6} lg={2.5} md={5}>
    //             <Box
    //               sx={{
    //                 borderRadius: "12px",
    //                 border: "1.5px solid #D6D9E1",
    //                 padding: {
    //                   md: "12px 12px",
    //                   xs: "12px 4px",
    //                 },
    //                 display: "flex",
    //                 justifyContent: "space-between",
    //                 gap: "8px",
    //                 alignItems: "center",
    //               }}
    //               onClick={() => handleIconClick("mobile")}
    //             >
    //               <Typography
    //                 sx={{
    //                   fontSize: "0.9rem",
    //                   fontWeight: "500",
    //                   color: "#24262d",
    //                   textDecoration: "none",
    //                 }}
    //               >
    //                 {slider?.mobile
    //                   ? truncateFileName(slider?.mobile)
    //                   : t("components_content_mainPage.البانر_للهاتف")}
    //               </Typography>
    //               <img src="/images/upload.svg" style={{ cursor: "pointer" }} />
    //             </Box>
    //             {errors?.mobile && <ErrorMsg message={errors?.mobile} />}
    //           </Grid>
    //         </Grid>
    //       )}
    //       <Box>
    //         <Button
    //           type={
    //             showSubmitSlider || allSliders?.data[0]?.images?.length == 0
    //               ? ""
    //               : "add"
    //           }
    //           transparentBtn={!showSubmitSlider}
    //           disabled={
    //             (showSubmitSlider ||
    //               allSliders?.data[0]?.images?.length == 0) &&
    //             sliderUpdateLoading
    //           }
    //           handleClick={() =>
    //             showSubmitSlider || allSliders?.data[0]?.images?.length == 0
    //               ? handleSubmitSlider()
    //               : handleShowSubmitSlider()
    //           }
    //           customeStyle={
    //             showSubmitSlider || allSliders?.data[0]?.images?.length == 0
    //               ? {}
    //               : {
    //                   color: constants.colors.main,
    //                   background: "transparent",
    //                   border: `1px solid ${constants.colors.main}`,
    //                   "&:hover": {
    //                     color: constants.colors.main,
    //                     background: "transparent",
    //                     border: `1px solid ${constants.colors.main}`,
    //                     boxShadow: "none",
    //                   },
    //                 }
    //           }
    //           text={
    //             showSubmitSlider || allSliders?.data[0]?.images?.length == 0
    //               ? sliderUpdateLoading
    //                 ? t("components_content_mainPage.جاري_التحميل")
    //                 : t("components_content_mainPage.تأكيد")
    //               : t("components_content_mainPage.اضافة_بانر")
    //           }
    //         />
    //       </Box>
    //     </>
    //   )}
    //   <input
    //     type="file"
    //     accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg"
    //     ref={mobileFileInputRef}
    //     style={{ display: "none" }}
    //     onChange={handleFileChange}
    //   />
    //   <input
    //     type="file"
    //     accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg"
    //     ref={websiteFileInputRef}
    //     style={{ display: "none" }}
    //     onChange={handleFileChange}
    //   />
    //   <Snackbar
    //     type={alert.type}
    //     open={open}
    //     setOpen={setOpen}
    //     message={alert.msg}
    //   />
    // </Box>
    <>{t("components_content_mainPage.الشاشه_الرئيسية")}</>
  );
}
