import { useTranslation } from "next-i18next";
import constants from "@/services/constants";
import { hasRole } from "@/services/utils";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useRef } from "react";
import CustomButton from "../button";

export default function ProfileImg({
  src,
  defultSrc,
  role,
  handleFileChange,
  noUpdate,
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const handleIconClick = () => {
    fileInputRef.current.click();
  };
  return (
    <Box sx={{ flex: 1, display: "flex", position: "relative" }}>
      <Box
        sx={{
          width: "96px",
          height: "96px",
          borderRadius: "50%",
          border: "6px solid #D6D9E1",
          overflow: "hidden",
        }}
      >
        <img
          style={{ height: "100%", width: "100%" }}
          src={src ? src : defultSrc}
        />
      </Box>
      {!noUpdate && (
        <>
          {hasRole(role) && (
            <>
              {/* <Image
                onClick={handleIconClick}
                width="40"
                height="40"
                style={{
                  zIndex: 10,
                  position: "absolute",
                  right: "70px",
                  bottom: 0,
                  cursor: "pointer",
                }}
                src="/images/edit.svg"
              /> */}
              <CustomButton
                handleClick={handleIconClick}
                transparentBtn
                text={t("components_image-box_profile-img.تعديل")}
                customeStyle={{ color: constants.colors.main, fontWeight: 700 }}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
}
