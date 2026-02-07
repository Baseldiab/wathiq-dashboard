import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import constants from "@/services/constants";

const DetailBox = ({
  title,
  value,
  noBorder,
  withImg,
  img,
  noSpacing,
  customStyle,
  customImgStyle,
}) => {
  return (
    <Box
      sx={{
        padding: noSpacing ? "0px 24px 12px 24px" : "12px 24px",
        my: noSpacing ? "0px" : { sm: 1, md: 3 },
        borderLeft: {
          sm: noBorder ? "none" : "1px solid #EBEEF3",
        },
        // height:"100%"
        ...customStyle,
      }}
    >
      {withImg ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            style={{
              height: "72px",
              width: "72px",
              borderRadius: "8px",
              display: "",
              ...customImgStyle,
            }}
            src={img}
          />
          <Box sx={{}}>
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: constants.colors.grey,
                fontWeight: 500,
                ...customStyle,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontWeight: 700,
                color: constants.colors.dark_green,
                ...customStyle,
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: constants.colors.grey,
              fontWeight: 500,
              ...customStyle,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: constants.colors.dark_green,
              wordBreak: "break-word",
              ...customStyle,
            }}
          >
            {value}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default DetailBox;
