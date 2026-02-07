import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
import Input from "@/components/inputs";
import ErrorMsg from "@/components/error-message/index";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createEmployee,
  updateEmployee,
  getRolesFordeoartment,
  getAvailableDepartmentForEmployee,
} from "@/Redux/slices/employeeSlice";
import { getDepartments } from "@/Redux/slices/departmentSlice";
import Snackbar from "@/components/toastMsg/index.js";
import { isEmptyObject } from "@/services/utils";
import CustomSnackbar from "@/components/toastMsg/index.js";
import Loader from "@/components/loader";
import PopupTitle from "@/components/popup-title";

export default function EmployeeModification({
  employee = {},
  handleClose,
  source,
}) {
  const { t } = useTranslation();
  
const messages = {
  password: t("components_home_employess-popup_employee-modification.كلمة_المرور_اجباري"),
  confirmPassword: t("components_home_employess-popup_employee-modification.اعادة_كلمة_المرور_اجباري"),
  minMatch: t("components_home_employess-popup_employee-modification.كلمة_المرور_وتأكيد_كلمة"),
  name: " ألاسم اجباري",
  phone: " رقم الجوال اجباري",
  permissions: t("components_home_employess-popup_employee-modification.الصلاحيات_اجباري"),
  identityNumber: t("components_home_employess-popup_employee-modification.رقم_الهوية_اجباري"),
};

  const [data, setData] = useState({
    phone: "",
    name: "",
    password: "",
    confirmPassword: "",
    permissions: [],
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const { roles } = useSelector((state) => state.role);
  const {
    updateLoading,
    error,
    availableDepartments,
    availableRoles,
    createEmError,
    loading,
  } = useSelector((state) => state.employee);
  const { departments } = useSelector((state) => state.department);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [alertOpen, setAlertOpen] = useState(false);
  const dispatch = useDispatch();
  console.log("createEmError", createEmError);
  useEffect(() => {
    if (Object.keys(employee).length > 0) {
      setData({
        phone: employee?.phoneNumber?.number,
        name: employee.name,
        permissions: employee.role,
        department: employee.department,
        identityNumber: employee.identityNumber,
      });
      dispatch(getAvailableDepartmentForEmployee(employee?.user));
      dispatch(getRolesFordeoartment(employee?.department?.id));
    } else {
      if (!departments) dispatch(getDepartments());
      dispatch(getRolesFordeoartment());
    }

    return () => {
      setData({
        phone: "",
        name: "",
        identityNumber: "",
        password: "",
        confirmPassword: "",
        permissions: {},
        department: "",
      });
      setErrors({});
    };
  }, [employee]);
console.log("data****************",data)
  const handleInputChange = (value, name) => {
    let val = value;
    setErrors({ ...errors, [name]: "" });
    if (name === "permissions") typeof val === "string" ? val.split(",") : val;
    if (name === "department") {
      setData({ ...data, [name]: val, permissions: {} });
      dispatch(getRolesFordeoartment(value?._id));
      return;
    }
    setData({ ...data, [name]: val });
  };
  const handleSubmit = async () => {
    let submittedData = {};
    console.log("submittedData", submittedData);

    if (source === "Edit") {
      submittedData = {
        phone: data.phone,
        name: data.name,
        identityNumber: data.identityNumber,
        password: data.password ? data.password : undefined,
        confirmPassword: data.confirmPassword
          ? data.confirmPassword
          : undefined,
        permissions: data.permissions,
        department: data.department ? data.department : undefined,
      };
    } else {
      submittedData = { ...data };
    }

    const errors = isEmptyObject(submittedData, messages);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    if (submittedData.password !== submittedData.confirmPassword) {
      setErrors({
        minMatch: t("components_home_employess-popup_employee-modification.كلمة_المرور_وتأكيد_كلمة"),
      });
      return;
    }

    let response;
    console.log("response", response);
    if (source == "ADD") {
      response = await dispatch(
        createEmployee({
          phoneNumber: {
            key: "+966",
            number: submittedData.phone,
          },
          password: submittedData.password,
          identityNumber: submittedData.identityNumber,
          role: submittedData?.permissions?._id,
          name: submittedData?.name,
          department: submittedData?.department._id,
        })
      );
      if (response?.meta?.requestStatus === "fulfilled") {
        setAlert({
          msg: t("components_home_employess-popup_employee-modification.تم_انشاء_الموظف_بنجاح"),
          type: "success",
        });
        setAlertOpen(true);
        handleClose();
      } else {
        setAlert({
          msg: createEmError != null ? createEmError : t("components_home_employess-popup_employee-modification.حدث_خطأ"),
          type: "error",
        });
        setAlertOpen(true);
        setOpen(true);
      }
    } else if (source == "EDIT") {
      response = await dispatch(
        updateEmployee({
          data: {
            phoneNumber: {
              key: "+966",
              number: submittedData.phone,
            },
            password: submittedData.password,
            role: submittedData?.permissions?._id,
            name: submittedData.name,
            ...(submittedData?.department !== "" && {
              department: submittedData?.department?._id,
            }),
            identityNumber: submittedData.identityNumber,
          },
          id: employee._id,
        })
      );
      if (response?.meta?.requestStatus === "fulfilled") {
        setAlert({
          msg: t("components_home_employess-popup_employee-modification.تم_تعديل_بيانات_الموظف"),
          type: "success",
        });
        setAlertOpen(true);
        handleClose();
      } else {
        setAlert({
          msg: t("components_home_employess-popup_employee-modification.تم_رفض_الطلب_بنجاح"),
          type: "error",
        });
        setAlertOpen(true);
        setOpen(true);
      }
    }
  };
  if (!employee) return;
  console.log("data.identityNumber", data);
  // if (updateLoading || loading) return <Loader open={true} />;
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
        title={Object.keys(employee).length > 0 ? "تعديل موظف " : " اضافة موظف"}
        handleClose={handleClose}
      />
      <Box>
        <Input
          label={t("components_home_employess-popup_employee-modification.اسم_الموظف")}
          value={data.name}
          handleChange={handleInputChange}
          placeholder={t("components_home_employess-popup_employee-modification.ادخل_اسم_الموظف")}
          type="text"
          disabled={false}
          name="name"
          customStyle={{ width: "100%" }}
        />
        {errors?.name && <ErrorMsg message={errors?.name} />}
      </Box>
      <Box>
        <Input
          label={t("components_home_employess-popup_employee-modification.رقم_الجوال")}
          value={data.phone}
          handleChange={handleInputChange}
          placeholder={t("components_home_employess-popup_employee-modification.ادخل_رقم_الجوال")}
          type="phone"
          disabled={false}
          startIcon="/images/icons/phone.svg"
          // endIcon=""
          name="phone"
          customStyle={{ width: "100%" }}
        />
        {errors?.phone && <ErrorMsg message={errors?.phone} />}
      </Box>
      <Box>
        <Input
          label={t("components_home_employess-popup_employee-modification.رقم_الهوية")}
          value={data.identityNumber}
          handleChange={handleInputChange}
          placeholder={t("components_home_employess-popup_employee-modification.ادخل_رقم_الهوية")}
          type="text"
          disabled={source == "EDIT" ? true : false}
          startIcon="/images/icons/nid.svg"
          name="identityNumber"
          customStyle={{ width: "100%" }}
          endIcon={<Typography></Typography>}
        />
        {errors?.identityNumber && (
          <ErrorMsg message={errors?.identityNumber} />
        )}
      </Box>
      <Box>
        <Input
          label={t("components_home_employess-popup_employee-modification.القسم_اختياري")}
          // placeholder={departments?.data ? t("components_home_employess-popup_employee-modification.حدد_القسم") : t("components_home_employess-popup_employee-modification.لا_يوجد_اقسام")}
          type="selectbox"
          valuesOption={
            Object.keys(employee).length > 0
              ? availableDepartments?.data
              : departments?.data
          }
          handleChange={handleInputChange}
          value={data?.department}
          name="department"
          customStyle={{ width: "100%" }}
        />
      </Box>
      <Box>
        <Input
          // multiple={true}
          label={t("components_home_employess-popup_employee-modification.حدد_المسمي_الوظيفي")}
          // placeholder={t("components_home_employess-popup_employee-modification.المسمي_الوظيفي")}
          // placeholder={
          //   availableRoles?.data ? t("components_home_employess-popup_employee-modification.المسمي_الوظيفي") : t("components_home_employess-popup_employee-modification.لا_يوجد_مسمي_الوظيفي")
          // }
          type="selectbox"
          valuesOption={availableRoles?.data}
          handleChange={handleInputChange}
          value={data?.permissions}
          // value={data?.availableRoles}
          name="permissions"
          customStyle={{ width: "100%" }}
          // shrink={source == "EDIT" && true}
        />
        {errors?.permissions && <ErrorMsg message={errors?.permissions} />}
      </Box>
      <Box>
        <Input
          label="كلمة المرور "
          value={data?.password ? data?.password : ""}
          handleChange={handleInputChange}
          placeholder={t("components_home_employess-popup_employee-modification.ادخل_كلمة_المرور")}
          type="password"
          disabled={false}
          startIcon="/images/icons/lock.svg"
          name="password"
          customStyle={{ width: "100%" }}
        />
        {errors?.password && <ErrorMsg message={errors?.password} />}
      </Box>
      <Box>
        <Input
          label=" اعادة تأكيد كلمة المرور "
          value={data?.confirmPassword ? data?.confirmPassword : ""}
          handleChange={handleInputChange}
          placeholder=" اعادة تأكيد كلمة المرور "
          type="password"
          disabled={false}
          startIcon="/images/icons/lock.svg"
          name="confirmPassword"
          customStyle={{ width: "100%" }}
        />
        {errors?.confirmPassword && (
          <ErrorMsg message={errors?.confirmPassword} />
        )}
      </Box>
      {errors?.minMatch && <ErrorMsg message={errors?.minMatch} />}
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
          text={Object.keys(employee).length > 0 ? t("components_home_employess-popup_employee-modification.تحديث") : t("components_home_employess-popup_employee-modification.اضافة")}
        />
      </Box>
      <CustomSnackbar
        type={alert.type}
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alert.msg}
      />{" "}
    </Box>
  );
}
