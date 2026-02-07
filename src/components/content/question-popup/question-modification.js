import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import { isEmptyObject } from "@/services/utils";
import Button from "@/components/button";
import Input from "@/components/inputs";
import ErrorMsg from "@/components/error-message/index";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createQuestion, updateQuestion } from "@/Redux/slices/questionSlice";
import Snackbar from "@/components/toastMsg/index.js";
import CustomEditor from "@/components/inputs/ckEditor.js";
import PopupTitle from "@/components/popup-title";



export default function QuestionModification({
  question = {},
  handleClose,
  source,
  setOpenAlert,
  setAlert,
}) {
  const { t } = useTranslation();
  const messages = {
  question: " السؤال اجباري",
  answer: " الاجابة اجباري",
  category: t("components_content_question-popup_question-modification.القسم_اجباري"),
};
  const dispatch = useDispatch();
  const [data, setData] = useState({
    question: "",
    answer: "",
    category: {},
  });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const { allQuestionCategories } = useSelector(
    (state) => state.questionCategory
  );

  const { updateLoading, error } = useSelector((state) => state.question);

  useEffect(() => {
    if (Object.keys(question).length > 0 && source === "EDIT") {
      setData({
        question: question?.question,
        answer: question?.answer,
        category: question?.category,
      });
    } else if (source === "ADD") {
      setData({
        question: "",
        answer: "",
        category: {},
      });
    }
    return () => {
      setData({
        question: "",
        answer: "",
        category: {},
      });
      setErrors({});
    };
  }, [question, source]);

  const handleInputChange = (value, name) => {
    let val = value;
    setErrors({ ...errors, [name]: "" });
    if (name === "answer" && value.replace(/<[^>]+>/g, "").trim() === "")
      val = "";

    if (name === "category") typeof val === "string" ? val.split(",") : val;
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
        createQuestion({
          question: {
            ar: data.question,
          },
          category: data.category?._id,
          answer: {
            ar: data.answer,
          },
        })
      );
    } else if (source == "EDIT") {
      response = await dispatch(
        updateQuestion({
          data: {
            question: {
              ar: data.question,
            },
            category: data.category?._id,
            answer: {
              ar: data.answer,
            },
          },
          id: question?._id,
        })
      );
    }
    if (response?.meta?.requestStatus === "fulfilled") {
      setAlert({
        msg: source === "ADD" ? t("components_content_question-popup_question-modification.تمت_الإضافة_بنجاح") : t("components_content_question-popup_question-modification.تم_التعديل_بنجاح"),
        type: "success",
      });
      setOpenAlert(true);

      handleClose();
    } else {
      setAlert({
        msg: t("components_content_question-popup_question-modification.حدث_خطأ_ما_يرجى"),
        type: "error",
      });
      setOpenAlert(true);
    }
    setOpenAlert(true);
  };
  if (!question) return;

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
          Object.keys(question).length > 0 ? "تعديل  سؤال " : " اضافة  سؤال"
        }
        handleClose={handleClose}
      />

      <Box>
        <Input
          label={t("components_content_question-popup_question-modification.سؤال")}
          value={data?.question}
          handleChange={handleInputChange}
          placeholder={t("components_content_question-popup_question-modification.سؤال")}
          type="text"
          disabled={false}
          name="question"
          customStyle={{ width: "100%" }}
        />
        {errors?.question && <ErrorMsg message={errors?.question} />}
      </Box>
      <Box>
        <Typography sx={{ color: "#000", my: 1 }}>{t("components_content_question-popup_question-modification.الاجابة")}</Typography>
        <CustomEditor
          handleChange={handleInputChange}
          name="answer"
          value={data?.answer}
        />
        {errors?.answer && (
          <Box sx={{ mt: 3 }}>
            <ErrorMsg message={errors?.answer} />
          </Box>
        )}
      </Box>
      <Box>
        <Input
          label={t("components_content_question-popup_question-modification.حدد_القسم")}
          placeholder={t("components_content_question-popup_question-modification.حدد_القسم")}
          type="selectbox"
          valuesOption={allQuestionCategories?.data}
          handleChange={handleInputChange}
          value={data?.category}
          name="category"
          customStyle={{ width: "100%" }}
        />
        {errors?.category && <ErrorMsg message={errors?.category} />}
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
          text={t("components_content_question-popup_question-modification.الغاء")}
          type="close"
        />
        <Button
          customeStyle={{ width: "50%" }}
          handleClick={handleSubmit}
          disabled={updateLoading}
          text={Object.keys(question).length > 0 ? t("components_content_question-popup_question-modification.تحديث") : t("components_content_question-popup_question-modification.اضافة")}
        />
      </Box>
      {/* <Snackbar open={OpenAlert} setOpen={setOpenAlert} message={alert?.msg} /> */}
    </Box>
  );
}
