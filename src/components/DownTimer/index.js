import { useTranslation } from "next-i18next";
import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import Frame from "../Frame";

function DownTimer({ currentTimer, setCurrentTimer, state, usage, size }) {
  const { t } = useTranslation();
  useEffect(() => {
    if (state !== "completed") {
      const interval = setInterval(() => {
        setCurrentTimer((prevTimer) => {
          // Set default values if prevTimer is null or undefined
          let {
            seconds = 0,
            minutes = 0,
            hours = 0,
            days = 0,
          } = prevTimer || {};

          // Decrement seconds
          if (seconds > 0) {
            seconds -= 1;
          } else if (minutes > 0) {
            seconds = 59;
            minutes -= 1;
          } else if (hours > 0) {
            seconds = 59;
            minutes = 59;
            hours -= 1;
          } else if (days > 0) {
            seconds = 59;
            minutes = 59;
            hours = 23;
            days -= 1;
          } else {
            clearInterval(interval); // Stop the timer
            // window.location.reload(); // Refresh the page when timer hits zero
          }

          return { seconds, minutes, hours, days };
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [state, setCurrentTimer]); // Add `state` and `setCurrentTimer` as dependencies

  return (
    <>
      {state !== "completed" && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: "6px", sm: "20px" },
            flexGrow: "1",
            maxWidth: size === "small" ? "220px" : "1000px",
          }}
        >
          {state === "on_going" && usage !== "brokingCard" && (
            <Box
              component="img"
              src="/icons/running-full.svg"
              sx={{
                width: "40px",
              }}
            />
          )}
          {state === "in_progress" && usage !== "brokingCard" && (
            <Box
              component="img"
              src="/icons/starts-after.svg"
              sx={{
                width: { xs: "40px", sm: "70px" },
              }}
            />
          )}
          <Box
            sx={{
              flexGrow: "1",
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "420px",
            }}
          >
            {currentTimer &&
              Object.entries(currentTimer).map(([key, value]) => (
                <Frame
                  key={key}
                  type={key}
                  number={value}
                  state={state}
                  usage={usage}
                  size={size}
                />
              ))}
          </Box>
        </Box>
      )}
      {state === "completed" && usage !== "brokingCard" && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            color: "var(--white)",
            bgcolor: "#D32F2FCC",
            borderRadius: "8px",
            p: "16px",
          }}
        >
          <span>{t("components_DownTimer_index.إنتهي_المزاد")}</span>
          <img src="/icons/finished-white.svg" height="40px" />
        </Box>
      )}
    </>
  );
}

export default DownTimer;
