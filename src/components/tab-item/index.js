import constants from "@/services/constants";
import { Typography } from "@mui/material";
import React from "react";

export default function TabItem({
  item,
  selectedItem,
  handleItemChange,
  flag,
}) {
  return (
    <>
      <Typography
        sx={{
          background:
            item.id === selectedItem ? constants.colors.light_blue : "#FFFFFF",
          borderRadius: "6px",
          padding: "12px 16px",
          color:
            item.id === selectedItem ? constants.colors.secondary : "#202726",
          cursor: "pointer",
          fontWeight: item.id === selectedItem ? 700 : 400,
        }}
        onClick={() =>
          flag
            ? handleItemChange(item.id, item.text)
            : handleItemChange(item.id)
        }
        key={item.id}
      >
        {item.text}
      </Typography>
    </>
  );
}
