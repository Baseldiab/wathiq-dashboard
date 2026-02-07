import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, Box, Grid, InputAdornment, Typography } from "@mui/material";
import { useFormik } from "formik";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Head from "next/head";
import { originSchema } from "@/services/schema";
import BreadcrumbsNav from "@/components/layout/navbar/bread-crumb-nav";
import CustomButton from "@/components/button";
import Input from "@/components/inputs";
import SectionHead from "@/components/corporate/main-info/section-head";
import FileUpload from "@/components/file/upload-file";
import GoogleMapInput from "@/components/map";
import DynamicFormSection from "@/components/dynamic-form-section";
import CustomSnackbar from "@/components/toastMsg";
import { buildQueryParams } from "@/services/utils";
import { createOrigin } from "@/Redux/slices/originsSlice";
import { getAllAuctions, getAuction } from "@/Redux/slices/auctionsSlice";
import Loader from "@/components/loader";
import UploadFiles from "@/components/file/file-upload";
import constants from "@/services/constants";
import PopupTitle from "@/components/popup-title";
import SAR from "@/components/sar";

dayjs.extend(utc);

export default function OriginCreate() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [sections, setSections] = useState({
    contactInfo: [
      t("pages_origins_create_[id].نوع_الأصل"),
      t("pages_origins_create_[id].رقم_المخطط"),
      t("pages_origins_create_[id].رقم_القطعة"),
      t("pages_origins_create_[id].طبيعة_الأرض"),
      t("pages_origins_create_[id].الرفع_المساحي"),
      t("pages_origins_create_[id].واجهة_العقار"),
      t("pages_origins_create_[id].رقم_الصك"),
      t("pages_origins_create_[id].تاريخ_الصك"),
    ],
    areaInfo: [
      t("pages_origins_create_[id].المساحة"),
      t("pages_origins_create_[id].شرقا"),
      t("pages_origins_create_[id].غربا"),
      t("pages_origins_create_[id].شمالا"),
      t("pages_origins_create_[id].جنوبا"),
    ],
    generalInfo: [
      t("pages_origins_create_[id].التليفون_والانترنت"),
      t("pages_origins_create_[id].الكهرباء"),
      t("pages_origins_create_[id].الغاز"),
      t("pages_origins_create_[id].الماء"),
    ],
    paperInfo: [
      t("pages_origins_create_[id].نوع_الملكية"),
      t("pages_origins_create_[id].حقوق_الملكية"),
    ],
  });
  const [sectionNames, setsectionNames] = useState([
    "contactInfo",
    "areaInfo",
    "generalInfo",
    "paperInfo",
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [errormsg, setError] = useState("");
  const [BtnClicked, setBtnClicked] = useState(false);
  const { auction } = useSelector((state) => state.auctions);
  const auctionData = auction?.data;
  const [reviewStatus, setReviewState] = useState("");
  const { createdOriginsLoading } = useSelector((state) => state.origins);

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    // const sectionNames = [
    //   "contactInfo",
    //   "areaInfo",
    //   "generalInfo",
    //   "paperInfo",
    // ];

    // Object.entries(values)
    //   .filter(([key]) => sectionNames?.includes(key))
    //   .forEach(([sectionName, sectionData], sectionIndex) => {
    //     formData.append(`details[${sectionIndex}][title][ar]`, sectionName);

    //     Object.entries(sectionData).forEach(
    //       ([fieldName, fieldValue], fieldIndex) => {
    //         formData.append(
    //           `details[${sectionIndex}][auctionDetails][${fieldIndex}][title][ar]`,
    //           fieldName
    //         );
    //         formData.append(
    //           `details[${sectionIndex}][auctionDetails][${fieldIndex}][description][ar]`,
    //           fieldValue
    //         );
    //       }
    //     );
    //   });
    Object.entries(values)
      .filter(([key]) => sectionNames?.includes(key))
      .forEach(([sectionName, sectionData], sectionIndex) => {
        // Filter out empty sections
        const filledFields = Object.entries(sectionData).filter(
          ([, fieldValue]) => fieldValue !== "" && fieldValue !== null
        );

        if (filledFields.length > 0) {
          let newsectionName;
          if (sectionName == "contactInfo") {
            newsectionName = t(
              "pages_origins_create_[id].المعلومات_الخاصة_بالاتصال"
            );
          } else if (sectionName == "areaInfo") {
            newsectionName = t("pages_origins_create_[id].الحدود_والمساحة");
          } else if (sectionName == "generalInfo") {
            newsectionName = t(
              "pages_origins_create_[id].الخدمات_والمرافق_العامة"
            );
          } else if (sectionName == "paperInfo") {
            newsectionName = t("pages_origins_create_[id].حقوق_الملكية");
          } else {
            newsectionName = sectionName;
          }
          formData.append(
            `details[${sectionIndex}][title][ar]`,
            newsectionName
          );

          filledFields.forEach(([fieldName, fieldValue], fieldIndex) => {
            formData.append(
              `details[${sectionIndex}][auctionDetails][${fieldIndex}][title][ar]`,
              fieldName
            );
            formData.append(
              `details[${sectionIndex}][auctionDetails][${fieldIndex}][description][ar]`,
              fieldValue
            );
          });
        }
      });
    Object.keys(values).forEach((key) => {
      const value = values[key];

      if (key === "attachment" && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append("attachment", file);
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (
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
    console.log("FormData Entries:", [...formData.entries()]);

    try {
      const response = await dispatch(createOrigin(formData)).unwrap();
      await dispatch(getAuction(auctionData?._id)).unwrap();
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: auctionData?.status,
            reviewStatus: auctionData?.auctionReviewStatus.status,
            specialToSupportAuthority: auctionData?.specialToSupportAuthority,
            createdByAdmin: auctionData?.createdByAdmin,
          })
        )
      ).unwrap();
      console.log("Origin Created Successfully:", response);
      setAlert({
        msg: t("pages_origins_create_[id].تم_الانشاء_بنجاح"),
        type: "success",
      });
      setOpen(true);
      router.push(`/auctions/details/${auctionData?._id}`);
    } catch (error) {
      console.log(error);
      setOpen(true);
      setAlert({ msg: error, type: "error" });
      console.error(" Request Failed:", error);
    }
  };
  const formik = useFormik({
    initialValues: {
      title: {
        ar: "",
      },
      description: {
        ar: "",
      },
      openingPrice: "",
      entryDeposit: "",
      garlicDifference: "",
      secondGarlicDifference: "",
      location: {
        // longitude: 46.77497863769531,
        // latitude: 24.7240682410252,
        // title: "TITLE MAP TEST",
        longitude: "",
        latitude: "",
        title: "",
      },
      attachment: [],
      contactInfo: {},
      areaInfo: {},
      generalInfo: {},
      paperInfo: {},
    },
    validationSchema: originSchema,
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
    setSections((prev) => ({
      ...prev,
      [newSectionName]: [],
    }));

    setsectionNames([...sectionNames, newSectionName]);

    formik.setFieldValue(newSectionName, {});
    setNewSectionName("");
    setError("");
    setOpenModal(false);
  };
  const handleAddField = (sectionName, newField) => {
    setSections((prev) => ({
      ...prev,
      [sectionName]: [...(prev[sectionName] || []), newField],
    }));
    formik.setFieldValue(`${sectionName}.${newField}`, "");
  };
  // const handleFileChange = (event, name) => {
  //   const files = Array.from(event.target.files);
  //   if (files.length) formik.setFieldValue(name, files);
  // };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue("attachment", [...formik.values.attachment, ...files]);
  };

  useEffect(() => {
    if (auctionData?.auctionReviewStatus?.status === "pending") {
      setReviewState(t("pages_origins_create_[id].قيد_الانشاء"));
    } else if (auctionData?.auctionReviewStatus?.status === "approved") {
      setReviewState(t("pages_origins_create_[id].قيد_التنفيذ"));
    }
  }, [auctionData?.auctionReviewStatus?.status]);
  const getMainTabValue = (status) => {
    switch (status) {
      case "pending":
        return 1;
      case "approved":
        return 2;

      case "in_progress":
        return 4;
      default:
        return 0;
    }
  };
  useEffect(() => {
    console.log("formik", formik);
  }, [formik]);
  if (createdOriginsLoading) return <Loader open={true} />;

  return (
    <>
      <Head>
        <title>{t("pages_origins_create_[id].إنشاء_أصل")}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Box>
        <BreadcrumbsNav
          title={t("pages_origins_create_[id].إدارة_المزادات")}
          links={[
            {
              href: "/auctions",
              label: t("pages_origins_create_[id].إدارة_المزادات"),
            },
            {
              href: `/auctions?mainTab=${getMainTabValue(
                auctionData?.auctionReviewStatus?.status
              )}`,
              label: reviewStatus,
            },
            {
              href: `/auctions/details/${auctionData?._id}`,
              label: auctionData?.title,
            },
          ]}
          currentText={t("pages_origins_create_[id].إنشاء_أصل")}
        />
        <Box sx={{ borderRadius: "20px", border: "1px solid #D6D9E1", my: 2 }}>
          <SectionHead
            title={t("pages_origins_create_[id].تفاصيل_الأصل")}
            large
            action
            customStyle={{
              bgcolor: "#fff",
              borderRadius: "20px",
              padding: "16px",
            }}
          >
            {/* <Typography
              sx={{
                mb: 2,
                fontSize: "24px",
                fontWeight: 700,
                color: "#202726",
              }}
            >
              تفاصيل الأصل{" "}
            </Typography> */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Input
                  label={t("pages_origins_create_[id].إسم_الأصل")}
                  name="title.ar"
                  placeholder={t("pages_origins_create_[id].إسم_الأصل")}
                  value={formik?.values?.title?.ar}
                  onChange={(e) =>
                    formik.setFieldValue("title.ar", e.target.value)
                  }
                  error={formik.touched?.title?.ar && formik?.errors?.title?.ar}
                  customStyle={{ width: "100%" }}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("title?.ar", true);
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Input
                  label={t("pages_origins_create_[id].الوصف")}
                  name="description.ar"
                  placeholder={t("pages_origins_create_[id].الوصف")}
                  value={formik?.values?.description?.ar}
                  onChange={(e) =>
                    formik.setFieldValue("description.ar", e.target.value)
                  }
                  error={
                    formik?.touched?.description?.ar &&
                    formik?.errors?.description?.ar
                  }
                  customStyle={{ width: "100%" }}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("description?.ar", true);
                  }}
                  // flag
                  descreption
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Input
                  label={t("pages_origins_create_[id].السعر_الإفتتاحي")}
                  name="openingPrice"
                  placeholder={t("pages_origins_create_[id].السعر_الإفتتاحي")}
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
                  }}
                  error={
                    formik.touched.openingPrice && formik.errors.openingPrice
                  }
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("openingPrice", true);
                  }}
                  customStyle={{ width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <Input
                  label={t("pages_origins_create_[id].عربون_الدخول")}
                  name="entryDeposit"
                  placeholder={t("pages_origins_create_[id].عربون_الدخول")}
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
                  }}
                  error={
                    formik.touched.entryDeposit && formik.errors.entryDeposit
                  }
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("entryDeposit", true);
                  }}
                  customStyle={{ width: "100%" }}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <Input
                  label={t("pages_origins_create_[id].فرق_السوم_الأول")}
                  name="garlicDifference"
                  placeholder={t("pages_origins_create_[id].فرق_السوم_الأول")}
                  value={formik.values.garlicDifference}
                  onChange={(e) =>
                    formik.setFieldValue("garlicDifference", e.target.value)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {" "}
                        <SAR img="/images/icons/SAR.svg" />
                      </InputAdornment>
                    ),
                  }}
                  error={
                    formik.touched.garlicDifference &&
                    formik.errors.garlicDifference
                  }
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("garlicDifference", true);
                  }}
                  customStyle={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Input
                  label="  فرق السوم الثاني"
                  name="secondGarlicDifference"
                  placeholder={t("pages_origins_create_[id].فرق_السوم_الثاني")}
                  value={formik.values.secondGarlicDifference}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "secondGarlicDifference",
                      e.target.value
                    )
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {" "}
                        <SAR img="/images/icons/SAR.svg" />
                      </InputAdornment>
                    ),
                  }}
                  error={
                    formik.touched.secondGarlicDifference &&
                    formik.errors.secondGarlicDifference
                  }
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("secondGarlicDifference", true);
                  }}
                  customStyle={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  {" "}
                  موقع الأصل
                </Typography>
                <GoogleMapInput
                  value={formik.values.location}
                  handleChange={(value) =>
                    // formik.setFieldValue("location", value)
                    formik.setFieldValue("location", {
                      longitude: value?.longitude,
                      latitude: value?.latitude,
                      title: value?.title,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                {/* <FileUpload
                name="attachment"
                label={t("pages_origins_create_[id].الوسائط_الصور")}
                value={formik.values.attachment}
                accept="image/*, application/pdf"
                formik={formik}
                handleFileChange={handleFileChange}
                type={getFileType(formik.values.attachment)}
                error={formik.touched.attachment && formik.errors.attachment}
                multi
              /> */}
                <Typography
                  sx={{
                    mb: 3,
                    mt: 3,
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#202726",
                  }}
                >
                  {t("pages_origins_create_[id].الوسائط_صور_فيدوهات")}
                </Typography>
                <UploadFiles
                  name="attachment"
                  label={t("pages_origins_create_[id].الوسائط_صور_فيدوهات")}
                  value={formik.values.attachment}
                  accept="image/*,video/*"
                  formik={formik}
                  handleFileChange={handleFileChange}
                  type="image"
                  error={formik.touched.attachment && formik.errors.attachment}
                  multi
                  isEditing
                />
              </Grid>
            </Grid>
            <Typography
              sx={{
                mb: 3,
                mt: 3,
                fontSize: "24px",
                fontWeight: 700,
                color: "#202726",
              }}
            >
              {t("pages_origins_create_[id].التفاصيل")}
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(sections).map(([sectionName, fields]) => (
                <Grid item xs={12} md={6} key={sectionName}>
                  <DynamicFormSection
                    title={sectionName}
                    name={sectionName}
                    fields={fields}
                    formik={formik}
                    onAddField={handleAddField}
                    BtnClicked={BtnClicked}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={{ xs: 2, md: 2 }} sx={{ p: 1 }}>
              <Grid item xs={10} sm={6} md={3}>
                <CustomButton
                  handleClick={handleOpenModal}
                  text={t("pages_origins_create_[id].إضافة_بند_جديد")}
                  customeStyle={{
                    width: "100%",
                    bgcolor: constants.colors.light_green,
                    "&:hover": {
                      color: "#fff",
                      bgcolor: constants.colors.light_green,
                      boxShadow: "none",
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={{ xs: 2, md: 2 }} sx={{ px: 1, py: 3 }}>
              {/* <Grid item xs={10} sm={6} md={4}>
                <CustomButton
                  customeStyle={{
                    width: "100%",
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
                  text={t("pages_origins_create_[id].إلغاء")}
                  type="close"
                />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <CustomButton
                  handleClick={() => {
                    setBtnClicked(true);
                    formik.submitForm();
                  }}
                  text={t("pages_origins_create_[id].إنشاء_اصل")}
                  Submitting
                  customeStyle={{ width: "100%" }}
                />
              </Grid>
            </Grid>
          </SectionHead>
        </Box>
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
              placeholder={t("pages_origins_create_[id].الإسم_هنا")}
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
                }}
                handleClick={handleAddSection}
                text={t("pages_origins_create_[id].إضافة")}
              />
            </Box>
          </Box>
        </Backdrop>
      </Box>{" "}
      <CustomSnackbar
        type={alert.type}
        open={open}
        setOpen={setOpen}
        message={alert.msg}
      />
    </>
  );
}
