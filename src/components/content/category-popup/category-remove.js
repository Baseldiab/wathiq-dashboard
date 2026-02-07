import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
import { deleteQuestionCategory } from "@/Redux/slices/questionCategorySlice";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@/components/toastMsg/index.js";
import { styles } from "@/components/globalStyle";

export default function CategoryRemove({
  handleClose,
  question,
  setOpenAlert,
  setAlert,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { updateLoading, error } = useSelector(
    (state) => state.questionCategory
  );
  const [open, setOpen] = useState(false);

  const handleRemoveQuestionCategory = async () => {
    let response = await dispatch(deleteQuestionCategory(question._id));
  //   if (response?.meta?.requestStatus === "fulfilled") {
  //     handleClose();
  //   } else {
  //     setOpen(true);
  //   }
  // };
  if (response?.meta?.requestStatus === "fulfilled") {
    setAlert({
      msg: t("components_content_category-popup_category-remove.تم_الحذف_بنجاح"),
      type: "success",
    });
    setOpenAlert(true);
    handleClose();
  } else {
    setAlert({
      msg: t("components_content_category-popup_category-remove.حدث_خطأ_ما_يرجى"),
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
      <img src="/images/icons/trash.svg" width="72px" height="72px" />
      <Typography
        sx={{ fontSize: "1.3rem", color: "#161008", fontWeight: 700 }}
      >{t("components_content_category-popup_category-remove.حذف_القسم")}</Typography>
      <Typography sx={{ fontSize: "1rem", color: "#6F6F6F", fontWeight: 600 }}>{t("components_content_category-popup_category-remove.هل_أنت_متأكد_أنك")}</Typography>
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
          text={t("components_content_category-popup_category-remove.الغاء")}
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
          handleClick={handleRemoveQuestionCategory}
          type="remove"
          text={t("components_content_category-popup_category-remove.حذف")}
        />
      </Box>
      {/* <Snackbar open={open} setOpen={setOpen} message={error} /> */}
    </Box>
  );
}
