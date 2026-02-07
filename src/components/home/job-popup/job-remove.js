import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
import { deleteRole } from "@/Redux/slices/roleSlice";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@/components/toastMsg/index.js";
import { styles } from "@/components/globalStyle";
import PopupTitle from "@/components/popup-title";

export default function JobRemove({ handleClose, job }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { updateLoading, error } = useSelector((state) => state.role);
  const [open, setOpen] = useState(false);

  const handleRemoveJob = async () => {
    let response = await dispatch(deleteRole(job._id));
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
      <PopupTitle title={t("components_home_job-popup_job-remove.حذف_مسمي_وظيفي")} handleClose={handleClose} />
      <img
        src="/images/icons/trash-icon.svg"
        width="72px"
        height="72px"
        style={{ marginTop: "15px" }}
      />

      <Typography sx={{ fontSize: "1rem", color: "#6F6F6F" }}>{t("components_home_job-popup_job-remove.هل_أنت_متأكد_أنك")}</Typography>
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
            width: "100%",
            ...styles.deleteBtn,
          }}
          disabled={updateLoading}
          handleClick={handleRemoveJob}
          // type="remove"
          text={t("components_home_job-popup_job-remove.حذف")}
        />
      </Box>
      <Snackbar open={open} setOpen={setOpen} message={error} />
    </Box>
  );
}
