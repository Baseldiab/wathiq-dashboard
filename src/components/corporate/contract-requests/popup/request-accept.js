import { useTranslation } from "next-i18next";
import ErrorMsg from "@/components/error-message";
// import { styles } from "@/components/globalStyle";
import Input from "@/components/inputs";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CustomButton from "@/components/button";
import { styles as globalStyles } from "@/components/globalStyle";
import { styles as localStyles } from "../../style";
import moment from "moment/moment";
import dayjs from "dayjs";
import PopupTitle from "@/components/popup-title";
import zIndex from "@mui/material/styles/zIndex";
import constants from "@/services/constants";
import { handleFormattedNumberChange } from "@/services/utils";

export default function RequestAccept({
  handleClose,
  handleAccept,
  setPassword,
  password,
  error,
  setError,
  phone,
  email,
  type,
  dateVal,
  setdateVal,
  originPrice,
  setOriginPrice,
}) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [originPriceFormatted, setOriginPriceFormatted] = useState("");
  const { t } = useTranslation();

  const validatePasswords = () => {
    if (!password || !confirmPassword) {
      setError(
        t(
          "components_corporate_contract-requests_popup_request-accept.يرجى_إدخال_كلمة_المرور"
        )
      );
      return false;
    }
    if (password !== confirmPassword) {
      setError(
        t(
          "components_corporate_contract-requests_popup_request-accept.كلمة_المرور_غير_متطابقة"
        )
      );
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (type != "agencies") {
      if (validatePasswords()) {
        handleAccept(password);
      }
    } else {
      if (!dateVal) {
        setError(
          t(
            "components_corporate_contract-requests_popup_request-accept.التاريخ_مطلوب"
          )
        );
      } else {
        setError("");
        console.log("Selected Date:", dateVal);
        handleAccept();
      }
    }
  };
  const styles = { ...globalStyles, ...localStyles };

  return (
    <Box sx={{ ...styles.popupContainer, border: "none" }}>
      <PopupTitle
        title={
          type == "agencies"
            ? t(
                "components_corporate_contract-requests_popup_request-accept.وكالة_جديدة"
              )
            : t(
                "components_corporate_contract-requests_popup_request-accept.إعتماد_الشركة"
              )
        }
        handleClose={handleClose}
      />

      <Typography
        sx={{
          fontSize: "1rem",
          color: "#6F6F6F",
        }}
      >
        {type !== "agencies" ? (
          <>
            {t(
              "components_corporate_contract-requests_popup_request-accept.سيتم_إرسال_رابط_لوحة"
            )}
            <span>{phone}</span> وعلي البريد الإلكتروني : <span>{email}</span>
          </>
        ) : (
          // t("components_corporate_contract-requests_popup_request-accept.تأكد_من_تاريخ_انتهاء")
          ""
        )}
      </Typography>

      {type != "agencies" ? (
        <>
          <Box sx={{ mt: 2.5, width: "100%" }}>
            <Input
              label="أدخل كلمة المرور "
              value={password}
              handleChange={(value) => setPassword(value)}
              placeholder={t(
                "components_corporate_contract-requests_popup_request-accept.أدخل_كلمة_المرور"
              )}
              type="password"
              startIcon="/images/icons/lock.svg"
              name="password"
              customStyle={{ width: "100%" }}
            />
          </Box>
          <Box sx={{ mt: 2.5, width: "100%" }}>
            <Input
              label="تأكيد كلمة المرور "
              value={confirmPassword}
              handleChange={(value) => setConfirmPassword(value)}
              placeholder="أعد إدخال كلمة المرور "
              type="password"
              startIcon="/images/icons/lock.svg"
              name="confirmPassword"
              customStyle={{ width: "100%" }}
            />
          </Box>
          <Box sx={{ mt: 2.5, width: "100%" }}>
            <Input
              label="سعر الأصل"
              placeholder="00,00"
              type="text"
              name="originPriceFormatted"
              value={originPriceFormatted}
              handleChange={(val) =>
                handleFormattedNumberChange(
                  val,
                  null,
                  null,
                  setOriginPrice,
                  setOriginPriceFormatted
                )
              }
              customStyle={{ width: "100%" }}
              error={!originPrice && error === "سعر الأصل مطلوب" ? error : ""}
            />
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 1, width: "100%" }}>
          <Input
            label={t(
              "components_corporate_contract-requests_popup_request-accept.تاريخ_انتهاء_الوكالة"
            )}
            value={dateVal}
            placeholder="أدخل تاريخ انتهاء الوكالة "
            type="date"
            name="date"
            handleChange={(newDate) => {
              setdateVal(newDate);
              setError("");
            }}
            error={error}
            customStyle={{ width: "100%", zIndex: 99999999 }}
            inputStyle={{ background: "#fff" }}
          />
        </Box>
      )}
      {type != "agencies" && error && <ErrorMsg message={error} />}
      <Box
        sx={{
          ...styles.popupBtnsContainer,
        }}
      >
        <CustomButton
          customeStyle={{
            width: { xs: "100%" },
            background:
              type == "agencies" ? "#22A06B" : constants.colors.main,
            "&:hover": {
              background:
                type == "agencies" ? "#22A06B" : constants.colors.main,
            },
          }}
          handleClick={handleSubmit}
          text={
            type != "agencies"
              ? t(
                  "components_corporate_contract-requests_popup_request-accept.إعتماد_الشركة"
                )
              : t(
                  "components_corporate_contract-requests_popup_request-accept.تفعيل_الوكالة"
                )
          }
        />
      </Box>
    </Box>
  );
}
