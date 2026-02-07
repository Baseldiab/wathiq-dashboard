import { useTranslation } from "next-i18next";
import React from "react";
import Box from "@mui/material/Box";

export default function Frame({
  number,
  type,
  state,
  usage = "brokingCard",
  size,
}) {
  const { t } = useTranslation();
  const dimensions =
    size === "small"
      ? { xs: "55px", md: "55px", lg: "55px" }
      : { xs: "50px", md: "65px", lg: "75px" };
  const palette =
    usage === "brokingCard"
      ? {
          numberColor:
            state === "in_progress"
              ? "var(--washed_black)"
              : state === "on_going"
              ? "var(--shrub_green)"
              : "",
          frameImage: "/icons/frame-grey.svg",
          timeUnitsColor: "var(--smoked_pearl)",
        }
      : usage === "auctionCard"
      ? {
          numberColor:
            state === "in_progress"
              ? "var(--white)"
              : state === "on_going"
              ? "var(--benzol_green)"
              : "",
          frameImage:
            state === "in_progress"
              ? "/icons/frame-grey.svg"
              : state === "on_going"
              ? "/icons/frame-dark-green.svg"
              : "",
          timeUnitsColor: "var(--white)",
        }
      : usage === "assetCard"
      ? {
          numberColor:
            state === "in_progress"
              ? "var(--empress_teal)"
              : state === "on_going"
              ? "var(--empress_teal)"
              : "",
          frameImage: "/icons/frame-dark-green.svg",
          timeUnitsColor: "var(--empress_teal)",
        }
      : "";
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: dimensions,
        height: dimensions,
      }}
    >
      <Box
        sx={{
          width: dimensions,
          height: dimensions,
          color: palette.numberColor,
          fontWeight: "700",
          background: `url(${palette.frameImage}) center / contain no-repeat`,
          // backgroundSize: "100% 100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mt: "4px",
            fontSize: {
              xs: size === "small" ? ".8rem" : "1rem",
              md: size === "small" ? ".8rem" : "1.1rem",
            },
          }}
        >
          {number}
        </Box>
      </Box>
      <Box
        sx={{
          fontSize: ".75rem",
          fontWeight: "700",
          color: palette.timeUnitsColor,
          mt: {
            xs: size === "small" ? "2px" : "4px",
            md: size === "small" ? "4px" : "8px",
          },
        }}
      >
        {type === "days"
          ? t("components_Frame_index.يوم")
          : type === "hours"
          ? t("components_Frame_index.ساعة")
          : type === "minutes"
          ? t("components_Frame_index.دقيقة")
          : t("components_Frame_index.ثانية")}
      </Box>
    </Box>
  );
}
