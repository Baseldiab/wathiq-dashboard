import { useTranslation } from "next-i18next";
import { Box, Menu, Typography } from "@mui/material";
import React from "react";
import Button from "@/components/button";

export default function FilterMenu({
  anchorEl,
  menuOpen,
  handleCloseMenu,
  title,
  onCloseIconClick,
  handleSubmitFilter,
  handleResetData,
  children,
}) {
    const { t } = useTranslation();
  return (
    <Menu
      sx={{
        "& .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPopover-paper.MuiMenu-paper":
          {
            mt:1,
            width: "300px",
            padding: "20px",
            border: "1px solid #F0F0F0",
            borderRadius: "16px",
            boxShadow: "0px 4px 20px 0px #ACACAC33",
          },
      }}
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleCloseMenu}
    >
      <Box
        sx={{
          // mt: 3,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "start",
              gap: "8px",
            }}
          >
            <img
              width="24px"
              height="24px"
              src="/images/icons/filter.svg"
              alt="icon"
              onClick={handleResetData}
            />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.9rem",
                display: "inline",
              }}
            >
              {title||t("components_filter-menu_index.تصفية")}
            </Typography>
          </Box>
          <img
            src="/images/icons/close-x.svg"
            style={{ cursor: "pointer" }}
            alt="close"
            onClick={onCloseIconClick || handleCloseMenu}
          />
        </Box>

        {/* Content  */}
        <Box>{children}</Box>

        {/* Footer  */}
        <Box sx={{ display: "flex", gap: "24px" }}>
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
              // p: "16px",
              // height: "2.5rem",
            }}
            handleClick={handleResetData}
            text={t("components_filter-menu_index.الغاء")}
            // type="close"
          />
          <Button
            customeStyle={{ width: "100%",}}
            handleClick={handleSubmitFilter}
            text={t("components_filter-menu_index.تصفيه")}
          />
        </Box>
      </Box>
    </Menu>
  );
}
