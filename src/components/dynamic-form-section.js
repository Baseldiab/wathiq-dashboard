import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { Grid, Typography, Backdrop, Box } from "@mui/material";
import Input from "./inputs";
import CustomButton from "./button";
import PopupTitle from "./popup-title";
export default function DynamicFormSection({
  title,
  fields,
  formik,
  name,
  BtnClicked,
  type,
  disabled,
}) {
  const { t } = useTranslation();
  const [sectionFields, setSectionFields] = useState(fields);
  const [openDialog, setOpenDialog] = useState(false);
  const [newField, setNewField] = useState("");
  const [errormsg, setError] = useState("");
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setNewField("");
    setOpenDialog(false);
  };
  useEffect(() => {
    if (fields?.length) {
      setSectionFields(fields);
    }
  }, [fields]);
  useEffect(() => {
    if (sectionFields?.length) {
      sectionFields?.forEach((field) => {
        const fieldName = type !== "edit" ? field : field?.title;
        let fieldValue = field?.description ?? "";
        if (!formik.values?.[name]?.[fieldName]) {
          formik.setFieldValue(`${name}.${fieldName}`, fieldValue);
        }
      });
    }
  }, [sectionFields, name, type]);
  const handleAddField = () => {
    console.log("fields", fields);

    if (newField.trim() === "") {
      setError("يرجى إدخال الإسم ");
      return;
    }

    // Determine the structure based on `type`
    const newFieldData =
      type !== "edit" ? newField : { title: newField, description: "" };
    console.log("fields", newField);

    // Update the section fields
    // setSectionFields([...sectionFields, newFieldData]);
    setSectionFields([...(sectionFields || []), newFieldData]);

    // Ensure Formik recognizes the new field
    const fieldName = type !== "edit" ? newField : newFieldData.title;
    formik.setFieldValue(`${name}.${fieldName}`, "");

    setNewField("");
    setError("");
    handleCloseDialog();
  };
  useEffect(() => {
    if (BtnClicked) {
      sectionFields?.forEach((field) => {
        const fieldName = type !== "edit" ? field : field?.title;
        formik.setFieldTouched(`${name}.${fieldName}`, true, false);
      });
    }
  }, [BtnClicked, sectionFields, name, type]);

  const allowedTitles = [
    t("components_dynamic-form-section.المعلومات_الخاصة_بالاتصال"),
    t("components_dynamic-form-section.الحدود_والمساحة"),
    t("components_dynamic-form-section.الخدمات_والمرافق_العامة"),
    t("components_dynamic-form-section.حقوق_الملكية"),
  ];

  return (
    <Grid
      container
      sx={{
        border: "1px solid #D6D9E1",
        borderRadius: "12px",
        p: "16px",
        mb: 3,
        backgroundColor: "#fff",
      }}
      spacing={2}
      width={"99.99%"}
      height={"100%"}
    >
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1A1A1A" }}>
          {title == "contactInfo"
            ? allowedTitles[0]
            : title === "areaInfo"
            ? allowedTitles[1]
            : title === "generalInfo"
            ? allowedTitles[2]
            : title === "paperInfo"
            ? allowedTitles[3]
            : title}
        </Typography>
      </Grid>
      {sectionFields?.map((field, index) => {
        const fieldName = type !== "edit" ? field : field?.title;
        // console.log("FIEL", formik.values?.[name]);

        return (
          <Grid
            item
            xs={12}
            sm={sectionFields?.length <= 2 ? 6 : index === 0 ? 12 : 4}
            key={index}
          >
            <Input
              label={fieldName}
              customStyle={{ width: "100%" }}
              inputStyle={{
                backgroundColor: type == "edit" && disabled && "#ffff",
              }}
              name={`${name}.${fieldName}`}
              placeholder={fieldName}
              // value={formik.values[name]?.[fieldName] ?? field?.description}
              value={formik.values?.[name]?.[fieldName] ?? ""}
              onChange={(event) =>
                formik.setFieldValue(`${name}.${fieldName}`, event.target.value)
              }
              error={
                formik.touched[name]?.[fieldName] &&
                formik.errors[name]?.[fieldName]
              }
              handleBlur={(e) => {
                formik.handleBlur(e);
                formik.setFieldTouched(`${name}.${fieldName}`, true, false);
              }}
              disabled={type == "edit" && disabled}
            />
          </Grid>
        );
      })}

      {/* Add New Button */}
      <Grid item xs={12}>
        <CustomButton
          // startIcon={<AddCircleOutlineIcon sx={{ ml: 1 }} />}
          customeStyle={{
            // borderRadius: "8px",
            color: "#006D5B",
            border: !disabled && " 1px solid #006D5B",
            bgcolor: "transparent",
            "&:hover": {
              border: " 1px solid #006D5B",
              bgcolor: "transparent",
              boxShadow: "none",
            },
          }}
          handleClick={handleOpenDialog}
          disabled={type == "edit" && disabled}
          text=" إضافة عنصر جديد"
        />
      </Grid>
      <Backdrop
        open={openDialog}
        onClick={handleCloseDialog}
        sx={{ zIndex: "99" }}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            maxHeight: "85%",
            overflow: "auto",
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: 3,
            width: {
              xs: "90%",
              sm: "80%",
              md: "60%",
              lg: "45%",
              xl: "30%",
            },
            p: 3,
          }}
        >
          <PopupTitle
            title=" إضافة عنصر جديد"
            handleClose={handleCloseDialog}
          />
          <Input
            customStyle={{
              width: "100%",
              mt: 1,
            }}
            label="إسم العنصر*  "
            placeholder={t("components_dynamic-form-section.الإسم_هنا")}
            value={newField}
            onChange={(e) => {
              setNewField(e.target.value);
              if (errormsg) setError("");
            }}
            error={errormsg}
          />

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              gap: "24px",
              width: "100%",
            }}
          >
            <CustomButton
              customeStyle={{
                width: "100%",
              }}
              handleClick={handleAddField}
              text={t("components_dynamic-form-section.إضافة")}
            />
          </Box>
        </Box>
      </Backdrop>
    </Grid>
  );
}
