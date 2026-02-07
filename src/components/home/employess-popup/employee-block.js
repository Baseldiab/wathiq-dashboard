import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@/components/toastMsg/index.js";
import { styles } from "@/components/globalStyle";
import PopupTitle from "@/components/popup-title";
import { blockSelectedUser } from "@/Redux/slices/userSlice";
import { getEmployees } from "@/Redux/slices/employeeSlice";
import { buildQueryParams } from "@/services/utils";

export default function BlockUser({
  handleClosePopup,
  handleClose,
  employee,
  filterData,
  page,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { updateLoading, error } = useSelector((state) => state.role);
  const [open, setOpen] = useState(false);

  const handleBlockUser = async () => {
    let response = await dispatch(
      blockSelectedUser({
        data: { reason: employee?.name },
        id: employee?.user,
      })
    );
    dispatch(getEmployees(buildQueryParams({ ...filterData, page })));
    if (response?.meta?.requestStatus === "fulfilled") handleClose();
  };

  return (
    <Box
      sx={{
        ...styles.popupContainer,
        width: "100%",
        // margin: "0 auto",
        // m: 2,
      }}
    >
      <PopupTitle title={t("components_home_employess-popup_employee-block.حظر_موظف")} handleClose={handleClosePopup} />

      <Typography sx={{ fontSize: "1.3rem", color: "#6F6F6F", m: 2 }}>{t("components_home_employess-popup_employee-block.هل_أنت_متأكد_أنك")}</Typography>
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
          handleClick={handleBlockUser}
          // type="remove"
          text={t("components_home_employess-popup_employee-block.حظر")}
        />
      </Box>
      <Snackbar open={open} setOpen={setOpen} message={error} />
    </Box>
  );
}
