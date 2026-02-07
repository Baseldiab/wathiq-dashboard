import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAuctions,
  getAuction,
  updateAuction,
} from "@/Redux/slices/auctionsSlice";
import Loader from "@/components/loader";
import BreadcrumbsNav from "@/components/layout/navbar/bread-crumb-nav";
import CustomButton from "@/components/button";
import { Box, Grid, Typography } from "@mui/material";
import {
  buildQueryParams,
  determineAuctionStatuses,
  formatDate,
  getFileType,
  hasRole,
} from "@/services/utils";
import Input from "@/components/inputs";
import SectionHead from "@/components/corporate/main-info/section-head";
import { useFormik } from "formik";
import * as Yup from "yup";
import FileUpload from "@/components/file/upload-file";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Head from "next/head";
import CustomSnackbar from "@/components/toastMsg";
import GoogleMapInput from "@/components/map";
import { getProviders } from "@/Redux/slices/providerSlice";
import { auctionSchema } from "@/services/schema";

dayjs.extend(utc);

export default function AuctionEdit() {
  const { t } = useTranslation();
  const { auction, loadingAuction, updateAuctionLoading, updateAuctionError } =
    useSelector((state) => state.auctions);
  // const [reviewStatus, setReviewState] = useState("");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [selectedProviderName, setSelectedProviderName] = useState("");
  const { reviewStatus, auctionStatus } = determineAuctionStatuses(auctionData);

  const auctionData = auction?.data;
  const dispatch = useDispatch();
  const router = useRouter();
  const statueReviewFromApi = auctionData?.auctionReviewStatus?.status;
  const { providers } = useSelector((state) => state.provider);

  // useEffect(() => {
  //   if (statueReviewFromApi === "pending") {
  //     setReviewState(t("pages_auctions_edit_[id].قيد_الانشاء"));
  //   } else if (statueReviewFromApi === "approved") {
  //     setReviewState(t("pages_auctions_edit_[id].قيد_التنفيذ"));
  //   }
  // }, [statueReviewFromApi]);

  useEffect(() => {
    const auctionId = auctionData?._id;
    const queryId = router.query.id;

    if (queryId && auctionId !== queryId) {
      dispatch(getAuction(queryId));
    }
  }, [router.query.id, auctionData?._id]);
  useEffect(() => {
    if (!hasRole("update auction")) router.push("/");
  }, []);
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
      const booleanValue = value === t("pages_auctions_edit_[id].إنفاذ"); // t("pages_auctions_edit_[id].إنفاذ") -> true, t("pages_auctions_edit_[id].خاص") -> false
      formik.setFieldValue(name, booleanValue);
    } else if (name === "type") {
      const typeValue =
        value === t("pages_auctions_edit_[id].هجين")
          ? "hybrid"
          : value === t("pages_auctions_edit_[id].الكتروني")
          ? "online"
          : value === t("pages_auctions_edit_[id].حضوري")
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
    formik.setFieldTouched(name, true);
  };
  const handleNumericInputChange = (value, name) => {
    if (/^\d*$/.test(value)) {
      formik.setFieldValue(name, value);
    }
  };
  const handleSubmit = async (values) => {
    const formData = new FormData();
    let hasChanges = false;

    // Check if either date changed
    let startDateChanged = values.startDate !== formik.initialValues.startDate;
    let endDateChanged = values.endDate !== formik.initialValues.endDate;

    // Append changed fields to FormData (excluding startDate/endDate for now)
    Object.keys(values).forEach((key) => {
      if (key === "startDate" || key === "endDate") return;

      const value = values[key];

      if (value instanceof File) {
        formData.append(key, value);
        hasChanges = true;
      } else if (typeof value === "object" && value !== null) {
        Object.keys(value).forEach((subKey) => {
          if (value[subKey] !== formik.initialValues[key]?.[subKey]) {
            formData.append(`${key}[${subKey}]`, value[subKey]);
            hasChanges = true;
          }
        });
      } else if (
        value !== "" &&
        value !== null &&
        value !== formik.initialValues[key]
      ) {
        formData.append(key, value);
        hasChanges = true;
      }
    });
    if (startDateChanged || endDateChanged) {
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      hasChanges = true;
    }
    if (!hasChanges) {
      setAlert({
        msg: t("pages_auctions_edit_[id].لا_يوجد_تغييرات_لحفظها"),
        type: "warning",
      });
      setOpen(true);
      return;
    }

    try {
      console.log("Sending updated fields in FormData:", [
        ...formData.entries(),
      ]);
      await dispatch(
        updateAuction({ data: formData, id: auctionData?._id })
      ).unwrap();
      await dispatch(
        getAllAuctions(
          buildQueryParams({
            createdByAdmin: auctionData?.createdByAdmin,
            status: auctionData?.status,
            reviewStatus: auctionData?.auctionReviewStatus.status || "",
            specialToSupportAuthority: auctionData.specialToSupportAuthority,
          })
        )
      );
      await dispatch(getAuction(auctionData?._id)).unwrap();
      // router.push({
      //   pathname: `/auctions/details/${auctionData?._id}`,
      //   query: { updated: true },
      // });
      setAlert({
        msg: t("pages_auctions_edit_[id].تم_حفظ_التعديلات_بنجاح"),
        type: "success",
      });
      setOpen(true);
      router.push({
        pathname: `/auctions/details/${auctionData?._id}`,
        // query: { updated: true },
      });
    } catch (error) {
      setAlert({
        msg: updateAuctionError
          ? updateAuctionError
          : t("pages_auctions_edit_[id].حدث_خطأ_أثناء_التحديث"),
        type: "error",
      });
      setOpen(true);
    }
  };
  console.log("updateAuctionError", updateAuctionError);
  // Initialize form with existing auction data
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: auctionData?._id
      ? {
          specialToSupportAuthority:
            auctionData?.specialToSupportAuthority ?? "",
          provider: auctionData?.provider?.companyName ?? "",
          user: auctionData?.user?.name ? auctionData?.user?.name : "",
          title: {
            ar: auctionData?.title ?? "",
            en: "",
          },
          type: auctionData?.type ?? "",
          startDate: auctionData?.startDate ?? "",
          endDate: auctionData?.endDate ?? "",
          auctionApprovalNumber: auctionData?.auctionApprovalNumber ?? "",
          auctionBrochure: auctionData?.auctionBrochure ?? "",
          cover: auctionData?.cover ?? "",
          location: {
            longitude: auctionData?.location?.longitude ?? "",
            latitude: auctionData?.location?.latitude ?? "",
            title: auctionData?.location?.title ?? "",
          },
        }
      : {
          specialToSupportAuthority: "",
          provider: "",
          user: "",
          title: { ar: "", en: "" },
          type: "",
          startDate: "",
          endDate: "",
          auctionApprovalNumber: "",
          auctionBrochure: "",
          cover: "",
          location: { longitude: "", latitude: "", title: "" },
          user: "",
        },
    validationSchema: auctionSchema(
      auctionData?.provider?.companyName ? 2 : auctionData?.user?.name ? 3 : 1
    ),
    onSubmit: handleSubmit,
  });

  const isFormUnchanged =
    JSON.stringify(formik.values) === JSON.stringify(formik.initialValues);

  if (loadingAuction || updateAuctionLoading) return <Loader open={true} />;
  console.log("formik.values", formik.values);
  console.log("formik.errors", formik.errors);

  return (
    <>
      <Head>
        <title>{t("pages_auctions_edit_[id].تعديل_المزاد")}</title>
      </Head>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 2,
          }}
        >
          <BreadcrumbsNav
            title={t("pages_auctions_edit_[id].إدارة_المزادات")}
            links={[
              {
                href: "/auctions",
                label: t("pages_auctions_edit_[id].إدارة_المزادات"),
              },
              {
                href: `/auctions?mainTab=${getMainTabValue(
                  statueReviewFromApi,
                  auctionData?.status,
                  auctionData?.createdByAdmin
                )}`,
                label: reviewStatus,
              },
              {
                href: `/auctions/details/${auctionData?._id}`,
                label: auctionData?.title,
              },
            ]}
            currentText={t("pages_auctions_edit_[id].تعديل")}
          />
          <CustomButton
            handleClick={formik.handleSubmit}
            text={t("pages_auctions_edit_[id].حفظ_التعديلات")}
            disabled={isFormUnchanged}
          />
        </Box>

        <SectionHead title="" action>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Input
                disabled="true"
                label={t("pages_auctions_edit_[id].حالة_المزاد")}
                type="selectbox"
                name="specialToSupportAuthority"
                value={
                  formik.values?.specialToSupportAuthority === true
                    ? t("pages_auctions_edit_[id].إنفاذ")
                    : formik.values?.specialToSupportAuthority === false
                    ? t("pages_auctions_edit_[id].خاص")
                    : ""
                }
                valuesOption={[
                  t("pages_auctions_edit_[id].إنفاذ"),
                  t("pages_auctions_edit_[id].خاص"),
                ]}
                customStyle={{ width: "100%" }}
                handleChange={handleInputChange}
                placeholder={t("pages_auctions_edit_[id].إنفاذخاص")}
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
            {auctionData?.provider.companyName && (
              <Grid container>
                <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                  <Input
                    disabled="true"
                    label={t("pages_auctions_edit_[id].حدد_وكيل_البيع")}
                    placeholder={t("pages_auctions_edit_[id].إسم_الشركة")}
                    type="selectbox"
                    value={auctionData?.provider.companyName}
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
            {auctionData?.user?.name && (
              <Grid container>
                <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                  <Input
                    disabled="true"
                    label={t("pages_auctions_edit_[id].حدد_المستخدم")}
                    placeholder={t("pages_auctions_edit_[id].إسم_المستخدم")}
                    type="selectbox"
                    value={auctionData?.user?.name}
                    name="user"
                    valuesOption={[]}
                    customStyle={{ width: "100%" }}
                    handleChange={handleInputChange}
                    error={formik.touched.user && formik.errors.user}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </SectionHead>
        <SectionHead
          title={t("pages_auctions_edit_[id].بيانات_المزاد")}
          action
          large
        >
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6} lg={3}>
              <Input
                label={t("pages_auctions_edit_[id].إسم_المزاد")}
                type="text"
                name="title.ar"
                value={formik.values?.title.ar}
                customStyle={{ width: "100%" }}
                handleChange={handleInputChange}
                placeholder={t("pages_auctions_edit_[id].إسم_المزاد")}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("title?.ar", true);
                }}
                error={formik.touched.title?.ar && formik.errors.title?.ar}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Input
                label={t("pages_auctions_edit_[id].حالة_المزاد")}
                type="selectbox"
                name="type"
                value={
                  formik.values?.type === "hybrid"
                    ? t("pages_auctions_edit_[id].هجين")
                    : formik.values?.type === "online"
                    ? t("pages_auctions_edit_[id].الكتروني")
                    : formik.values?.type === "on_site"
                    ? t("pages_auctions_edit_[id].حضوري")
                    : ""
                }
                valuesOption={[
                  t("pages_auctions_edit_[id].هجين"),
                  t("pages_auctions_edit_[id].الكتروني"),
                  t("pages_auctions_edit_[id].حضوري"),
                ]}
                customStyle={{ width: "100%" }}
                handleChange={handleInputChange}
                placeholder={t("pages_auctions_edit_[id].اختار_حالة_المزاد")}
                handleBlur={(e) => {
                  formik.handleBlur(e);
                  formik.setFieldTouched("type", true);
                }}
                error={formik.touched.type && formik.errors.type}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Input
                label={t("pages_auctions_edit_[id].تاريخ_ووقت_بدأ_المزاد")}
                placeholder={t(
                  "pages_auctions_edit_[id].تاريخ_ووقت_بدأ_المزاد"
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
                label={t("pages_auctions_edit_[id].تاريخ_ووقت_إنتهاء_المزاد")}
                placeholder={t(
                  "pages_auctions_edit_[id].تاريخ_ووقت_إنتهاء_المزاد"
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
                label={t("pages_auctions_edit_[id].رقم_الموافقة_لإقامة_مزاد")}
                type="text"
                name="auctionApprovalNumber"
                value={formik.values?.auctionApprovalNumber}
                customStyle={{ width: "100%" }}
                handleChange={handleNumericInputChange}
                placeholder={t(
                  "pages_auctions_edit_[id].رقم_الموافقة_لإقامة_مزاد"
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
              <FileUpload
                name="auctionBrochure"
                formik={formik}
                value={formik.values?.auctionBrochure}
                label={t("pages_auctions_edit_[id].برشور_المزاد")}
                accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/svg, application/pdf"
                handleFileChange={handleFileChange}
                type={getFileType(formik.values?.auctionBrochure)}
                error={
                  formik.touched.auctionBrochure &&
                  formik.errors.auctionBrochure
                }
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <FileUpload
                name="cover"
                formik={formik}
                value={formik.values?.cover}
                label={t("pages_auctions_edit_[id].كفر_المزاد")}
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
                // error={formik.touched.location && formik.errors.location}
              />
            </Grid>
          </Grid>
        </SectionHead>
        {hasRole("update auction") && (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ py: 2 }}>
            <Grid item xs={6} md={6}>
              <CustomButton
                handleClick={formik.handleSubmit}
                text={t("pages_auctions_edit_[id].حفظ_التعديلات")}
                disabled={isFormUnchanged}
                customeStyle={{ width: "100%" }}
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
