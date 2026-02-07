import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProviders,
  getProvider,
  updateProvider,
} from "@/Redux/slices/providerSlice";
import Loader from "@/components/loader";
import BreadcrumbsNav from "@/components/layout/navbar/bread-crumb-nav";
import CustomButton from "@/components/button";
import { Box, Grid, InputLabel, Typography } from "@mui/material";
import ProfileImg from "@/components/image-box/profile-img";
import {
  buildQueryParams,
  formatDate,
  getFileType,
  handleFormattedNumberChange,
  hasRole,
} from "@/services/utils";
import Input from "@/components/inputs";
import SectionHead from "@/components/corporate/main-info/section-head";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileUpload from "@/components/file/upload-file";
import { styles } from "@/components/inputs/style";
import dayjs from "dayjs";
import Head from "next/head";
import { providerValidationSchema } from "@/services/schema";
import CustomSnackbar from "@/components/toastMsg";

export default function EditCorporate() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    provider,
    loadingProvider,
    errorProvider,
    errorRequestProvider,
    updatedProviderLoading,
  } = useSelector((state) => state.provider);
  const [profileImg, setProfileImg] = useState(null);
  const [check, setCheck] = useState(false);
  const [taxType, setTaxType] = useState("");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({});
  const providerData = provider?.data;
  let requestStatus = provider?.data?.status?.value;
  useEffect(() => {
    const providerId = provider?.data?._id;
    const queryId = router.query.id;

    if (queryId && providerId !== queryId) {
      dispatch(getProvider(queryId));
    }
  }, [router.query.id]);
  useEffect(() => {
    // if (profile?.data?.type !== "admin") router.push("/");
    if (!hasRole("update provider")) router.push("/");
  }, []);
  const handleProfileChange = async (event) => {
    const file = event.target.files[0];
    setProfileImg(file);
  };
  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(name, file);
    }
  };
  // const handleInputChange = (value, name) => {
  //   if (
  //     name === "commercialRegistration.startDate" ||
  //     name === "commercialRegistration.endDate"
  //   ) {
  //     formik.setFieldValue(
  //       name,
  //       value ? dayjs(value).format("YYYY-MM-DD") : ""
  //     );
  //   } else {
  //     formik.setFieldValue(name, value);
  //   }
  // };
  const handleInputChange = (value, name) => {
    if (name === "tax.type") {
      formik.setFieldError("tax.type", "");
      setTaxType(value);
      formik.setFieldValue(name, value);
      if (
        value === t("pages_corporate-management_edit_[id].غير_خاضع_للضريبة")
      ) {
        formik.setFieldValue("tax.number", "");
        formik.setFieldValue("taxAttachment", "");
      }
      console.log("formik.values?.", formik.values?.tax);
    } else if (
      name === "commercialRegistration.startDate" ||
      name === "commercialRegistration.endDate"
    ) {
      formik.setFieldValue(
        name,
        value ? dayjs(value).format("YYYY-MM-DD") : ""
      );
    } else {
      formik.setFieldValue(name, value);
    }
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
    const changes = {};

    // Track changes in non-nested fields
    Object.keys(values).forEach((key) => {
      if (
        key === "companyPhoneNumber" ||
        key === "bankAccountInformation" ||
        key === "commercialRegistration" ||
        key === "phoneNumber" ||
        key == "valAuctionsLicense" ||
        key === "tax"
      ) {
        let isNestedChanged = false;
        Object.keys(values[key] || {}).forEach((nestedKey) => {
          if (values[key][nestedKey] !== formik.initialValues[key][nestedKey]) {
            isNestedChanged = true;
          }
        });
        if (isNestedChanged) {
          changes[key] = { ...values[key] };
        }
      } else if (values[key] !== formik.initialValues[key]) {
        changes[key] = values[key];
      }
    });
    //  Ensure "SA" is added back to accountNumber before sending
    if (values.bankAccountInformation?.accountNumber) {
      changes.bankAccountInformation = {
        ...values.bankAccountInformation,
        accountNumber: `SA${values.bankAccountInformation.accountNumber}`,
      };
    }
    if (profileImg) {
      changes.companyProfileImage = profileImg;
    }
    if (Object.keys(changes).length > 0) {
      const response = await dispatch(
        updateProvider({
          data: changes,
          id: provider?.data?._id,
        })
      );

      if (response?.meta?.requestStatus === "fulfilled") {
        dispatch(getProvider(provider?.data?._id));
        dispatch(
          getAllProviders(
            buildQueryParams({
              status: requestStatus == "blocked" ? "blocked" : "approved",
            })
          )
        );
        dispatch(
          getAllProviders(
            buildQueryParams({
              status: "approved",
            })
          )
        );
        setProfileImg(null);
        resetForm({ values: { ...values } });
        setAlert({
          msg: t("pages_corporate-management_edit_[id].تم_التعديل_بنجاح"),
          type: "success",
        });
        setOpen(true);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      companyProfileImage: provider?.data?.companyProfileImage || "",
      companyName: providerData?.companyName || "",
      approvedByNafath: providerData?.approvedByNafath || false,
      accreditationRequest: providerData?.accreditationRequest || false,
      companyPhoneNumber: {
        number: providerData?.companyPhoneNumber?.number || "",
        key: providerData?.companyPhoneNumber?.key || "",
      },
      valAuctionsLicense: {
        number: providerData?.valAuctionsLicense?.number || "",
      },
      valAttachment: providerData?.valAuctionsLicense?.valAttachment || "",
      companyEmail: providerData?.companyEmail || "",
      realEstateActivity: providerData?.realEstateActivity || "",
      bankAccountInformation: {
        accountNumber:
          providerData?.bankAccountInformation?.accountNumber.replace(
            /^SA/,
            ""
          ) || "",
        bankName: providerData?.bankAccountInformation?.bankName || "",
      },
      bankCertificate: providerData?.bankAccountInformation?.bankCertificate,
      commercialRegistration: {
        number: providerData?.commercialRegistration?.number,
        startDate: providerData?.commercialRegistration?.startDate
          ? dayjs(providerData.commercialRegistration.startDate).format(
              "YYYY-MM-DD"
            )
          : "",
        endDate: providerData?.commercialRegistration?.endDate
          ? dayjs(providerData.commercialRegistration.endDate).format(
              "YYYY-MM-DD"
            )
          : "",
      },
      originPrice: null,
      originPriceFormatted: "",
      /**بيانات المفوض */
      name: providerData?.name || "",
      email: providerData?.email || "",
      identityNumber: providerData?.identityNumber || "",
      phoneNumber: {
        number: providerData?.phoneNumber?.number || "",
        key: providerData?.phoneNumber?.key || "",
      },
      tax: {
        number: providerData?.tax?.number || "",
        type: providerData?.tax?.type || "",
      },
      taxAttachment: providerData?.tax?.taxAttachment || "",
      identityAttachment:
        providerData?.commissionerAttachments?.identityAttachment,
      articlesOfAssociation:
        providerData?.commissionerAttachments?.articlesOfAssociation,
      letterOfAuthorization:
        providerData?.commissionerAttachments?.letterOfAuthorization,
      commercialAttachment:
        providerData?.commercialRegistration?.commercialAttachment,
    },

    validationSchema: providerValidationSchema(taxType),
    onSubmit: handleSubmit,
  });

  const isFormUnchanged =
    JSON.stringify(formik.values) === JSON.stringify(formik.initialValues) &&
    profileImg === null;

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loadingProvider && !updatedProviderLoading) {
      const timer = setTimeout(() => setLoading(false), 200);
      return () => clearTimeout(timer);
    } else {
      setLoading(true);
    }
  }, [loadingProvider, updatedProviderLoading]);

  if (loading) return <Loader open={true} />;

  if (errorProvider || errorRequestProvider) {
    return <>404</>;
  }

  return (
    <>
      <Head>
        <title> تعديل بيانات {provider?.data?.companyName}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Box>
        <BreadcrumbsNav
          title={t("pages_corporate-management_edit_[id].إدارة_الشركات")}
          links={[
            {
              href: "/corporate-management",
              label: t("pages_corporate-management_edit_[id].إدارة_الشركات"),
            },
            {
              href: {
                pathname: "/corporate-management",
                query: {
                  mainTab: requestStatus == "blocked" ? 3 : 1,
                  ...(requestStatus === "blocked" && { subTab: 1 }),
                },
              },
              label:
                requestStatus == "blocked"
                  ? t("pages_corporate-management_edit_[id].شركات_محظورة")
                  : t("pages_corporate-management_edit_[id].الشركات_المتعاقدة"),
            },
            {
              href: `/corporate-management/details/${provider?.data?._id}`,
              label: provider?.data?.companyName,
            },
          ]}
          currentText={t("pages_corporate-management_edit_[id].تعديل")}
        />
        {/* img & btn */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: "35px",
            gap: 2,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
            }}
          >
            <ProfileImg
              src={
                profileImg
                  ? URL.createObjectURL(profileImg)
                  : provider?.data?.companyProfileImage
              }
              defultSrc="/images/company.svg"
              role="update provider"
              handleFileChange={handleProfileChange}
            />
          </Box>

          {hasRole("update provider") && (
            <CustomButton
              handleClick={formik.submitForm}
              text={t("pages_corporate-management_edit_[id].حفظ_التعديلات")}
              disabled={
                // Object.keys(formik.errors).length > 0 ||
                isFormUnchanged || formik.isSubmitting
              }
            />
          )}
        </Box>

        <Box sx={{ borderRadius: "20px", border: "1px solid #D6D9E1", mb: 2 }}>
          <SectionHead
            title={t("pages_corporate-management_edit_[id].بيانات_الشركة")}
            customStyle={{
              bgcolor: "#fff",
              borderRadius: "20px",
              padding: "16px",
            }}
            large
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12}>
                <Input
                  label={t("pages_corporate-management_edit_[id].إسم_الشركة")}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].إسم_الشركة"
                  )}
                  type="text"
                  value={formik.values.companyName}
                  name="companyName"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  error={formik.errors.companyName}
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  type="radio"
                  label={t(
                    "pages_corporate-management_edit_[id].معتمد_من_انفاذ"
                  )}
                  value={formik.values.approvedByNafath}
                  handleChange={(newValue) =>
                    formik.setFieldValue("approvedByNafath", newValue)
                  } // Update value correctly
                  valuesOption={[
                    {
                      value: true,
                      label: t("pages_corporate-management_edit_[id].نعم"),
                    },
                    {
                      value: false,
                      label: t("pages_corporate-management_edit_[id].لا"),
                    },
                  ]}
                  shrink={true}
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  type="radio"
                  label={t(
                    "pages_corporate-management_edit_[id].هل_ترغب_بتقديم_طلب"
                  )}
                  value={formik.values.accreditationRequest}
                  handleChange={(newValue) =>
                    formik.setFieldValue("accreditationRequest", newValue)
                  } // Update value correctly
                  valuesOption={[
                    {
                      value: true,
                      label: t("pages_corporate-management_edit_[id].نعم"),
                    },
                    {
                      value: false,
                      label: t("pages_corporate-management_edit_[id].لا"),
                    },
                  ]}
                  shrink={true}
                />
              </Grid>
              {/**السجل التجاري */}
              <Grid item xs={12} md={6}>
                <Input
                  label={t(
                    "pages_corporate-management_edit_[id].رقم_السجل_التجاري"
                  )}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].رقم_السجل_التجاري"
                  )}
                  type="text"
                  value={formik.values?.commercialRegistration?.number}
                  name="commercialRegistration.number"
                  customStyle={{ width: "100%" }}
                  handleChange={handleNumericInputChange}
                  error={formik.errors.commercialRegistration?.number}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Input
                  label={t(
                    "pages_corporate-management_edit_[id].تاريخ_الاصدار"
                  )}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].تاريخ_الاصدار"
                  )}
                  type="date"
                  value={
                    formik.values?.commercialRegistration?.startDate
                      ? dayjs(formik.values.commercialRegistration.startDate)
                      : null
                  }
                  name="commercialRegistration.startDate"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  error={formik.errors.commercialRegistration?.startDate}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Input
                  label={t(
                    "pages_corporate-management_edit_[id].تاريخ_الانتهاء"
                  )}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].تاريخ_الانتهاء"
                  )}
                  type="date"
                  value={
                    formik.values?.commercialRegistration?.endDate
                      ? dayjs(formik.values.commercialRegistration.endDate)
                      : null
                  }
                  name="commercialRegistration.endDate"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  error={formik.errors.commercialRegistration?.endDate}
                />
              </Grid>
              {/* commercialAttachment */}
              <Grid item xs={12}>
                <FileUpload
                  name="commercialAttachment"
                  formik={formik}
                  value={formik.values?.commercialAttachment}
                  label={t(
                    "pages_corporate-management_edit_[id].مرفق_السجل_التجاري"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.commercialAttachment)}
                />
              </Grid>
              {/**رخصة فال للمزادات */}
              <Grid item xs={12} sm={6}>
                <Input
                  label={t(
                    "pages_corporate-management_edit_[id].رقم_رخصة_فال_للمزادات"
                  )}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].رقم_رخصة_فال_للمزادات"
                  )}
                  type="text"
                  value={formik.values?.valAuctionsLicense?.number}
                  name="valAuctionsLicense.number"
                  customStyle={{ width: "100%" }}
                  handleChange={handleNumericInputChange}
                  error={formik.errors.valAuctionsLicense?.number}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUpload
                  name="valAttachment"
                  formik={formik}
                  value={formik.values?.valAttachment}
                  label={t(
                    "pages_corporate-management_edit_[id].مرفق_رخصة_فال"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.valAttachment)}
                />
              </Grid>

              {/**tax */}
              <Grid item xs={12} md={12}>
                <Input
                  type="radio"
                  label={t(
                    "pages_corporate-management_edit_[id].اختر_نوع_الضريبة"
                  )}
                  value={formik.values.tax?.type}
                  handleChange={(newValue) => {
                    formik.setFieldValue("tax.type", newValue);

                    if (
                      newValue ===
                      t("pages_corporate-management_edit_[id].غير_خاضع_للضريبة")
                    ) {
                      formik.setFieldValue("tax.number", ""); // Reset tax number
                      formik.setFieldValue("taxAttachment", ""); // Reset tax attachment
                    }
                  }}
                  valuesOption={[
                    {
                      value: t(
                        "pages_corporate-management_edit_[id].خاضع_للضريبة"
                      ),
                      label: t(
                        "pages_corporate-management_edit_[id].خاضع_للضريبة"
                      ),
                    },
                    {
                      value: t(
                        "pages_corporate-management_edit_[id].غير_خاضع_للضريبة"
                      ),
                      label: t(
                        "pages_corporate-management_edit_[id].غير_خاضع_للضريبة"
                      ),
                    }, // Corrected label
                  ]}
                  shrink={true}
                  error={formik.touched.tax?.type && formik.errors.tax?.type} // Error handling for the tax.type field
                />
              </Grid>
              {/* <Grid item xs={12}>
                <Input
                  label={t("pages_corporate-management_edit_[id].الضريبة")}
                  type="selectbox"
                  name="tax.type"
                  value={formik.values?.tax?.type || ""}
                  valuesOption={[t("pages_corporate-management_edit_[id].خاضع_للضريبة"), t("pages_corporate-management_edit_[id].غير_خاضع_للضريبة")]}
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  error={formik.errors.tax?.type}
                />
              </Grid> */}
              {formik.values.tax.type !==
                t("pages_corporate-management_edit_[id].غير_خاضع_للضريبة") && (
                <>
                  <Grid item xs={12} md={6}>
                    <Input
                      label={t(
                        "pages_corporate-management_edit_[id].الرقم_الضريبي"
                      )}
                      placeholder={t(
                        "pages_corporate-management_edit_[id].الرقم_الضريبي"
                      )}
                      type="text"
                      value={formik.values?.tax?.number}
                      name="tax.number"
                      customStyle={{ width: "100%" }}
                      handleChange={handleNumericInputChange}
                      error={formik.errors.tax?.number}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FileUpload
                      name="taxAttachment"
                      formik={formik}
                      value={formik.values?.taxAttachment}
                      label={t(
                        "pages_corporate-management_edit_[id].شهادة_التسجيل_الضريبي"
                      )}
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                      handleFileChange={handleFileChange}
                      type={getFileType(formik.values?.taxAttachment)}
                      error={formik.errors.taxAttachment}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={6}>
                <Input
                  label={t(
                    "pages_corporate-management_edit_[id].البريد_الإلكتروني"
                  )}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].البريد_الإلكتروني"
                  )}
                  type="text"
                  startIcon="/images/icons/email.svg"
                  value={formik.values.companyEmail}
                  name="companyEmail"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  error={formik.errors.companyEmail}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t("pages_corporate-management_edit_[id].رقم_الجوال")}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].ادخل_رقم_الجوال"
                  )}
                  type="phone"
                  startIcon="/images/icons/phone.svg"
                  value={formik.values.companyPhoneNumber.number}
                  name="companyPhoneNumber.number"
                  customStyle={{ width: "100%" }}
                  handleChange={handleNumericInputChange}
                  error={formik.errors.companyPhoneNumber?.number}
                />
              </Grid>
            </Grid>
          </SectionHead>
        </Box>
        <Box sx={{ borderRadius: "20px", border: "1px solid #D6D9E1", mb: 2 }}>
          <SectionHead
            title={t("pages_corporate-management_edit_[id].البيانات_المالية")}
            customStyle={{
              bgcolor: "#fff",
              borderRadius: "20px",
              padding: "16px",
            }}
            large
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t("pages_corporate-management_edit_[id].إسم_البنك")}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].إسم_البنك"
                  )}
                  type="selectbox"
                  value={formik.values.bankAccountInformation?.bankName}
                  valuesOption={[
                    t(
                      "pages_corporate-management_edit_[id].البنك_الأهلي_السعودي"
                    ),
                    t("pages_corporate-management_edit_[id].مصرف_الراجحي"),
                    t("pages_corporate-management_edit_[id].بنك_الرياض"),
                    t(
                      "pages_corporate-management_edit_[id].البنك_السعودي_الفرنسي"
                    ),
                    t(
                      "pages_corporate-management_edit_[id].البنك_العربي_الوطني"
                    ),
                    t("pages_corporate-management_edit_[id].بنك_البلاد"),
                    t("pages_corporate-management_edit_[id].بنك_الجزيرة"),
                    t(
                      "pages_corporate-management_edit_[id].البنك_السعودي_للاستثمار"
                    ),
                    t(
                      "pages_corporate-management_edit_[id].البنك_السعودي_الأول_ساب"
                    ),
                    t("pages_corporate-management_edit_[id].مصرف_الإنماء"),
                    t(
                      "pages_corporate-management_edit_[id].بنك_الخليج_الدولي_السعودية"
                    ),
                    t("pages_corporate-management_edit_[id].بنك_إس_تي_سي"),
                    t(
                      "pages_corporate-management_edit_[id].البنك_السعودي_الرقمي"
                    ),
                    t("pages_corporate-management_edit_[id].بنك_دال_ثلاث_مئة"),
                  ]}
                  name="bankAccountInformation.bankName"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  error={formik.errors.bankAccountInformation?.bankName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t("pages_corporate-management_edit_[id].رقم_الايبان")}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].رقم_الايبان"
                  )}
                  type="text"
                  value={formik.values.bankAccountInformation?.accountNumber}
                  name="bankAccountInformation.accountNumber"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  error={formik.errors.bankAccountInformation?.accountNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <FileUpload
                  name="bankCertificate"
                  formik={formik}
                  value={formik.values?.bankCertificate}
                  label={t(
                    "pages_corporate-management_edit_[id].الشهادة_المصرفية"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.bankCertificate)}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  label="سعر الأصل"
                  placeholder="00,00"
                  type="text"
                  name="originPriceFormatted"
                  customStyle={{ width: "100%" }}
                  value={formik.values?.originPriceFormatted || ""}
                  handleChange={(val) =>
                    handleFormattedNumberChange(val, "originPrice", formik)
                  }
                  error={formik.errors.originPrice}
                />
              </Grid>
            </Grid>
          </SectionHead>
        </Box>
        <Box sx={{ borderRadius: "20px", border: "1px solid #D6D9E1", mb: 2 }}>
          <SectionHead
            title={t("pages_corporate-management_edit_[id].معلومات_المفوض")}
            customStyle={{
              bgcolor: "#fff",
              borderRadius: "20px",
              padding: "16px",
            }}
            large
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t("pages_corporate-management_edit_[id].الاسم")}
                  placeholder={t("pages_corporate-management_edit_[id].الاسم")}
                  type="text"
                  value={formik.values.name}
                  name="name"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  error={formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t(
                    "pages_corporate-management_edit_[id].البريد_الالكتروني"
                  )}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].البريد_الالكتروني"
                  )}
                  type="text"
                  value={formik.values.email}
                  name="email"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  error={formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t("pages_corporate-management_edit_[id].رقم_الهوية")}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].رقم_الهوية"
                  )}
                  type="text"
                  value={formik.values.identityNumber}
                  name="identityNumber"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  error={formik.errors.identityNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Input
                  label={t("pages_corporate-management_edit_[id].رقم_الجوال")}
                  placeholder={t(
                    "pages_corporate-management_edit_[id].ادخل_رقم_الجوال"
                  )}
                  type="phone"
                  startIcon="/images/icons/phone.svg"
                  value={formik.values.phoneNumber.number}
                  name="phoneNumber.number"
                  customStyle={{ width: "100%" }}
                  handleChange={handleNumericInputChange}
                  error={formik.errors.phoneNumber?.number}
                />
              </Grid>
              <Grid item xs={12}>
                <FileUpload
                  name="identityAttachment"
                  formik={formik}
                  value={formik.values?.identityAttachment}
                  label={t(
                    "pages_corporate-management_edit_[id].مرفق_هوية_المفوض"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.identityAttachment)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FileUpload
                  name="articlesOfAssociation"
                  formik={formik}
                  value={formik.values?.articlesOfAssociation}
                  label={t(
                    "pages_corporate-management_edit_[id].مرفق_خطاب_التفويض"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.identityAttachment)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FileUpload
                  name="letterOfAuthorization"
                  formik={formik}
                  value={formik.values?.letterOfAuthorization}
                  label={t(
                    "pages_corporate-management_edit_[id].مرفق_عقد_التأسيس"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.identityAttachment)}
                />
              </Grid>
            </Grid>
          </SectionHead>
        </Box>
        {hasRole("update provider") && (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
              <CustomButton
                handleClick={formik.submitForm}
                text={t("pages_corporate-management_edit_[id].حفظ_التعديلات")}
                disabled={
                  Object.keys(formik.errors).length > 0 ||
                  isFormUnchanged ||
                  formik.isSubmitting
                }
                customeStyle={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                text={t("pages_corporate-management_edit_[id].إلغاء")}
                type="close"
                handleClick={() =>
                  router.push(
                    `/corporate-management/details/${providerData._id}`
                  )
                }
              />
            </Grid>
          </Grid>
        )}
      </Box>
      <CustomSnackbar
        type={alert.type}
        open={open}
        setOpen={setOpen}
        message={alert.msg}
      />
    </>
  );
}
