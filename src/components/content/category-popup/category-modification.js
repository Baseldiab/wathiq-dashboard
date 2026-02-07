import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
import Input from "@/components/inputs";
import ErrorMsg from "@/components/error-message/index";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createQuestionCategory,
  updateQuestionCategory,
} from "@/Redux/slices/questionCategorySlice";
import Snackbar from "@/components/toastMsg/index.js";
import { isEmptyObject } from "@/services/utils";
import PopupTitle from "@/components/popup-title";


export default function QuestionCategoryModification({
  category = {},
  handleClose,
  source,
  setOpenAlert,
  setAlert,
}) {
  const { t } = useTranslation();
  const messages = {
  name: " الاسم اجباري",
};

  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: "",
  });

  const [errors, setErrors] = useState({});
  const { updateLoading, error } = useSelector(
    (state) => state.questionCategory
  );

  useEffect(() => {
    if (Object.keys(category).length > 0 && source === "EDIT") {
      setData({
        name: category?.name,
      });
    } else if (source === "ADD") {
      setData({
        name: "",
      });
    }
    return () => {
      setData({
        name: "",
      });
      setErrors({});
    };
  }, [category, source]);

  const handleInputChange = (value, name) => {
    let val = value;
    setErrors({ ...errors, [name]: "" });
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
        createQuestionCategory({
          name: {
            ar: data.name,
          },
        })
      );
    } else if (source == "EDIT") {
      response = await dispatch(
        updateQuestionCategory({
          data: {
            name: {
              ar: data.name,
            },
          },
          id: category?._id,
        })
      );
    }

    if (response?.meta?.requestStatus === "fulfilled") {
      setAlert({
        msg: source === "ADD" ? t("components_content_category-popup_category-modification.تمت_الإضافة_بنجاح") : t("components_content_category-popup_category-modification.تم_التعديل_بنجاح"),
        type: "success",
      });
      setOpenAlert(true);

      handleClose();
    } else {
      setAlert({
        msg: t("components_content_category-popup_category-modification.حدث_خطأ_ما_يرجى"),
        type: "error",
      });
      setOpenAlert(true);
    }
    setOpenAlert(true);
  };
  if (!category) return;

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
          Object.keys(category).length > 0 ? "تعديل  القسم " : " اضافة  قسم"
        }
        handleClose={handleClose}
      />

      <Box>
        <Input
          label={t("components_content_category-popup_category-modification.إسم_القسم")}
          value={data?.name}
          handleChange={handleInputChange}
          placeholder={t("components_content_category-popup_category-modification.إسم_القسم")}
          type="text"
          disabled={false}
          name="name"
          customStyle={{ width: "100%" }}
        />
        {errors?.name && <ErrorMsg message={errors?.name} />}
      </Box>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        {/* <Button
          customeStyle={{
            width: "50%",
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
          handleClick={handleClose}
          text={t("components_content_category-popup_category-modification.الغاء")}
          type="close"
        /> */}
        <Button
          customeStyle={{ width: "100%" }}
          handleClick={handleSubmit}
          disabled={updateLoading}
          text={Object.keys(category).length > 0 ? t("components_content_category-popup_category-modification.تحديث") : t("components_content_category-popup_category-modification.اضافة")}
        />
      </Box>
      {/* <Snackbar
        open={OpenAlert}
        setOpen={setOpenAlert}
        message={alert.msg}
        type={alert.type}
      /> */}
    </Box>
  );
}
