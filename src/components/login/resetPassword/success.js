import { useTranslation } from "next-i18next";
import { Box, Typography } from "@mui/material";
import { styles } from "@/components/globalStyle.js";
import { login_style } from "@/components/login/style";
import Button from "@/components/button/index";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Success({
  text,
  showBtn = true,
  // handleClose
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const handleLoginRedirct = () => {
    router.push("/login");
  };
  return (
    <Box
      sx={{
        ...styles.boxContainer,
        height: "auto",
        minHeight: "auto",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <img
          src="/images/icons/close-x.svg"
          style={{ cursor: "pointer" }}
          alt="close"
          onClick={handleLoginRedirct}
        />
      </Box>
      <Box sx={{ p: 3, display: "flex", gap: "10px", flexDirection: "column" }}>
        <Image
          src="/images/icons/success.svg"
          alt="success"
          width="108"
          height="108"
          style={{ display: "block", margin: "auto" }}
        />
        <Typography
          sx={{
            ...login_style.typography,
            fontWeight: 700,
            fontSize: "1rem",
            mt: 3,
            textAlign: "center",
          }}
        >
          {text||t("components_login_resetPassword_success.تم_تغير_كلمة_المرور")}
        </Typography>
      </Box>

      {showBtn && (
        <>
          <Box sx={{ pt: 3 }}>
            <Button
              handleClick={handleLoginRedirct}
              customeStyle={{ width: "100%" }}
              disabled={false}
              text={t("components_login_resetPassword_success.تسجيل_الدخول")}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
