import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EditOrigin, getOrigin, setOrigins } from "@/Redux/slices/originsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Box, Grid, InputAdornment, Typography } from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import { originSchema } from "@/services/schema";
import BreadcrumbsNav from "@/components/layout/navbar/bread-crumb-nav";
import CustomButton from "@/components/button";
import Input from "@/components/inputs";
import SectionHead from "@/components/corporate/main-info/section-head";
import GoogleMapInput from "@/components/map";
import DynamicFormSection from "@/components/dynamic-form-section";
import CustomSnackbar from "@/components/toastMsg";
import {
  determineAuctionStatuses,
  getFileType,
  getMainTabValue,
} from "@/services/utils";
import { getAuction } from "@/Redux/slices/auctionsSlice";
import File from "@/components/file";
import Loader from "@/components/loader";
import FileUpload from "@/components/file/file-upload";
import constants from "@/services/constants";
import PopupTitle from "@/components/popup-title";
import SAR from "@/components/sar";
const OriginDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { origin } = useSelector((state) => state.origins);
  const [newSectionName, setNewSectionName] = useState("");
  const [errormsg, setError] = useState("");
  const [BtnClicked, setBtnClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const { originsList } = useSelector((state) => state.origins);
  const { auction } = useSelector((state) => state.auctions);
  const { editOriginsLoading } = useSelector((state) => state.origins);

  const selectedOriginList = originsList?.data?.auctionOrigins?.find(
    (item) => item._id === id
  )?.details;
  const selectedOrigin = origin?.data?.auctionOrigins?.find(
    (item) => item._id === id
  );
  const [sectionNames, setsectionNames] = useState(
    selectedOriginList?.map((item, index) => item.title)
  );
  const auctionData = auction?.data;
  const statueReviewFromApi = auctionData?.auctionReviewStatus?.status;
  const { reviewStatus, auctionStatus } = determineAuctionStatuses(auctionData);
  const inPlatform = auctionData?.status != "pending";
  // const [reviewStatus, setReviewState] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing(true);
  };
  useEffect(() => {
    if (id) {
      dispatch(getOrigin(id));
    }
  }, [dispatch, id]);

  const handleFormSubmit = async (values) => {
    let hasChanges = false;
    console.log("Received Form Values:", values);
    const formData = new FormData();
    // const attachments = files.map((file) => ["attachment", file]); // Create array format

    console.log("Processing Sections:", sectionNames);
    Object.entries(values)
      .filter(([key]) => sectionNames?.includes(key))
      .forEach(([sectionName, sectionData], sectionIndex) => {
        formData.append(`details[${sectionIndex}][title][ar]`, sectionName);
        Object.entries(sectionData).forEach(
          ([fieldName, fieldValue], fieldIndex) => {
            if (fieldName !== "auctionDetails") {
              formData.append(
                `details[${sectionIndex}][auctionDetails][${fieldIndex}][title][ar]`,
                fieldName
              );
              formData.append(
                `details[${sectionIndex}][auctionDetails][${fieldIndex}][description][ar]`,
                fieldValue
              );
              hasChanges = true;
            }
            hasChanges = true;
          }
        );
      });
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (key === "attachment" && Array.isArray(value)) {
        value.forEach((file) => {
          console.log("FILEEEE", file);

          formData.append("attachment", file);
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      }
      // if (key === "attachment") {
      //   console.log("attachment");

      //   value.forEach((file) => {
      //     if (file instanceof File) {
      //       formData.append("attachment", file);
      //     } else {
      //       console.warn("Invalid file format detected:", file);
      //     }
      //   });
      // }
      else if (
        typeof value === "object" &&
        value !== null &&
        !sectionNames.includes(key)
      ) {
        Object.keys(value).forEach((subKey) => {
          if (value[subKey]) {
            formData.append(`${key}[${subKey}]`, value[subKey]);
          }
        });
      } else if (value) {
        formData.append(key, value);
      }
    });
    try {
      console.log("Dispatching EditOrigin API Call...");
      const response = await dispatch(EditOrigin({ formData, id })).unwrap();
      console.log("EditOrigin Response:", response);

      console.log("Fetching Updated Auction Data...");
      await dispatch(getAuction(auctionData?._id)).unwrap();

      console.log("Origin Edited Successfully:", response);
      setAlert({
        msg: t("pages_origins_details_[id].تم_التعديل_بنجاح"),
        type: "success",
      });
      setOpen(true);
      router.push(`/auctions/details/${auctionData?._id}`);
    } catch (error) {
      console.error("Request Failed:", error);
      setOpen(true);
      setAlert({ msg: error, type: "error" });
    }
  };
  // const formik = useFormik({
  //   initialValues: {
  //     title: { ar: "" },
  //     description: { ar: "" },
  //     openingPrice: "",
  //     entryDeposit: "",
  //     garlicDifference: "",
  //     location: {
  //       longitude: "",
  //       latitude: "",
  //       title: "",
  //     },
  //     attachment: [],
  //   },
  //   enableReinitialize: true,
  //   validationSchema: originSchema("edit"),
  //   onSubmit: handleFormSubmit,
  // });
  // useEffect(() => {}, [formik]);
  // useEffect(() => {
  //   if (selectedOrigin) {
  //     formik.setValues({
  //       title: { ar: selectedOrigin?.title ?? "" },
  //       description: { ar: selectedOrigin?.description ?? "" },
  //       openingPrice: selectedOrigin?.openingPrice ?? "",
  //       entryDeposit: selectedOrigin?.entryDeposit ?? "",
  //       garlicDifference: selectedOrigin?.garlicDifference ?? "",
  //       location: {
  //         longitude: selectedOrigin?.location?.longitude ?? "",
  //         latitude: selectedOrigin?.location?.latitude ?? "",
  //         title: selectedOrigin?.location?.title ?? "",
  //       },
  //       attachment: selectedOrigin?.attachment ?? [],
  //     });
  //   }
  // }, [selectedOrigin]);
  // console.log("Setting Formik values from selectedOrigin:", selectedOrigin);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: selectedOrigin?._id
      ? {
          title: { ar: selectedOrigin?.title ?? "" },
          description: { ar: selectedOrigin?.description ?? "" },
          openingPrice: selectedOrigin?.openingPrice ?? "",
          entryDeposit: selectedOrigin?.entryDeposit ?? "",
          garlicDifference: selectedOrigin?.garlicDifference ?? "",
          secondGarlicDifference: selectedOrigin?.secondGarlicDifference ?? "",
          location: {
            longitude: selectedOrigin?.location?.longitude ?? "",
            latitude: selectedOrigin?.location?.latitude ?? "",
            title: selectedOrigin?.location?.title ?? "",
            // longitude: 46.77497863769531,
            // latitude: 24.7240682410252,
            // title: "TITLE MAP TEST",
          },
          attachment: selectedOrigin?.attachment ?? [],
        }
      : {
          title: { ar: "" },
          description: { ar: "" },
          openingPrice: "",
          entryDeposit: "",
          garlicDifference: "",
          location: {
            longitude: "",
            latitude: "",
            title: "",
          },
          attachment: [],
        },
    validationSchema: originSchema("edit"),
    onSubmit: handleFormSubmit,
  });
  const handleOpenModal = () => {
    setOpenModal(true);
    setNewSectionName("");
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleAddSection = () => {
    if (newSectionName.trim() === "") {
      setError("يرجى إدخال الإسم ");
      return;
    }
    formik.setFieldValue(newSectionName, {});
    const updatedSections = [
      ...selectedOriginList,
      { title: newSectionName, fields: [] },
    ];
    const updatedOriginsList = originsList?.data?.auctionOrigins.map((origin) =>
      origin._id === id ? { ...origin, details: updatedSections } : origin
    );
    dispatch(
      setOrigins({
        ...originsList,
        data: { auctionOrigins: updatedOriginsList },
      })
    );
    setsectionNames([...sectionNames, newSectionName]);

    console.log("Updated Sections:", updatedSections);
    console.log("Updated Redux State:", updatedOriginsList);

    setNewSectionName(""); //////????????
    setError("");
    setOpenModal(false);
  };
  // const handleFileChange = (event, name) => {
  //   const selectedFiles = Array.from(event.target.files);
  //   formik.setFieldValue(name, selectedFiles);
  // };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue("attachment", [...formik.values.attachment, ...files]);
  };
  // const handleFileChange = (event) => {
  //   const newFiles = Array.from(event.target.files);
  //   formik.setFieldValue("attachment", (prevValue) => [
  //     ...prevValue,...newFiles]);
  // };

  if (editOriginsLoading) return <Loader open={true} />;

  return (
    <>
      <Head>
        <title>{t("pages_origins_details_[id].تفاصيل_أصل")}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Box>
        <BreadcrumbsNav
          title={t("pages_origins_details_[id].إدارة_المزادات")}
          links={[
            {
              href: "/auctions",
              label: t("pages_origins_details_[id].إدارة_المزادات"),
            },
            {
              href: `/auctions?mainTab=${getMainTabValue(
                statueReviewFromApi,
                auctionData?.status,
                auctionData?.createdByAdmin
              )}`,
              label: reviewStatus,
            },
            inPlatform && {
              label: auctionStatus + t("pages_origins_details_[id].ة"),
              noHref: true,
            },
            {
              href: `/auctions/details/${auctionData?._id}`,
              label: "مزاد " + auctionData?.title,
            },
          ]}
          currentText={selectedOrigin?.title}
        />
        <SectionHead title="" action>
          {!isEditing && statueReviewFromApi == "pending" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <CustomButton
                customeStyle={{
                  width: "100px",
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
                handleClick={handleEditClick}
                text={t("pages_origins_details_[id].تعديل")}
                type="edit"
              />
            </Box>
          )}
          <Typography
            sx={{ mb: 2, fontSize: "24px", fontWeight: 700, color: "#202726" }}
          >
            تفاصيل الأصل{" "}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Input
                label="إسم الأصل "
                name="title.ar"
                placeholder="إسم الأصل "
                value={formik?.values?.title?.ar}
                onChange={(e) =>
                  formik.setFieldValue("title.ar", e.target.value)
                }
                error={formik.touched?.title?.ar && formik?.errors?.title?.ar}
                customStyle={{ width: "100%" }}
                inputStyle={{
                  backgroundColor: !isEditing && "#FFFFFF",
                }}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("title.ar", true);
                }}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12}>
              <Input
                label={t("pages_origins_details_[id].الوصف")}
                name="description.ar"
                placeholder={t("pages_origins_details_[id].الوصف")}
                value={formik?.values?.description?.ar}
                onChange={(e) =>
                  formik.setFieldValue("description.ar", e.target.value)
                }
                error={
                  formik?.touched?.description?.ar &&
                  formik?.errors?.description?.ar
                }
                customStyle={{ width: "100%" }}
                inputStyle={{
                  backgroundColor: !isEditing && "#FFFFFF",
                }}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("description.ar", true);
                }}
                disabled={!isEditing}
                descreption
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Input
                label={t("pages_origins_details_[id].السعر_الإفتتاحي")}
                name="openingPrice"
                placeholder={t("pages_origins_details_[id].السعر_الإفتتاحي")}
                value={formik.values.openingPrice}
                onChange={(e) =>
                  formik.setFieldValue("openingPrice", e.target.value)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {" "}
                      <SAR img="/images/icons/SAR.svg" />
                    </InputAdornment>
                  ),
                  style: {
                    backgroundColor: !isEditing && "#FFFFFF",
                  },
                }}
                error={
                  formik.touched.openingPrice && formik.errors.openingPrice
                }
                customStyle={{ width: "100%" }}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("openingPrice", true);
                }}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              <Input
                label={t("pages_origins_details_[id].عربون_الدخول")}
                name="entryDeposit"
                placeholder={t("pages_origins_details_[id].عربون_الدخول")}
                value={formik.values.entryDeposit}
                onChange={(e) =>
                  formik.setFieldValue("entryDeposit", e.target.value)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {" "}
                      <SAR img="/images/icons/SAR.svg" />
                    </InputAdornment>
                  ),
                  style: {
                    backgroundColor: !isEditing && "#FFFFFF",
                  },
                }}
                error={
                  formik.touched.entryDeposit && formik.errors.entryDeposit
                }
                customStyle={{ width: "100%" }}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("entryDeposit", true);
                }}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              <Input
                label={t("pages_origins_details_[id].فرق_السوم_الأول")}
                name="garlicDifference"
                placeholder={t("pages_origins_details_[id].فرق_السوم_الأول")}
                value={formik?.values?.garlicDifference}
                onChange={(e) =>
                  formik.setFieldValue("garlicDifference", e.target.value)
                }
                error={
                  formik.touched.garlicDifference &&
                  formik.errors.garlicDifference
                }
                customStyle={{ width: "100%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {" "}
                      <SAR img="/images/icons/SAR.svg" />
                    </InputAdornment>
                  ),
                  style: {
                    backgroundColor: !isEditing && "#FFFFFF",
                  },
                }}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("garlicDifference", true);
                }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Input
                label={t("pages_origins_details_[id].فرق_السوم_الثاني")}
                name="secondGarlicDifference"
                placeholder={t("pages_origins_details_[id].فرق_السوم_الثاني")}
                value={formik?.values?.secondGarlicDifference}
                onChange={(e) =>
                  formik.setFieldValue("secondGarlicDifference", e.target.value)
                }
                error={
                  formik.touched.secondGarlicDifference &&
                  formik.errors.secondGarlicDifference
                }
                customStyle={{ width: "100%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {" "}
                      <SAR img="/images/icons/SAR.svg" />
                    </InputAdornment>
                  ),
                  style: {
                    backgroundColor: !isEditing && "#FFFFFF",
                  },
                }}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("secondGarlicDifference", true);
                }}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t("pages_origins_details_[id].موقع_الأصل")}
              </Typography>
              <GoogleMapInput
                value={formik?.values?.location}
                handleChange={(value) =>
                  formik?.setFieldValue("location", {
                    longitude: value?.longitude,
                    latitude: value?.latitude,
                    title: value?.title,
                  })
                }
                customStyle={{ width: "100%" }}
                inputStyle={{
                  backgroundColor: !isEditing && "#FFFFFF",
                }}
                disabled={!isEditing}
              />
            </Grid>

            {/* {formik?.values?.attachment?.map((img, index) => (
              <Grid item xs={12}>
                {isEditing ? (
                  <FileUpload
                    name="attachment"
                    label={t("pages_origins_details_[id].الوسائط_الصور")}
                    value={img ?? ""}
                    accept="image/*"
                    formik={formik}
                    handleFileChange={handleFileChange}
                    type={getFileType(img)}
                    error={
                      formik.touched.attachment && formik.errors.attachment
                    }
                    multi
                  />
                ) : (
                  <>
                    <Typography
                      sx={{
                        mb: 2,
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "#202726",
                      }}
                    >{t("pages_origins_details_[id].الصور_الوسائط")}</Typography>

                    <File
                      href={img}
                      type={getFileType(img)}
                      title={t("pages_origins_details_[id].مرفق_رقم")}
                    />
                  </>
                )}
              </Grid>
            ))} */}
            {/* {formik?.values?.attachment?.map((img, index) => ( */}
            <Grid item xs={12}>
              <Typography
                sx={{
                  mb: 3,
                  mt: 3,
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#202726",
                }}
              >
                {t("pages_origins_details_[id].الوسائط_صور_فيدوهات")}
              </Typography>

              <FileUpload
                name="attachment"
                label={t("pages_origins_details_[id].الوسائط_الصور")}
                value={formik?.values?.attachment}
                accept="image/*"
                formik={formik}
                handleFileChange={handleFileChange}
                error={formik.touched.attachment && formik.errors.attachment}
                multi
                {...(isEditing ? { isEditing: true } : {})}
              />
            </Grid>
            {/* ))} */}
          </Grid>
          <Typography
            sx={{
              mb: 6,
              mt: 3,
              fontSize: "24px",
              fontWeight: 700,
              color: "#202726",
            }}
          >
            {t("pages_origins_details_[id].التفاصيل")}
          </Typography>
          <Grid container spacing={3}>
            {selectedOriginList?.map((section, index) => (
              <DynamicFormSection
                key={index}
                title={section?.title}
                name={section?.title}
                fields={section?.auctionDetails}
                formik={formik}
                // onAddField={handleAddField}
                BtnClicked={BtnClicked}
                type="edit"
                disabled={!isEditing}
              />
            ))}
          </Grid>
          <Grid container spacing={{ xs: 2, md: 2 }} sx={{ p: 1 }}>
            <Grid item xs={10} sm={6} md={3}>
              <CustomButton
                handleClick={handleOpenModal}
                text={t("pages_origins_details_[id].إضافة_بند_جديد")}
                customeStyle={{
                  width: "100%",
                  bgcolor: constants.colors.light_green,
                  "&:hover": {
                    color: "#fff",
                    bgcolor: constants.colors.light_green,
                    boxShadow: "none",
                  },
                }}
                // disabled: !isEditing,
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
          {isEditing && (
            <Grid container spacing={{ xs: 2, md: 2 }} sx={{ px: 1, py: 3 }}>
              <Grid item xs={6} md={6}>
                <CustomButton
                  handleClick={() => {
                    setBtnClicked(true);
                    formik.submitForm();
                  }}
                  text={t("pages_origins_details_[id].تعديل_الاصل")}
                  Submitting
                  customeStyle={{ width: "100%" }}
                />
              </Grid>
            </Grid>
          )}
        </SectionHead>
        <CustomSnackbar
          type={alert.type}
          open={open}
          setOpen={setOpen}
          message={alert.msg}
        />
        <Backdrop
          open={openModal}
          onClick={handleCloseModal}
          sx={{ zIndex: "99" }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxHeight: "85%",
              overflow: "auto",
              bgcolor: "white",
              borderRadius: "12px",
              boxShadow: 3,
              width: {
                xs: "90%",
                sm: "80%",
                md: "60%",
                lg: "45%",
                xl: "30%",
              },
              p: 3,
            }}
          >
            <PopupTitle
              title=" إضافة بند جديد"
              handleClose={handleCloseModal}
            />
            <Input
              customStyle={{
                width: "100%",
                mt: 1,
              }}
              label="إسم البند*  "
              placeholder={t("pages_origins_details_[id].الإسم_هنا")}
              value={newSectionName}
              onChange={(e) => {
                setNewSectionName(e.target.value);
                if (errormsg) setError("");
              }}
              error={errormsg}
            />

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                gap: "24px",
                width: "100%",
              }}
            >
              <CustomButton
                customeStyle={{
                  width: "100%",
                  // background: "#023936",
                  // color: "#ffff",
                  // fontWeight: 700,
                  // border: "1px solid #D6D9E1",
                  // "&:hover": {
                  //   background: "#023936",
                  //   color: "#ffff",
                  //   boxShadow: "none",
                  // },
                }}
                handleClick={handleAddSection}
                text={t("pages_origins_details_[id].إضافة")}
              />
            </Box>
          </Box>
        </Backdrop>
      </Box>
    </>
  );
};

export default OriginDetails;
