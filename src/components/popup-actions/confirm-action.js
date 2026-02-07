import { useTranslation } from "next-i18next";
import React from "react";
import { styles } from "../globalStyle";
import { Box, Typography } from "@mui/material";
import CustomButton from "../button";
import PopupTitle from "../popup-title";

export default function ConfirmAction({
  title,
  desc,
  handleClose,
  handleClick,
  btnTxt,
  danger,
}) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        ...styles.popupContainer,
      }}
    >
      <PopupTitle title={title} handleClose={handleClose} />
      <Typography
        sx={{
          fontSize: "1rem",
          color: "#6F6F6F",
          // fontWeight: 600,
          textAlign: "center",
        }}
      >
        {desc}
      </Typography>
      <Box
        sx={{
          display: "flex",
          mt: 2,
          justifyContent: "space-between",
          gap: "10px",
          width: "100%",
        }}
      >
        {danger && (
          <CustomButton
            customeStyle={{
              width: "50%",
            }}
            handleClick={handleClose}
            text={t("components_popup-actions_confirm-action.عودة")}
            // type="close"
          />
        )}
        <CustomButton
          customeStyle={{
            width: danger ? "50%" : "100%",
            ...(danger
              ? {
                  background: "#E34935",
                  color: "#fff",
                  fontWeight: 700,
                  border: "1px solid #D6D9E1",
                  "&:hover": {
                    background: "#E34935",
                    color: "#fff",
                    boxShadow: "none",
                  },
                }
              : {}),
          }}
          handleClick={handleClick}
          text={btnTxt}
        />
      </Box>
    </Box>
  );
}
