import { useTranslation } from "next-i18next";
import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { useState } from "react";

import Image from "next/image";
import NationalIdForm from "@/components/login/resetPassword/NationalIdForm";
import OTPForm from "@/components/login/resetPassword/otpForm";
import ConfirmPassword from "@/components/login/resetPassword/confirmPasswordForm";
import Success from "@/components/login/resetPassword/success";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [formType, setFormType] = useState("phone");
  const [otpcode, setOTPCode] = useState("");
  const [open, setOpen] = useState(false);
  const handleLoginRedirct = () => {
    router.push("/login");
  };
  const formRender = () => {
    switch (formType) {
      case "phone":
        return (
          <NationalIdForm
            setFormType={setFormType}
            setOTPCode={setOTPCode}
            setOpen={setOpen}
          />
        );
        break;
      case "get-otp":
        return (
          <OTPForm
            setFormType={setFormType}
            otpcode={otpcode}
            setOTPCode={setOTPCode}
            setOpen={setOpen}
            open={open}
          />
        );
        break;
      case "confirm-password":
        return <ConfirmPassword setFormType={setFormType} />;
        break;
      case "success":
        return <Success  />;
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Head>
        <title>{t("pages_reset-password.اعادة_تعيين_كلمة_المرور")}</title>
        <meta name="description" content="auction" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        <Box
          sx={{
            background:
              "linear-gradient(270deg, rgba(255, 255, 255, 0.06) 9.31%, rgba(19, 92, 88, 0.06) 100%)",
            height: "100vh",
          }}
        >
          <Container sx={{ height: "100%" }}>
            <Box
              container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Grid container>
                <Grid sx={{ margin: "auto" }} item xs={12} sm={8} md={6}>
                  {formRender()}
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </main>
    </>
  );
}
