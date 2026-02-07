import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
import { deleteDepartment } from "@/Redux/slices/departmentSlice";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@/components/toastMsg/index.js";
import { styles } from "@/components/globalStyle";
import PopupTitle from "@/components/popup-title";

export default function SectionRemove({ handleClose, department }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { updateLoading, error } = useSelector((state) => state.department);
  const [open, setOpen] = useState(false);

  const handleRemoveDepartment = async () => {
    let response = await dispatch(deleteDepartment(department._id));
    if (response?.meta?.requestStatus === "fulfilled") {
      handleClose();
    } else {
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        ...styles.popupContainer,
      }}
    >
      <PopupTitle title=" حذف القسم" handleClose={handleClose} />

      <img src="/images/icons/trash-icon.svg" width="72px" height="72px" />

      <Typography sx={{ fontSize: "1rem", color: "#6F6F6F", mt: 3 }}>{t("components_home_section-popup_section-remove.هل_أنت_متأكد_أنك")}</Typography>
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
          disabled={updateLoading}
          customeStyle={{
            width: "100%",
            ...styles.deleteBtn,
          }}
          handleClick={handleRemoveDepartment}
          // type="remove"
          text={t("components_home_section-popup_section-remove.حذف")}
        />
      </Box>
      <Snackbar open={open} setOpen={setOpen} message={error} />
    </Box>
  );
}
