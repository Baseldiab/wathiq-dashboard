import { useTranslation } from "next-i18next";
import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

const FileUpload = ({
  name,
  label,
  value = [],
  accept,
  formik,
  handleFileChange,
  error,
  multi,
  isEditing,
}) => {
  const [progress, setProgress] = useState({});
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  // نثبّت الـ object URLs بدل ما تتولد في كل رندر
  const objectUrlsRef = useRef(new Map());
  const getFileUrl = (file) => {
    if (typeof file === "string") return file;
    if (!objectUrlsRef.current.has(file)) {
      objectUrlsRef.current.set(file, URL.createObjectURL(file));
    }
    return objectUrlsRef.current.get(file);
  };

  // تنظيف كل الـ URLs عند التفكيك
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);
  const cleanupRemovedUrls = (files) => {
    for (const [f, url] of objectUrlsRef.current.entries()) {
      if (!files.includes(f)) {
        URL.revokeObjectURL(url);
        objectUrlsRef.current.delete(f);
      }
    }
  };
  const handleClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const simulateUpload = (file) => {
    let uploadProgress = 0;
    const interval = setInterval(() => {
      uploadProgress += 10;
      setProgress((prev) => ({ ...prev, [file.name]: uploadProgress }));
      if (uploadProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 500);
      }
    }, 300);
  };

  const handleDelete = (fileName) => {
    if (!isEditing) return;
    const updatedFiles = value.filter((file) =>
      typeof file === "string" ? file !== fileName : file.name !== fileName
    );
    formik.setFieldValue(name, updatedFiles);
    setProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const handleFileSelection = (event) => {
    if (!isEditing) return;
    const files = Array.from(event.target.files);
    files.forEach((file) => simulateUpload(file));
    handleFileChange(event);
    event.target.value = null;
  };

  return (
    <Box
      p={2}
      border={1}
      borderRadius={3}
      borderColor="grey.300"
      sx={{ border: "1px dashed grey" }}
    >
      {isEditing && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            padding: 2,
            borderRadius: 2,
          }}
          onClick={handleClick}
        >
          <UploadOutlinedIcon sx={{ ml: 0.5, color: "green" }} />
          <Typography>
            {t("components_file_file-upload.انقر_للتحميل")}
          </Typography>
          <input
            type="file"
            multiple={multi}
            hidden
            ref={fileInputRef}
            onChange={handleFileSelection}
            accept={accept || "image/*,video/*"}
          />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
      <Box mt={2} display="flex" gap={3} flexWrap="wrap">
        {value.map((file, index) => {
          const isFileObject = typeof file !== "string";
          const fileUrl = isFileObject ? URL.createObjectURL(file) : file;
          const isImage = /\.(jpeg|jpg|png|gif|bmp|svg)$/i.test(fileUrl);
          const isVideo = /\.(mp4|webm|ogg)$/i.test(fileUrl);

          return (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                // border: "1px dashed grey",
                p: 1,
                // borderRadius: 3,
              }}
            >
              {isEditing && (
                <IconButton
                  onClick={() => handleDelete(isFileObject ? file.name : file)}
                  // color="error"
                  sx={{
                    color: "#FFFF",
                    mb: 1,
                    backgroundColor: "rgba(221, 56, 56, 0.7)",
                    "&:hover": {
                      backgroundColor: "rgba(214, 128, 128, 0.7)",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
              {isImage ? (
                <Box
                  component="img"
                  src={fileUrl}
                  alt={isFileObject ? file.name : "uploaded file"}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              ) : isVideo ? (
                <Box
                  component="video"
                  src={fileUrl}
                  preload="metadata"
                  onLoadedMetadata={(e) => e.currentTarget.pause()}
                  controls
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              ) : null}
              {file?.type?.startsWith("image") ||
              file?.type?.startsWith("video") ? (
                <Box
                  component={file?.type?.startsWith("image") ? "img" : "video"}
                  src={getFileUrl(file)}
                  controls={file.type.startsWith("video")}
                  alt={file.name}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open(URL.createObjectURL(file), "_blank")
                  }
                />
              ) : (
                <Typography variant="body2" sx={{ mx: 2 }}>
                  {file.name}
                </Typography>
              )}
              {isEditing &&
                isFileObject &&
                progress[file.name] !== undefined && (
                  <Box sx={{ width: "100%", mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress[file.name]}
                      sx={{
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "green",
                        },
                      }}
                    />
                  </Box>
                )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default FileUpload;
