import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
import { deleteQuestion } from "@/Redux/slices/questionSlice";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@/components/toastMsg/index.js";
import { styles } from "@/components/globalStyle";

export default function QuestionRemove({
  handleClose,
  question,
  setOpenAlert,
  setAlert,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { updateLoading, error } = useSelector((state) => state.question);
  const [open, setOpen] = useState(false);

  const handleRemoveQuestion = async () => {
    let response = await dispatch(deleteQuestion(question._id));
    //   if (response?.meta?.requestStatus === "fulfilled") {
    //     handleClose();
    //   } else {
    //     setOpen(true);
    //   }
    // };
    if (response?.meta?.requestStatus === "fulfilled") {
      setAlert({
        msg: t("components_content_question-popup_question-remove.تم_الحذف_بنجاح"),
        type: "success",
      });
      setOpenAlert(true);
      handleClose();
    } else {
      setAlert({
        msg: t("components_content_question-popup_question-remove.حدث_خطأ_ما_يرجى"),
        type: "error",
      });
      setOpenAlert(true);
    }
    setOpenAlert(true);
  };

  return (
    <Box
      sx={{
        ...styles.popupContainer,
      }}
    >
      <img
        src="/images/icons/trash.svg"
        width="72px"
        height="72px"
        alt="trash"
      />
      <Typography
        sx={{ fontSize: "1.3rem", color: "#161008", fontWeight: 700 }}
      >{t("components_content_question-popup_question-remove.حذف_السؤال")}</Typography>
      <Typography sx={{ fontSize: "1rem", color: "#6F6F6F", fontWeight: 600 }}>{t("components_content_question-popup_question-remove.هل_أنت_متأكد_أنك")}</Typography>
      <Box
        sx={{
          display: "flex",
          mt: 2,
          justifyContent: "space-between",
          gap: "24px",
          width: "100%",
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
          text={t("components_content_question-popup_question-remove.الغاء")}
          type="close"
        />
        <Button
          disabled={updateLoading}
          customeStyle={{
            width: "50%",
            background: "#D32F2F",
            color: "#fff",
            fontWeight: 700,
            border: "1px solid #D6D9E1",
            "&:hover": {
              background: "#D32F2F",
              color: "#fff",
              boxShadow: "none",
            },
          }}
          handleClick={handleRemoveQuestion}
          type="remove"
          text={t("components_content_question-popup_question-remove.حذف")}
        />
      </Box>
      <Snackbar open={open} setOpen={setOpen} message={error} />
    </Box>
  );
}
