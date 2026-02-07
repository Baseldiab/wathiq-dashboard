import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
import Input from "@/components/inputs";
import ErrorMsg from "@/components/error-message/index";
import { useEffect } from "react";
import { createRole, updateRole } from "@/Redux/slices/roleSlice";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@/components/toastMsg/index.js";
import { isEmptyObject } from "@/services/utils";
import CustomSnackbar from "@/components/toastMsg/index.js";
import PopupTitle from "@/components/popup-title";


export default function JobModification({ job = {}, handleClose, source }) {
  const { t } = useTranslation();
  
const messages = {
  name: " المسمي الوظيفي اجباري",
  permissions: t("components_home_job-popup_job-modification.الصلاحيات_اجباري"),
};
  const [data, setData] = useState({
    name: "",
    permissions: [],
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const { updateLoading, error } = useSelector((state) => state.role);
  const { permissions } = useSelector((state) => state.global);
  console.log("permissions", permissions);
  const dispatch = useDispatch();
  useEffect(() => {
    if (Object.keys(job).length > 0) {
      setData(job);
    }
    return () => {
      setData({
        name: "",
        permissions: [],
      });
      setErrors({});
    };
  }, [job]);

  const handleInputChange = (value, name) => {
    let val = value;

    setErrors({ ...errors, [name]: "" });

    if (name === "permissions") typeof val === "string" ? val.split(",") : val;

    setData({ ...data, [name]: val });
  };

  const handleSubmit = async () => {
    const errors = isEmptyObject(data, messages);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    let response;
    if (source == "ADD") {
      response = await dispatch(
        createRole({
          name: { en: data.name, ar: data.name },
          permissions: data.permissions,
        })
      );
    } else if (source == "EDIT") {
      response = await dispatch(
        updateRole({
          data: {
            name: { en: data.name, ar: data.name },
            permissions: data.permissions,
          },
          id: job._id,
        })
      );
    }
    if (response?.meta?.requestStatus === "fulfilled") {
      handleClose();
    } else {
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid #EBEEF3",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        background: "#fff",
        width: "100%",
      }}
    >
      {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ fontSize: "1.3rem", fontWeight: 700, color: "#202726" }}
        >
          {Object.keys(job).length > 0 ? "تعديل صلاحية " : " إضافة صلاحية"}
        </Typography>
        <img
          src="/images/icons/close-x.svg"
          style={{ cursor: "pointer" }}
          alt="close"
          onClick={handleClose}
        />
      </Box> */}
      <PopupTitle
        title={Object.keys(job).length > 0 ? t("components_home_job-popup_job-modification.تعديل_صلاحية") : t("components_home_job-popup_job-modification.إضافة_صلاحية")}
        handleClose={handleClose}
      />

      <Box>
        <Input
          label={t("components_home_job-popup_job-modification.المسمي_الوظيفي")}
          value={data.name}
          handleChange={handleInputChange}
          placeholder={t("components_home_job-popup_job-modification.اسم_المسمي_الوظيفي")}
          type="text"
          disabled={false}
          name="name"
          customStyle={{ width: "100%" }}
        />
        {errors?.name && <ErrorMsg message={errors?.name} />}
      </Box>
      <Box>
        <Input
          multiple={true}
          label={t("components_home_job-popup_job-modification.حدد_الصلاحيات")}
          placeholder={t("components_home_job-popup_job-modification.الصلاحيات")}
          type="selectbox"
          valuesOption={permissions?.data}
          handleChange={handleInputChange}
          value={data?.permissions}
          name="permissions"
          customStyle={{ width: "100%" }}
        />
        {errors?.permissions && <ErrorMsg message={errors?.permissions} />}
      </Box>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <Button
          customeStyle={{ width: "100%" }}
          disabled={updateLoading}
          handleClick={handleSubmit}
          text={Object.keys(job).length > 0 ? t("components_home_job-popup_job-modification.تحديث") : t("components_home_job-popup_job-modification.اضافة")}
        />
      </Box>
    </Box>
  );
}
