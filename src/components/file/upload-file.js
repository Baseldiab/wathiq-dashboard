import React, { useRef } from "react";
import { Box, InputLabel, Typography } from "@mui/material";
import { styles } from "../inputs/style";
import constants from "@/services/constants";

export default function FileUpload({
  name,
  formik,
  label,
  accept,
  handleFileChange,
  value,
  type,
  error,
  multi,
}) {
  const fileInputRef = useRef(null);
  const fileValue = value ? value : formik.values[name];

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const isFileSelected =
    fileValue instanceof File ||
    (Array.isArray(fileValue) && fileValue.length) ||
    (fileValue && fileValue !== "");
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <InputLabel
        sx={{
          ...styles.label,
          position: "absolute",
          right: "14px",
          top: isFileSelected ? "-10px" : "50%",
          transform: isFileSelected ? "none" : "translateY(-50%)",
          fontSize: isFileSelected ? "0.7rem" : "0.9rem",
          fontWeight: "500",
          color: isFileSelected ? "rgba(0,0,0,0.87)" : "transparent",
          pointerEvents: "none",
          transition: "all 0.2s ease-in-out",
          backgroundColor: isFileSelected ? "#fff" : "transparent",
          px: 0.5,
          zIndex: "999",
        }}
        htmlFor={name}
      >
        {label}
      </InputLabel>

      <Box
        sx={{
          borderRadius: "12px",
          border: "1.5px solid #D6D9E1",
          padding: "16px 12px",
          gap: "8px",
          cursor: "pointer",
          bgcolor: "#FAFAFA",
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="/images/upload.svg"
            alt="Upload"
            style={{ cursor: "pointer" }}
          />
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#24262d",
              textDecoration: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "calc(100% - 30px)",
            }}
          >
            {fileValue instanceof File
              ? fileValue.name // Display file name when a single file is selected
              : Array.isArray(fileValue) && fileValue.length
              ? fileValue.map((file) => file.name).join(", ") // If multiple files, join their names
              : fileValue && fileValue !== "" // Handle case where fileValue is a non-empty string (URL or valid path)
              ? fileValue
              : label}
          </Typography>
        </Box>
      </Box>

      {/* Hidden file input */}
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        multiple={multi}
        style={{ display: "none" }}
        onChange={(event) => handleFileChange(event, name)}
      />

      {/* Error message */}
      {error && (
        <Box sx={{ color: "#d32f2f", fontSize: "0.75rem", m: 1 }}>{error}</Box>
      )}
    </Box>
  );
}
