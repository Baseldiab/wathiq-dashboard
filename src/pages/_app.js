import { useEffect, useState } from "react";
import "@/styles/globals.css";
import { createTheme, ThemeProvider, Box } from "@mui/material";
import { PersistGate } from "redux-persist/integration/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { persistor, store } from "@/Redux/store/store";
import { appWithTranslation } from "next-i18next";
import '../../src/i18n'
const Navbar = dynamic(() => import("@/components/navbar/index.js"));
const Layout = dynamic(() => import("@/components/layout/index.js"));

function App({ Component, pageProps }) {
  const theme = createTheme({
    typography: {
      fontFamily: "Almarai",
    },
  });
  const router = useRouter();
  useEffect(() => {
    const publicRoutes = ["/login", "/reset-password"];
    const isPublicRoute = publicRoutes.includes(router.pathname);
    if (!store.getState().auth.isLoggedIn && !isPublicRoute) {
      router.push("/login");
    }
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Box>
          <PersistGate loading={null} persistor={persistor}>
            {!["/login", "/reset-password"].includes(router.asPath) ? (
              store.getState().auth.isLoggedIn && (
                <>
                  <Box
                    sx={{
                      display: {
                        md: "block",
                        xs: "none",
                      },
                    }}
                  >
                    <Layout component={<Component {...pageProps} />} />
                  </Box>
                  <Box
                    sx={{
                      display: {
                        md: "none",
                        xs: "block",
                      },
                    }}
                  >
                    <Navbar />
                    <Box sx={{ px: 1 }}>
                      <Component {...pageProps} />
                    </Box>
                  </Box>
                </>
              )
            ) : (
              <Component {...pageProps} />
            )}
          </PersistGate>
        </Box>
      </Provider>
    </ThemeProvider>
  );
}

export default appWithTranslation(App);
