import { useTranslation } from "next-i18next";
import * as React from "react";
import { Typography, Box } from "@mui/material";
import Button from "@/components/button";
import CustomEditor from "@/components/inputs/ckEditor.js";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getPolicy, updatePolicy } from "@/Redux/slices/policySlice";
import Loader from "@/components/loader";
import Snackbar from "@/components/toastMsg/index.js";
import { styles } from "../globalStyle";

export default function Policies({}) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({});

  const { policy, loading } = useSelector((state) => state.policy);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!policy) dispatch(getPolicy());
    else setValue(policy?.data?.content);
  }, [policy, dispatch]);

  const handleInputChange = (value) => {
    if (value.replace(/<[^>]+>/g, "").trim() === "") setValue("");
    else setValue(value);
  };

  const handleResetPolicy = () => {
    setValue(policy?.data?.content);
  };

  const handleUpdatePolicy = async () => {
    let response = await dispatch(
      updatePolicy({
        content: value,
      })
    );

    if (response?.meta?.requestStatus === "fulfilled") {
      setAlert({ msg: response?.payload?.message, type: "success" });
      setOpen(true);
    } else {
      setAlert({ msg: response?.payload, type: "error" });
      setOpen(true);
    }
  };

  if (loading) return <Loader open={true} />;

  return (
    <Box
      sx={{
        ...styles.boxData,
        height: "800px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          ...styles.dataSpaceBetween,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
            // flex: 1,
            fontWeight: 700,
            color: "#202726",
            flex: 1,
            display: "flex",
          }}
        >{t("components_content_policies.الشروط_و_الاحكام")}</Typography>

        <Box
          sx={{
            flex: 3,
            flex: "none",
            display: "flex",
            gap: "12px",
            // width: "75%",
          }}
        >
          <Button
            customeStyle={{
              background: "transparent",
              color: "#6F6F6F",
              fontWeight: 700,
              border: "1px solid #D6D9E1",
              "&:hover": {
                background: "transparent",
                color: "#6F6F6F",
                boxShadow: "none",
              },
              // p: "16px",
              // height: "2.5rem",
            }}
            handleClick={handleResetPolicy}
            text={t("components_content_policies.الغاء")}
            type="close"
          />
          <Button
            handleClick={handleUpdatePolicy}
            // customeStyle={{ p: "16px", height: "2.5rem" }}
            text={t("components_content_policies.حفظ_التعديلات")}
          />
        </Box>
      </Box>
      <Box>
        <CustomEditor
          handleChange={handleInputChange}
          name={"policy"}
          value={value}
        />
      </Box>
      <Snackbar
        type={alert.type}
        open={open}
        setOpen={setOpen}
        message={alert.msg}
      />
    </Box>
  );
}
