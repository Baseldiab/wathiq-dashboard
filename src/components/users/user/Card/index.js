import { useTranslation } from "next-i18next";
import { setRequestStatusStyle, setStatusStyle } from "@/services/utils";
import { Box, Button, Card, IconButton, Typography } from "@mui/material";
import React from "react";

export default function Custom_Card({
  key,
  title,
  date,
  logo,
  description,
  checked,
  amount,
  status,
  onClick,
  type,
}) {
  const { t } = useTranslation();
  return (
    <Card
      key={key}
      sx={{
        p: 2,
        mb: 1,
        backgroundColor: checked ? " rgba(2, 57, 54, 0.05)" : "#ffff",
        border: "1px solid rgba(34, 201, 192, 0.05)",
        borderRadius: "16px",
        boxShadow: "none",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {type == "activity" && (
          <Box sx={{ width: 50, height: 50, ml: 2 }}>
            <img
              src={logo}
              alt="Activity Logo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
        )}
        <Box sx={{ flex: 1, ml: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" mt={0.5}>
            {date}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {description}
          </Typography>
        </Box>

        {type != "activity" && (
          <>
            <Box>
              <Typography
                color="#B12424"
                mb={2}
                fontWeight={900}
                fontSize={"16px"}
              >
                {amount}
              </Typography>
              <Typography
                sx={{
                  ...setStatusStyle(t("components_users_user_Card_index.نشط")),
                }}
              >{t("components_users_user_Card_index.ناجحة")}</Typography>
            </Box>
          </>
        )}
        {type == "activity" && (
          <IconButton sx={{ color: checked ? "#00DB81" : "grey" }}>
            ✓
          </IconButton>
        )}
      </Box>
    </Card>
  );
}
