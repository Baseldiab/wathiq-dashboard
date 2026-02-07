import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchSocialData, updateSocialData } from "@/Redux/slices/socialSlice";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../inputs";
import CustomButton from "../button";
import { useEffect, useMemo, useState } from "react";
import GoogleMapInput from "../map";
import Loader from "../loader";
import CustomSnackbar from "../toastMsg";

/* =========================
 * Helpers
 * ========================= */
const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);

// نبني الـpayload: الأساسيات كاملة + مفاتيح السوشيال غير الفاضية فقط
const buildPayload = (values, socialKeys) => {
  const payload = {
    whatsapp: {
      number: values?.whatsapp?.number ?? "",
      key: values?.whatsapp?.key ?? "+966",
    },
    phoneNumber: {
      number: values?.phoneNumber?.number ?? "",
      key: values?.phoneNumber?.key ?? "+966",
    },
    email: values?.email ?? "",
    address: {
      longitude: values?.address?.longitude,
      latitude: values?.address?.latitude,
      title: values?.address?.title,
    },
  };

  socialKeys.forEach((k) => {
    const v = values?.[k];
    if (v !== "" && v !== null && v !== undefined) {
      payload[k] = v; // غير الفاضي بس
    }
  });

  return payload;
};

export default function SocialMediaGrid() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.social);

  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [alertOpen, setAlertOpen] = useState(false);

  // تعريفات السوشيال بميمو علشان الثبات
  const socialMediaLinks = useMemo(
    () => [
      { name: t("components_content_contact-us.إنستجرام"), key: "instagram", icon: "/images/icons/instagram.svg" },
      { name: t("components_content_contact-us.فيسبوك"), key: "facebook", icon: "/images/icons/facebook.svg" },
      { name: t("components_content_contact-us.لينكد_إن"), key: "linkedin", icon: "/images/icons/linkid_contactUS.svg" },
      { name: t("components_content_contact-us.إكس"), key: "twitter", icon: "/images/icons/X_contactUS.svg" },
    ],
    [t]
  );
  const socialKeys = useMemo(() => socialMediaLinks.map((i) => i.key), [socialMediaLinks]);

  // ===== Validation =====
  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        whatsapp: Yup.object().shape({
          number: Yup.string()
            .required(t("components_content_contact-us.مطلوب"))
            .matches(/^\d+$/, "يُسمح بالأرقام فقط"),
          key: Yup.string().required(),
        }),
        phoneNumber: Yup.object().shape({
          number: Yup.string()
            .required(t("components_content_contact-us.مطلوب"))
            .matches(/^\d+$/, "يُسمح بالأرقام فقط"),
          key: Yup.string().required(),
        }),
        email: Yup.string()
          .email(t("components_content_contact-us.بريد_إلكتروني_غير_صالح"))
          .required(t("components_content_contact-us.مطلوب")),
        address: Yup.object().shape({
          title: Yup.string().required(t("components_content_contact-us.مطلوب")),
          longitude: Yup.number().required(),
          latitude: Yup.number().required(),
        }),
        // السوشيال اختيارية: نسمح بفاضي من غير URL check
        ...socialKeys.reduce((acc, k) => {
          acc[k] = Yup.string().nullable();
          return acc;
        }, {}),
      }),
    [t, socialKeys]
  );

  // ===== Data Fetch =====
  useEffect(() => {
    dispatch(fetchSocialData());
  }, [dispatch]);

  // ===== Formik =====
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      whatsapp: {
        number: data?.data?.whatsapp?.number || "",
        key: data?.data?.whatsapp?.key || "+966",
      },
      phoneNumber: {
        number: data?.data?.phoneNumber?.number || "",
        key: data?.data?.phoneNumber?.key || "+966",
      },
      email: data?.data?.email || "",
      address: {
        longitude: data?.data?.address?.longitude ?? 44.7,
        latitude: data?.data?.address?.latitude ?? 33.8,
        title: data?.data?.address?.title ?? t("components_content_contact-us.الرياض"),
      },
      // خزن السوشيال كسلاسل ممكن تكون فاضية ""
      ...socialKeys.reduce((acc, k) => {
        acc[k] = data?.data?.[k] ?? "";
        return acc;
      }, {}),
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = buildPayload(values, socialKeys);

      try {
        await dispatch(updateSocialData(payload)).unwrap();
        setAlert({ msg: t("components_content_contact-us.تم_التحديث_بنجاح"), type: "success" });
        setIsEditing(false);
        // مهم: ريفتش بعد الحفظ علشان القيم تتزامن مع السيرفر
        dispatch(fetchSocialData());
      } catch (error) {
        console.error("Error updating data:", error);
        setAlert({
          msg: error?.message || t("components_content_contact-us.حدث_خطأ_أثناء_التحديث"),
          type: "error",
        });
      } finally {
        setAlertOpen(true);
      }
    },
  });

  const handleEditClick = () => setIsEditing(true);

  if (loading) return <Loader open={true} />;

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      {!isEditing && (
        <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
          <CustomButton
            customeStyle={{
              width: "100px",
              background: "transparent",
              color: "#6F6F6F",
              fontWeight: 700,
              m: 5,
              border: "1px solid #D6D9E1",
              "&:hover": { background: "transparent", color: "#6F6F6F", boxShadow: "none" },
            }}
            handleClick={handleEditClick}
            text={t("components_content_contact-us.تعديل")}
            type="edit"
          />
        </Box>
      )}

      <Typography sx={{ fontSize: "1.3rem", m: 5, fontWeight: 700, color: "#202726", display: "flex" }}>
        المحادثات{" "}
      </Typography>

      <Grid container spacing={2}>
        {/* Contact Details */}
        {[
          {
            name: t("components_content_contact-us.رقم_الواتساب"),
            key: "whatsapp",
            field: "number",
            icon: "/images/icons/whatsapp-contactUS.svg",
            adornment: "+966",
          },
          {
            name: t("components_content_contact-us.رقم_الجوال"),
            key: "phoneNumber",
            field: "number",
            icon: "/images/icons/call.svg",
            adornment: "+966",
          },
          {
            name: t("components_content_contact-us.البريد_الإلكتروني"),
            key: "email",
            icon: "/images/icons/mail_contactUs.svg",
          },
          {
            name: t("components_content_contact-us.الموقع"),
            key: "address",
            icon: "/images/icons/location-contactUs.svg",
          },
        ].map((item) => (
          <Grid container item spacing={2} alignItems="center" key={item.key}>
            <Grid item>
              <IconButton>
                <img src={item.icon} alt={item.name} style={{ width: 36, height: 36 }} />
              </IconButton>
            </Grid>

            <Grid item xs={8} sm={10}>
              {item.key !== "address" ? (
                <Input
                  fullWidth
                  placeholder={item.name}
                  name={item.key}
                  value={item.field ? formik.values[item.key]?.[item.field] : formik.values[item.key]}
                  handleChange={(value) =>
                    item.field
                      ? formik.setFieldValue(`${item.key}.${item.field}`, value)
                      : formik.setFieldValue(item.key, value)
                  }
                  onBlur={formik.handleBlur}
                  error={
                    item.field
                      ? formik.touched[item.key]?.[item.field] && formik.errors[item.key]?.[item.field]
                      : formik.touched[item.key] && formik.errors[item.key]
                  }
                  disabled={!isEditing}
                  inputStyle={{ backgroundColor: !isEditing && "#FFFFFF" }}
                  endIcon={
                    item.adornment && (
                      <Typography sx={{ px: "8px", borderRight: "2px solid #E1E1E2", mr: 1, fontWeight: 600 }}>
                        {item.adornment}
                      </Typography>
                    )
                  }
                />
              ) : (
                <GoogleMapInput
                  value={formik.values.address}
                  handleChange={(value) =>
                    formik.setFieldValue("address", {
                      longitude: value?.longitude,
                      latitude: value?.latitude,
                      title: value?.title,
                    })
                  }
                  inputStyle={{ backgroundColor: !isEditing && "#FFFFFF" }}
                  disabled={!isEditing}
                />
              )}
            </Grid>
          </Grid>
        ))}

        <Typography sx={{ fontSize: "1.3rem", m: 5, fontWeight: 700, color: "#202726", display: "flex" }}>
          {t("components_content_contact-us.التواصل_الاجتماعي")}
        </Typography>

        {/* Social Media Inputs */}
        {socialMediaLinks.map((item) => (
          <Grid container item spacing={2} alignItems="center" key={item.key}>
            <Grid item>
              <IconButton>
                <img src={item.icon} alt={item.name} style={{ width: 36, height: 36 }} />
              </IconButton>
            </Grid>
            <Grid item xs={8} sm={10}>
              <Input
                fullWidth
                placeholder={t("components_content_contact-us.الرابط")}
                name={item.key}
                value={formik.values[item.key]}
                handleChange={(value) => formik.setFieldValue(item.key, value)}
                error={formik.touched[item.key] && formik.errors[item.key]}
                inputStyle={{ backgroundColor: !isEditing && "#FFFFFF" }}
                disabled={!isEditing}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>

      {isEditing && (
        <Grid container spacing={{ xs: 2, md: 2 }} sx={{ px: 1, py: 3 }}>
          <Grid item xs={4}>
            <CustomButton
              customeStyle={{
                width: "100%",
                background: "transparent",
                color: "#6F6F6F",
                fontWeight: 700,
                border: "1px solid #D6D9E1",
                "&:hover": { background: "transparent", color: "#6F6F6F", boxShadow: "none" },
              }}
              handleClick={() => {
                formik.resetForm();
                setIsEditing(false);
              }}
              text={t("components_content_contact-us.إلغاء")}
              type="close"
            />
          </Grid>
          <Grid item xs={4}>
            <CustomButton
              handleClick={() => formik.handleSubmit()}
              text={t("components_content_contact-us.حفظ_التعديلات")}
              Submitting
              customeStyle={{ width: "100%" }}
            />
          </Grid>
        </Grid>
      )}

      <CustomSnackbar message={alert.msg} open={alertOpen} setOpen={setAlertOpen} type={alert.type} />
    </Box>
  );
}
