import { useTranslation } from "next-i18next";
import Head from "next/head";
import { Grid, Box, Container } from "@mui/material";
import Image from "next/image";
import LoginBox from "@/components/login/login-box";

export default function Login() {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("pages_login.تسجيل_الدخول")}</title>
        <meta name="description" content="auctions" />
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
                  <LoginBox />
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </main>
    </>
  );
}
