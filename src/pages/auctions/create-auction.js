import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProviders, getProviders } from "@/Redux/slices/providerSlice";
import Loader from "@/components/loader";
import BreadcrumbsNav from "@/components/layout/navbar/bread-crumb-nav";
import CustomButton from "@/components/button";
import { Box, Grid, InputLabel, Typography } from "@mui/material";
import ProfileImg from "@/components/image-box/profile-img";
import {
  buildQueryParams,
  formatDate,
  getFileType,
  hasRole,
} from "@/services/utils";
import Input from "@/components/inputs";
import SectionHead from "@/components/corporate/main-info/section-head";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileUpload from "@/components/file/upload-file";
import { styles as localStyles } from "@/components/inputs/style";
import { styles as globalStyles } from "@/components/globalStyle";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import Head from "next/head";
import { auctionSchema, createProviderSchema } from "@/services/schema";
import CustomSnackbar from "@/components/toastMsg";
import TabItem from "@/components/tab-item";
import { createAuction, getAllAuctions } from "@/Redux/slices/auctionsSlice";
import GoogleMapInput from "@/components/map";
import { FiltergetAllusers } from "@/Redux/slices/userSlice";
import constants from "@/services/constants";
dayjs.extend(utc);

export default function auctionCreate() {
  const { t } = useTranslation();
  const tabItems = [
    { text: t("pages_auctions_create-auction.وثيق"), id: 1 },
    { text: t("pages_auctions_create-auction.وكيل_بيع"), id: 2 },
    { text: t("pages_auctions_create-auction.افراد"), id: 3 },
  ];
  const styles = { ...globalStyles, ...localStyles };
  const router = useRouter();
  const dispatch = useDispatch();
  const [profileImg, setProfileImg] = useState(null);
  const [check, setCheck] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({});
  const [selectedItem, setSelectedItem] = useState(1);
  const [selectedProviderName, setSelectedProviderName] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const { providers } = useSelector((state) => state.provider);
  const { createdAuctionLoading, createdAuctionError } = useSelector(
    (state) => state.auctions
  );
  const { usersFilterData } = useSelector((state) => state.user);

  const { data: profile } = useSelector((state) => state.profile);
  useEffect(() => {
    if (!providers && profile?.data?.type === "admin") {
      dispatch(getProviders("status=approved"));
    }
    if (!usersFilterData && profile?.data?.type === "admin") {
      dispatch(FiltergetAllusers());
    }
    // if (!allRoles && hasRole("get roles")) dispatch(getAllRoles());
  }, []);
  useEffect(() => {
    if (!hasRole("create auction")) router.push("/");
  }, []);
  //   useEffect(() => {
  //     const providerId = provider?.data?._id;
  //     const queryId = router.query.id;

  //     if (queryId && providerId !== queryId) {
  //       dispatch(getProvider(queryId));
  //     }
  //   }, [router.query.id]);

  const handleItemChange = (id) => {
    setSelectedItem(id);
  };

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(name, file);
    }
  };
  const handleInputChange = (value, name) => {
    if (name === "specialToSupportAuthority") {
      // Convert Arabic values to boolean for API storage
      const booleanValue = value === t("pages_auctions_create-auction.إنفاذ"); // t("pages_auctions_create-auction.إنفاذ") -> true, t("pages_auctions_create-auction.خاص") -> false
      formik.setFieldValue(name, booleanValue);
    } else if (name === "type") {
      const typeValue =
        value === t("pages_auctions_create-auction.هجين")
          ? "hybrid"
          : value === t("pages_auctions_create-auction.الكتروني")
          ? "online"
          : value === t("pages_auctions_create-auction.حضوري")
          ? "on_site"
          : value;
      formik.setFieldValue(name, typeValue);
    } else if (name === "startDate" || name === "endDate") {
      formik.setFieldTouched(name, true);
      const formattedDateTime = value
        ? dayjs(value).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        : "";
      formik.setFieldValue(name, formattedDateTime);
    } else if (name === "provider") {
      const providerId = value._id;
      console.log("providerId", providerId);
      formik.setFieldValue(name, providerId);
      setSelectedProviderName(value.companyName);
    } else if (name === "user") {
      const userId = value._id;
      console.log("user", userId);
      formik.setFieldValue(name, userId);
      setSelectedUserName(value.name);
    } else if (name === "location") {
      console.log("Selected Location:", value);

      // ✅ Correct way to update location in Formik
      formik.setFieldValue("location", {
        longitude: value.longitude,
        latitude: value.latitude,
        title: value.title,
      });
    } else {
      formik.setFieldValue(name, value);
    }
    console.log("Updated Formik Values:", formik.values);
  };

  const handleNumericInputChange = (value, name) => {
    if (/^\d*$/.test(value)) {
      formik.setFieldValue(name, value);
    }
  };
  const handleCheck = () => {
    setCheck((prev) => !prev);
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    // Convert object fields to FormData (Only add non-empty values)
    Object.keys(values).forEach((key) => {
      const value = values[key];

      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "object" && value !== null) {
        Object.keys(value).forEach((subKey) => {
          if (
            value[subKey] !== "" &&
            value[subKey] !== null &&
            value[subKey] !== undefined
          ) {
            formData.append(`${key}[${subKey}]`, value[subKey]);
          }
        });
      } else if (value !== "" && value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      const response = await dispatch(createAuction(formData)).unwrap();

      await dispatch(
        getAllAuctions(
          buildQueryParams({
            status: "pending",
            reviewStatus: "pending",
            specialToSupportAuthority: formik.values.specialToSupportAuthority,
          })
        )
      ).unwrap();

      setAlert({
        msg: t("pages_auctions_create-auction.تم_الانشاء_بنجاح"),
        type: "success",
      });
      setOpen(true);
      router.push(`/auctions`);
    } catch (error) {
      console.log(error);
      setOpen(true);
      setAlert({
        msg: createdAuctionError || t("pages_auctions_create-auction.حدث_خطأ"),
        type: "error",
      });
    }
  };

  // resetForm({ values: { ...values } });

  const formik = useFormik({
    initialValues: {
      specialToSupportAuthority: "",
      provider: "", // Only initialize if selectedItem is 2

      title: {
        ar: "",
        en: null,
      },
      type: "",
      startDate: "",
      endDate: "",
      auctionApprovalNumber: "",
      auctionBrochure: "",
      cover: "",
      location: {
        // longitude: -100,
        // latitude: -50,
        // title: t("pages_auctions_create-auction.الريااااااااض"),
        longitude: "",
        latitude: "",
        title: "",
      },
      user: "",
    },
    validationSchema: auctionSchema(selectedItem),
    onSubmit: handleSubmit,
  });
  console.log("formk values startDate", formik.values);
  console.log("formk error startDate", formik.errors);

  if (createdAuctionLoading) return <Loader open={true} />;
  return (
    <>
      <Head>
        <title>{t("pages_auctions_create-auction.اضافة_مزاد")}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Box>
        <BreadcrumbsNav
          title={t("pages_auctions_create-auction.إدارة_المزادات")}
          links={[
            {
              href: "/auctions",
              label: t("pages_auctions_create-auction.إدارة_المزادات"),
            },
          ]}
          currentText={t("pages_auctions_create-auction.إنشاء_مزاد")}
        />
        {profile?.data?.type === "admin" ? (
          <SectionHead
            title={t("pages_auctions_create-auction.المزاد_خاص_ب")}
            action
          >
            <Box
              sx={{
                width: "100%",
                ...styles.dataSpaceBetween,
              }}
            >
              <Box
                sx={{
                  ...styles.tabsItemContainer,
                  mb: { xs: "16px", md: "24px" },
                  // flexWrap: "wrap",
                }}
              >
                {tabItems.map((item) => (
                  <TabItem
                    item={item}
                    selectedItem={selectedItem}
                    handleItemChange={handleItemChange}
                  />
                ))}
              </Box>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={6}>
                <Input
                  label={t("pages_auctions_create-auction.حالة_المزاد")}
                  type="selectbox"
                  name="specialToSupportAuthority"
                  value={
                    formik.values?.specialToSupportAuthority === true
                      ? t("pages_auctions_create-auction.إنفاذ")
                      : formik.values?.specialToSupportAuthority === false
                      ? t("pages_auctions_create-auction.خاص")
                      : ""
                  }
                  valuesOption={[
                    t("pages_auctions_create-auction.إنفاذ"),
                    t("pages_auctions_create-auction.خاص"),
                  ]}
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  placeholder={t("pages_auctions_create-auction.إنفاذخاص")}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("specialToSupportAuthority", true);
                  }}
                  error={
                    formik.touched.specialToSupportAuthority &&
                    formik.errors.specialToSupportAuthority
                  }
                />
              </Grid>
            </Grid>
            {selectedItem === 2 && (
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                  <Input
                    label={t("pages_auctions_create-auction.حدد_وكيل_البيع")}
                    placeholder={t("pages_auctions_create-auction.إسم_الشركة")}
                    type="selectbox"
                    value={selectedProviderName}
                    name="provider"
                    valuesOption={providers?.data}
                    customStyle={{ width: "100%" }}
                    handleChange={handleInputChange}
                    company
                    error={formik.touched.provider && formik.errors.provider}
                  />
                </Grid>
              </Grid>
            )}
            {selectedItem === 3 && (
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                  <Input
                    label={t("pages_auctions_create-auction.حدد_المستخدم")}
                    placeholder={t(
                      "pages_auctions_create-auction.إسم_المستخدم"
                    )}
                    type="selectbox"
                    value={selectedUserName}
                    name="user"
                    valuesOption={usersFilterData?.data}
                    customStyle={{ width: "100%" }}
                    handleChange={handleInputChange}
                    error={formik.touched.user && formik.errors.user}
                  />
                </Grid>
              </Grid>
            )}
          </SectionHead>
        ) : (
          <SectionHead
            title={t("pages_auctions_create-auction.المزاد_خاص_ب")}
            action
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} md={6}>
                <Input
                  label={t("pages_auctions_create-auction.حالة_المزاد")}
                  type="selectbox"
                  name="specialToSupportAuthority"
                  value={
                    formik.values?.specialToSupportAuthority === true
                      ? t("pages_auctions_create-auction.إنفاذ")
                      : formik.values?.specialToSupportAuthority === false
                      ? t("pages_auctions_create-auction.خاص")
                      : ""
                  }
                  valuesOption={[
                    t("pages_auctions_create-auction.إنفاذ"),
                    t("pages_auctions_create-auction.خاص"),
                  ]}
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  placeholder={t("pages_auctions_create-auction.إنفاذخاص")}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("specialToSupportAuthority", true);
                  }}
                  error={
                    formik.touched.specialToSupportAuthority &&
                    formik.errors.specialToSupportAuthority
                  }
                />
              </Grid>
            </Grid>
          </SectionHead>
        )}

        <SectionHead
          title={t("pages_auctions_create-auction.بيانات_المزاد")}
          action
        >
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6} lg={3}>
              <Input
                label={t("pages_auctions_create-auction.إسم_المزاد")}
                type="text"
                name="title.ar"
                value={formik.values?.title.ar}
                customStyle={{ width: "100%" }}
                handleChange={handleInputChange}
                placeholder={t("pages_auctions_create-auction.إسم_المزاد")}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("title?.ar", true);
                }}
                error={formik.touched.title?.ar && formik.errors.title?.ar}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Input
                label={t("pages_auctions_create-auction.حالة_المزاد")}
                type="selectbox"
                name="type"
                value={
                  formik.values?.type === "hybrid"
                    ? t("pages_auctions_create-auction.هجين")
                    : formik.values?.type === "online"
                    ? t("pages_auctions_create-auction.الكتروني")
                    : formik.values?.type === "on_site"
                    ? t("pages_auctions_create-auction.حضوري")
                    : ""
                }
                valuesOption={[
                  t("pages_auctions_create-auction.هجين"),
                  t("pages_auctions_create-auction.الكتروني"),
                  t("pages_auctions_create-auction.حضوري"),
                ]}
                customStyle={{ width: "100%" }}
                handleChange={handleInputChange}
                placeholder={t(
                  "pages_auctions_create-auction.اختار_حالة_المزاد"
                )}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("type", true);
                }}
                error={formik.touched.type && formik.errors.type}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Input
                label={t("pages_auctions_create-auction.تاريخ_ووقت_بدأ_المزاد")}
                placeholder={t(
                  "pages_auctions_create-auction.تاريخ_ووقت_بدأ_المزاد"
                )}
                type="date"
                value={
                  formik.values?.startDate
                    ? dayjs(formik.values.startDate)
                    : null
                }
                name="startDate"
                customStyle={{ width: "100%" }}
                handleChange={handleInputChange}
                withTime
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("startDate", true);
                }}
                error={formik.touched?.startDate && formik.errors?.startDate}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Input
                label={t(
                  "pages_auctions_create-auction.تاريخ_ووقت_إنتهاء_المزاد"
                )}
                placeholder={t(
                  "pages_auctions_create-auction.تاريخ_ووقت_إنتهاء_المزاد"
                )}
                type="date"
                value={
                  formik.values?.endDate ? dayjs(formik.values.endDate) : null
                }
                withTime
                name="endDate"
                customStyle={{ width: "100%" }}
                handleChange={handleInputChange}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("endDate", true);
                }}
                error={formik.touched?.endDate && formik.errors?.endDate}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Input
                label={t(
                  "pages_auctions_create-auction.رقم_الموافقة_لإقامة_مزاد"
                )}
                type="text"
                name="auctionApprovalNumber"
                value={formik.values?.auctionApprovalNumber}
                customStyle={{ width: "100%" }}
                handleChange={handleNumericInputChange}
                placeholder={t(
                  "pages_auctions_create-auction.رقم_الموافقة_لإقامة_مزاد"
                )}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("auctionApprovalNumber", true);
                }}
                error={
                  formik.touched.auctionApprovalNumber &&
                  formik.errors.auctionApprovalNumber
                }
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              {" "}
              <FileUpload
                name="auctionBrochure"
                formik={formik}
                value={formik.values?.auctionBrochure}
                label={t("pages_auctions_create-auction.برشور_المزاد")}
                accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                handleFileChange={handleFileChange}
                type={getFileType(formik.values?.auctionBrochure)}
                error={
                  formik.touched.auctionBrochure &&
                  formik.errors.auctionBrochure
                }
              />
            </Grid>

            <Grid item xs={12} md={12} lg={4}>
              <FileUpload
                name="cover"
                formik={formik}
                value={formik.values?.cover}
                label={t("pages_auctions_create-auction.كفر_المزاد")}
                accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                handleFileChange={handleFileChange}
                type={getFileType(formik.values?.cover)}
                error={formik.touched.cover && formik.errors.cover}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                حدد موقع المزاد{" "}
              </Typography>
              <GoogleMapInput
                value={formik.values.location}
                handleChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </SectionHead>

        {hasRole("create auction") && (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ py: 1 }}>
            <Grid item xs={6} md={6}>
              <CustomButton
                handleClick={formik.submitForm}
                text={t("pages_auctions_create-auction.إنشاء_المزاد")}
                // disabled={

                //   Object.keys(formik.errors).length > 0 ||
                //   isFormUnchanged ||
                //   formik.isSubmitting
                // }
                customeStyle={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={10} sm={6} md={3}>
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
                text={t("pages_auctions_create-auction.إلغاء")}
                // type="close"
                handleClick={() => router.push(`/auctions`)}
              />
            </Grid>
          </Grid>
        )}
        <CustomSnackbar
          type={alert.type}
          open={open}
          setOpen={setOpen}
          message={alert.msg}
        />
      </Box>
    </>
  );
}
