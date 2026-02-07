import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProviders,
  getProvider,
  createProvider,
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
import {
  createProviderSchema,
  providerValidationSchema,
} from "@/services/schema";
import CustomSnackbar from "@/components/toastMsg";

export default function ProviderCreat() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    provider,
    loadingProvider,
    updatedProviderFlag,
    errorProvider,
    errorRequestProvider,
  } = useSelector((state) => state.provider);
  const [profileImg, setProfileImg] = useState(null);
  const [check, setCheck] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({});
  const [taxType, setTaxType] = useState(
    t("pages_corporate-management_create-provider_index.خاضع_للضريبة")
  );

  useEffect(() => {
    const providerId = provider?.data?._id;
    const queryId = router.query.id;

    if (queryId && providerId !== queryId) {
      dispatch(getProvider(queryId));
    }
  }, [router.query.id]);
  useEffect(() => {
    // if (profile?.data?.type !== "admin") router.push("/");
    if (!hasRole("create provider")) router.push("/");
  }, []);
  const handleProfileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImg(file);
    }
  };

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(name, file);
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
    const flattenedData = {};

    // Flatten the nested objects
    const flattenObject = (obj, parentKey = "") => {
      Object.keys(obj).forEach((key) => {
        let value = obj[key];
        const newKey = parentKey ? `${parentKey}[${key}]` : key;

        if (parentKey === "bankAccountInformation" && key === "accountNumber") {
          value = value.startsWith("SA") ? value : `SA${value}`;
        }

        if (typeof value === "object" && value !== null) {
          flattenObject(value, newKey);
        } else {
          flattenedData[newKey] = value;
        }
      });
    };

    flattenObject(values);

    if (profileImg) {
      flattenedData.companyProfileImage = profileImg;
    }
    if (formik.values?.valAttachment) {
      flattenedData.valAttachment = formik.values.valAttachment;
    }
    if (formik.values?.taxAttachment) {
      flattenedData.taxAttachment = formik.values.taxAttachment;
    }
    if (formik.values?.identityAttachment) {
      flattenedData.identityAttachment = formik.values.identityAttachment;
    }
    if (formik.values?.articlesOfAssociation) {
      flattenedData.articlesOfAssociation = formik.values.articlesOfAssociation;
    }
    if (formik.values?.letterOfAuthorization) {
      flattenedData.letterOfAuthorization = formik.values.letterOfAuthorization;
    }
    if (formik.values?.bankCertificate) {
      flattenedData.bankCertificate = formik.values.bankCertificate;
    }
    if (formik.values?.commercialAttachment) {
      flattenedData.commercialAttachment = formik.values.commercialAttachment;
    }

    if (Object.keys(flattenedData).length > 0) {
      try {
        await dispatch(createProvider(flattenedData)).unwrap();

        await dispatch(
          getAllProviders(buildQueryParams({ status: "approved" }))
        ).unwrap();

        // Optionally reset form and navigate after submission
        setProfileImg(null);
        // resetForm({ values: { ...values } });
        setAlert({
          msg: t(
            "pages_corporate-management_create-provider_index.تم_الانشاء_بنجاح"
          ),
          type: "success",
        });
        setOpen(true);
        router.push(`/corporate-management`);
      } catch (error) {
        setAlert({ msg: error, type: "error" });
        setOpen(true);
      }
    }
  };
  const formik = useFormik({
    initialValues: {
      approvedByNafath: true,
      accreditationRequest: false,
      companyProfileImage: "",
      companyName: "",
      password: "",
      companyPhoneNumber: {
        number: "",
        key: "+966",
      },
      valAuctionsLicense: {
        number: "",
      },
      valAttachment: "",
      companyEmail: "",
      realEstateActivity: t(
        "pages_corporate-management_create-provider_index.النشاط_العقارى"
      ),
      bankAccountInformation: {
        accountNumber: "",
        bankName: "",
      },
      bankCertificate: "",
      commercialRegistration: {
        number: "",
        startDate: "",
        endDate: "",
      },
      originPrice: null,
      originPriceFormatted: "",
      /**بيانات المفوض */
      name: "",
      email: "",
      identityNumber: "",
      phoneNumber: {
        number: "",
        key: "+966",
      },
      tax: {
        number: "",
        type: t(
          "pages_corporate-management_create-provider_index.خاضع_للضريبة"
        ),
      },
      taxAttachment: "",
      identityAttachment: "",
      articlesOfAssociation: "",
      letterOfAuthorization: "",
      commercialAttachment: "",
    },
    validationSchema: () => createProviderSchema(taxType),
    // validationSchema: createProviderSchema(),
    onSubmit: handleSubmit,
  });
  const handleInputChange = (value, name) => {
    if (name === "tax.type") {
      formik.setFieldError("tax.type", "");
      setTaxType(value);
      formik.setFieldValue(name, value);
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
  const isFormUnchanged =
    JSON.stringify(formik.values) === JSON.stringify(formik.initialValues) &&
    profileImg === null;

  if (errorProvider || errorRequestProvider) {
    return <>404</>;
  }

  return (
    <>
      <Head>
        <title>
          {t("pages_corporate-management_create-provider_index.اضافة_شركة")}
        </title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Box>
        <BreadcrumbsNav
          title={t(
            "pages_corporate-management_create-provider_index.إدارة_الشركات"
          )}
          links={[
            {
              href: "/corporate-management",
              label: t(
                "pages_corporate-management_create-provider_index.إدارة_الشركات"
              ),
            },
          ]}
          currentText={t(
            "pages_corporate-management_create-provider_index.إضافة_شركة"
          )}
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
              src={profileImg ? URL.createObjectURL(profileImg) : ""}
              defultSrc="/images/company.svg"
              role="create provider"
              handleFileChange={handleProfileChange}
            />
          </Box>

          {hasRole("create provider") && (
            <CustomButton
              handleClick={formik.submitForm}
              text={t(
                "pages_corporate-management_create-provider_index.إضافة_الشركة"
              )}
              // disabled={
              //   Object.keys(formik.errors).length > 0 ||
              //   isFormUnchanged ||
              //   formik.isSubmitting
              // }
            />
          )}
        </Box>
        <Box sx={{ borderRadius: "20px", border: "1px solid #D6D9E1", mb: 2 }}>
          <SectionHead
            title={t(
              "pages_corporate-management_create-provider_index.بيانات_الشركة"
            )}
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
                  label={t(
                    "pages_corporate-management_create-provider_index.إسم_الشركة"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.إسم_الشركة"
                  )}
                  type="text"
                  value={formik.values.companyName}
                  name="companyName"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("companyName", true);
                  }}
                  error={
                    formik.touched.companyName && formik.errors.companyName
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  type="radio"
                  label={t(
                    "pages_corporate-management_create-provider_index.معتمد_من_انفاذ"
                  )}
                  value={formik.values.approvedByNafath}
                  handleChange={(newValue) =>
                    formik.setFieldValue("approvedByNafath", newValue)
                  } // Update value correctly
                  valuesOption={[
                    {
                      value: true,
                      label: t(
                        "pages_corporate-management_create-provider_index.نعم"
                      ),
                    },
                    {
                      value: false,
                      label: t(
                        "pages_corporate-management_create-provider_index.لا"
                      ),
                    },
                  ]}
                  shrink={true}
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  type="radio"
                  label={t(
                    "pages_corporate-management_create-provider_index.هل_ترغب_بتقديم_طلب"
                  )}
                  value={formik.values.accreditationRequest}
                  handleChange={(newValue) =>
                    formik.setFieldValue("accreditationRequest", newValue)
                  } // Update value correctly
                  valuesOption={[
                    {
                      value: true,
                      label: t(
                        "pages_corporate-management_create-provider_index.نعم"
                      ),
                    },
                    {
                      value: false,
                      label: t(
                        "pages_corporate-management_create-provider_index.لا"
                      ),
                    },
                  ]}
                  shrink={true}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <InputLabel sx={{ ...styles.label }}>
                  النشاط العقاري{" "}
                </InputLabel>
                <Input
                  label={t("pages_corporate-management_create-provider_index.مزادات_عقارية")}
                  type="checkbox"
                  value={t("pages_corporate-management_create-provider_index.مزادات_عقارية")}
                  name="realEstateActivity"
                  customStyle={{ width: "100%" }}
                  // handleChange={handleCheck}
                />
              </Grid> */}

              {/**السجل التجاري */}
              <Grid item xs={12} md={6}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.رقم_السجل_التجاري"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.رقم_السجل_التجاري"
                  )}
                  type="text"
                  value={formik.values?.commercialRegistration?.number}
                  name="commercialRegistration.number"
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched(
                      "commercialRegistration.number",
                      true
                    );
                  }}
                  customStyle={{ width: "100%" }}
                  handleChange={handleNumericInputChange}
                  error={
                    formik.touched.commercialRegistration?.number &&
                    formik.errors.commercialRegistration?.number
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.تاريخ_الاصدار"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.تاريخ_الاصدار"
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
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched(
                      "commercialRegistration.startDate",
                      true
                    );
                  }}
                  error={
                    formik.touched.commercialRegistration?.startDate &&
                    formik.errors.commercialRegistration?.startDate
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.تاريخ_الانتهاء"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.تاريخ_الانتهاء"
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
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched(
                      "commercialRegistration.endDate",
                      true
                    );
                  }}
                  error={
                    formik.touched.commercialRegistration?.endDate &&
                    formik.errors.commercialRegistration?.endDate
                  }
                />
              </Grid>
              {/* commercialAttachment */}
              <Grid item xs={12}>
                <FileUpload
                  name="commercialAttachment"
                  formik={formik}
                  value={formik.values?.commercialAttachment}
                  label={t(
                    "pages_corporate-management_create-provider_index.مرفق_السجل_التجاري"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.commercialAttachment)}
                  error={
                    formik.touched.commercialAttachment &&
                    formik.errors.commercialAttachment
                  }
                />
              </Grid>
              {/**رخصة فال للمزادات */}
              <Grid item xs={12} sm={6}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.رقم_رخصة_فال_للمزادات"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.رقم_رخصة_فال_للمزادات"
                  )}
                  type="text"
                  value={formik.values?.valAuctionsLicense?.number}
                  name="valAuctionsLicense.number"
                  customStyle={{ width: "100%" }}
                  handleChange={handleNumericInputChange}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("valAuctionsLicense.number", true);
                  }}
                  error={
                    formik.touched.valAuctionsLicense?.number &&
                    formik.errors.valAuctionsLicense?.number
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileUpload
                  name="valAttachment"
                  formik={formik}
                  value={formik.values?.valAttachment}
                  label={t(
                    "pages_corporate-management_create-provider_index.مرفق_رخصة_فال"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.valAttachment)}
                  error={
                    formik.touched.valAttachment && formik.errors.valAttachment
                  }
                />
              </Grid>

              {/**tax */}
              <Grid item xs={12} md={12}>
                <Input
                  type="radio"
                  label={t(
                    "pages_corporate-management_create-provider_index.اختر_نوع_الضريبة"
                  )}
                  value={formik.values.tax?.type}
                  handleChange={(newValue) => {
                    formik.setFieldValue("tax.type", newValue); // Update the tax type value

                    // Conditionally reset fields if t("pages_corporate-management_create-provider_index.غير_خاضع_للضريبة") is selected
                    if (
                      newValue ===
                      t(
                        "pages_corporate-management_create-provider_index.غير_خاضع_للضريبة"
                      )
                    ) {
                      formik.setFieldValue("tax.number", ""); // Reset tax number
                      formik.setFieldValue("taxAttachment", ""); // Reset tax attachment
                    }
                  }}
                  valuesOption={[
                    {
                      value: t(
                        "pages_corporate-management_create-provider_index.خاضع_للضريبة"
                      ),
                      label: t(
                        "pages_corporate-management_create-provider_index.خاضع_للضريبة"
                      ),
                    },
                    {
                      value: t(
                        "pages_corporate-management_create-provider_index.غير_خاضع_للضريبة"
                      ),
                      label: t(
                        "pages_corporate-management_create-provider_index.غير_خاضع_للضريبة"
                      ),
                    }, // Corrected label
                  ]}
                  shrink={true}
                  error={formik.touched.tax?.type && formik.errors.tax?.type} 
                />
              </Grid>

              {formik.values.tax.type ==
                t(
                  "pages_corporate-management_create-provider_index.خاضع_للضريبة"
                ) && (
                <>
                  <Grid item xs={12} md={6}>
                    <Input
                      label={t(
                        "pages_corporate-management_create-provider_index.الرقم_الضريبي"
                      )}
                      placeholder={t(
                        "pages_corporate-management_create-provider_index.الرقم_الضريبي"
                      )}
                      type="text"
                      value={formik.values?.tax?.number}
                      name="tax.number"
                      customStyle={{ width: "100%" }}
                      handleChange={handleNumericInputChange}
                      error={formik.touched.tax?.number&& formik.errors.tax?.number}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FileUpload
                      name="taxAttachment"
                      formik={formik}
                      value={formik.values?.taxAttachment}
                      label={t(
                        "pages_corporate-management_create-provider_index.شهادة_التسجيل_الضريبي"
                      )}
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                      handleFileChange={handleFileChange}
                      type={getFileType(formik.values?.taxAttachment)}
                      error={formik.touched.taxAttachment&&formik.errors.taxAttachment}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={6}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.البريد_الإلكتروني"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.البريد_الإلكتروني"
                  )}
                  type="text"
                  value={formik.values.companyEmail}
                  name="companyEmail"
                  startIcon="/images/icons/email.svg"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("companyEmail", true);
                  }}
                  endIcon={<Typography></Typography>}
                  error={
                    formik.touched.companyEmail && formik.errors.companyEmail
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.رقم_الجوال"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.ادخل_رقم_الجوال"
                  )}
                  type="phone"
                  disabled={false}
                  startIcon="/images/icons/phone.svg"
                  value={formik.values.companyPhoneNumber.number}
                  name="companyPhoneNumber.number"
                  customStyle={{ width: "100%" }}
                  handleChange={handleNumericInputChange}
                  // handleBlur={formik.handleBlur}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("companyPhoneNumber.number", true);
                  }}
                  error={
                    formik.touched.companyPhoneNumber?.number &&
                    formik.errors.companyPhoneNumber?.number
                  }
                />
              </Grid>
            </Grid>
          </SectionHead>
        </Box>
        <Box sx={{ borderRadius: "20px", border: "1px solid #D6D9E1", mb: 2 }}>
          <SectionHead
            title={t(
              "pages_corporate-management_create-provider_index.معلومات_المفوض"
            )}
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
                  label={t(
                    "pages_corporate-management_create-provider_index.الاسم"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.الاسم"
                  )}
                  type="text"
                  value={formik.values.name}
                  name="name"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("name", true);
                  }}
                  error={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.البريد_الالكتروني"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.البريد_الالكتروني"
                  )}
                  type="text"
                  value={formik.values.email}
                  name="email"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("email", true);
                  }}
                  error={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.رقم_الهوية"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.رقم_الهوية"
                  )}
                  type="text"
                  value={formik.values.identityNumber}
                  name="identityNumber"
                  startIcon="/images/icons/nid.svg"
                  endIcon={<Typography></Typography>}
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("identityNumber", true);
                  }}
                  error={
                    formik.touched.identityNumber &&
                    formik.errors.identityNumber
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.رقم_الجوال"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.ادخل_رقم_الجوال"
                  )}
                  type="phone"
                  startIcon="/images/icons/phone.svg"
                  value={formik.values.phoneNumber.number}
                  name="phoneNumber.number"
                  customStyle={{ width: "100%" }}
                  handleChange={handleNumericInputChange}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("phoneNumber.number", true);
                  }}
                  error={
                    formik.touched.phoneNumber?.number &&
                    formik.errors.phoneNumber?.number
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FileUpload
                  name="identityAttachment"
                  formik={formik}
                  value={formik.values?.identityAttachment}
                  label={t(
                    "pages_corporate-management_create-provider_index.مرفق_هوية_المفوض"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.identityAttachment)}
                  error={
                    formik.touched.identityAttachment &&
                    formik.errors.identityAttachment
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FileUpload
                  name="articlesOfAssociation"
                  formik={formik}
                  value={formik.values?.articlesOfAssociation}
                  label={t(
                    "pages_corporate-management_create-provider_index.مرفق_خطاب_التفويض"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.articlesOfAssociation)}
                  error={
                    formik.touched.articlesOfAssociation &&
                    formik.errors.articlesOfAssociation
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FileUpload
                  name="letterOfAuthorization"
                  formik={formik}
                  value={formik.values?.letterOfAuthorization}
                  label={t(
                    "pages_corporate-management_create-provider_index.مرفق_عقد_التأسيس"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.letterOfAuthorization)}
                  error={
                    formik.touched.letterOfAuthorization &&
                    formik.errors.letterOfAuthorization
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.كلمه_المرور"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.كلمه_المرور"
                  )}
                  type="password"
                  value={formik.values.password}
                  name="password"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched("password", true);
                  }}
                  error={formik.touched.password && formik.errors.password}
                />
              </Grid>
            </Grid>
          </SectionHead>
        </Box>
        <Box sx={{ borderRadius: "20px", border: "1px solid #D6D9E1", mb: 2 }}>
          <SectionHead
            title={t(
              "pages_corporate-management_create-provider_index.البيانات_المالية"
            )}
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
                  label={t(
                    "pages_corporate-management_create-provider_index.إسم_البنك"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.إسم_البنك"
                  )}
                  type="selectbox"
                  value={formik.values.bankAccountInformation?.bankName}
                  valuesOption={[
                    t(
                      "pages_corporate-management_create-provider_index.البنك_الأهلي_السعودي"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.مصرف_الراجحي"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.بنك_الرياض"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.البنك_السعودي_الفرنسي"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.البنك_العربي_الوطني"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.بنك_البلاد"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.بنك_الجزيرة"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.البنك_السعودي_للاستثمار"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.البنك_السعودي_الأول_ساب"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.مصرف_الإنماء"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.بنك_الخليج_الدولي_السعودية"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.بنك_إس_تي_سي"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.البنك_السعودي_الرقمي"
                    ),
                    t(
                      "pages_corporate-management_create-provider_index.بنك_دال_ثلاث_مئة"
                    ),
                  ]}
                  name="bankAccountInformation.bankName"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  // handleBlur={(e) => {
                  //   formik.handleBlur(e);
                  //   formik.setFieldTouched(
                  //     "bankAccountInformation.bankName",
                  //     true
                  //   );
                  // }}
                  // error={
                  //   formik.touched.bankAccountInformation?.bankName &&
                  //   formik.errors.bankAccountInformation?.bankName
                  // }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  label={t(
                    "pages_corporate-management_create-provider_index.رقم_الأيبان"
                  )}
                  placeholder={t(
                    "pages_corporate-management_create-provider_index.رقم_الأيبان"
                  )}
                  type="text"
                  value={formik.values.bankAccountInformation?.accountNumber}
                  name="bankAccountInformation.accountNumber"
                  customStyle={{ width: "100%" }}
                  handleChange={handleInputChange}
                  handleBlur={(e) => {
                    formik.handleBlur(e);
                    formik.setFieldTouched(
                      "bankAccountInformation.accountNumber",
                      true
                    );
                  }}
                  error={
                    formik.touched.bankAccountInformation?.accountNumber &&
                    formik.errors.bankAccountInformation?.accountNumber
                  }
                  // endIcon="/icons/bank-start.svg"
                />
              </Grid>
              <Grid item xs={12}>
                <FileUpload
                  name="bankCertificate"
                  formik={formik}
                  value={formik.values?.bankCertificate}
                  label={t(
                    "pages_corporate-management_create-provider_index.مرفق_الشهادة_المصرفية"
                  )}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                  handleFileChange={handleFileChange}
                  type={getFileType(formik.values?.bankCertificate)}
                  error={
                    formik.touched.bankCertificate &&
                    formik.errors.bankCertificate
                  }
                />
              </Grid>
              <Grid item xs={12} >
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

        {hasRole("create provider") && (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ px: 1 }}>
            <Grid item xs={6} md={6}>
              <CustomButton
                handleClick={formik.submitForm}
                text={t(
                  "pages_corporate-management_create-provider_index.إضافة_الشركة"
                )}
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
                text={t(
                  "pages_corporate-management_create-provider_index.إلغاء"
                )}
                type="close"
                handleClick={() => router.push(`/corporate-management`)}
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
