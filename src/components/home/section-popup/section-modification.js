import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import { hasRole, isEmptyObject } from "@/services/utils";
import Button from "@/components/button";
import Input from "@/components/inputs";
import ErrorMsg from "@/components/error-message/index";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createDepartment,
  updateDepartment,
} from "@/Redux/slices/departmentSlice";
import Snackbar from "@/components/toastMsg/index.js";
import { getAllEmployees, getEmployees } from "@/Redux/slices/employeeSlice";
import PopupTitle from "@/components/popup-title";

export default function DepartmentModification({
  department = {},
  handleClose,
  source,
}) {
  const { t } = useTranslation();
const messages = {
  name: t("components_home_section-popup_section-modification.اسم_القسم_اجباري"),
  manager: t("components_home_section-popup_section-modification.مدير_القسم_اجباري"),
};

  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: "",
    manager: "",
  });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const { employees, allEmployees } = useSelector((state) => state.employee);
  const { updateLoading, error } = useSelector((state) => state.department);

  useEffect(() => {
    if (Object.keys(department).length > 0) {
      setData({
        name: department.name,
        manager: department.manager,
      });
    }
    return () => {
      setData({
        name: "",
        manager: "",
      });
      setErrors({});
    };
  }, [department]);
  useEffect(() => {
    if (!allEmployees) dispatch(getAllEmployees());
  }, []);
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
        createDepartment({
          name: {
            en: data.name,
            ar: data.name,
          },
          manager: data?.manager?.user,
          description: {
            en: data.name,
            ar: data.name,
          },
        })
      );
    } else if (source == "EDIT") {
      response = await dispatch(
        updateDepartment({
          data: {
            name: {
              en: data.name,
              ar: data.name,
            },
            manager: data?.manager?.user,
          },
          id: department._id,
        })
      );
    }
    if (response?.meta?.requestStatus === "fulfilled") {
      handleClose();
    } else {
      setOpen(true);
    }
  };
  if (!department) return;

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
      <PopupTitle
        title={
          Object.keys(department).length > 0 ? "تعديل  قسم " : " اضافة  قسم"
        }
        handleClose={handleClose}
      />
      <Box>
        <Input
          label={t("components_home_section-popup_section-modification.اسم_القسم")}
          value={data.name}
          handleChange={handleInputChange}
          placeholder={t("components_home_section-popup_section-modification.اسم_القسم")}
          type="text"
          disabled={false}
          name="name"
          customStyle={{ width: "100%" }}
        />
        {errors?.name && <ErrorMsg message={errors?.name} />}
      </Box>
      <Box>
        <Input
          label={t("components_home_section-popup_section-modification.حدد_مدير_القسم")}
          placeholder={t("components_home_section-popup_section-modification.حدد_مدير_القسم")}
          type="selectbox"
          valuesOption={allEmployees?.data}
          handleChange={handleInputChange}
          value={data.manager != "" ? data.manager : ""}
          name="manager"
          // customStyle={{ width: "100%" }}
          customStyle={{ width: "100%", mb: 2 }}
        />
        {errors?.manager && <ErrorMsg message={errors?.manager} />}
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
          handleClick={handleSubmit}
          disabled={updateLoading}
          text={Object.keys(department).length > 0 ? t("components_home_section-popup_section-modification.تحديث") : t("components_home_section-popup_section-modification.اضافة")}
        />
      </Box>
      <Snackbar open={open} setOpen={setOpen} message={error} />
    </Box>
  );
}
