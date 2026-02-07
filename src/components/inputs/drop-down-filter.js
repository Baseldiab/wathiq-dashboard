import { useTranslation } from "next-i18next";
import { Box } from "@mui/material";
import React from "react";

export default function FilterDropDown({ filteredNames, handleClick }) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        borderRadius: "8px",
        maxHeight: "120px",
        overflowY: "auto",
        background: "#FFFFFF",
      }}
    >
      <ul style={{ margin: 0, padding: "8px" }}>
        {filteredNames.length > 0 ? (
          filteredNames.map((name, index) => (
            <li
              key={index}
              style={{
                padding: "8px",
                cursor: "pointer",
                color: "#999",
              }}
              onClick={() => handleClick(name)}
            >
              {name}
            </li>
          ))
        ) : (
          <li style={{ padding: "8px", color: "#999" }}>{t("components_inputs_drop-down-filter.لا_توجد_نتيجه")}</li>
        )}
      </ul>
    </Box>
  );
}
