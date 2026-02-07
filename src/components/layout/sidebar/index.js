import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { persistStore } from "redux-persist";
import { store } from "@/Redux/store/store";
import { logout } from "@/Redux/slices/globalSlice.js";
import { useDispatch, useSelector } from "react-redux";
import constants from "@/services/constants";
import { hasRole } from "@/services/utils";

const Item = ({ title, to, icon, selected, setSelected, path }) => {
  const { t } = useTranslation();
  const router = useRouter();
  console.log(path);

  return (
    <MenuItem
      active={selected === title || to === router.asPath}
      style={{
        // color: "#FAFAFA",
        color: constants.colors.main,

        background: to === router.asPath && "#fff",
      }}
      onClick={() => {
        if (!to) return;
        setSelected(path);
        router.push(to);
      }}
      icon={icon}
    >
      <Typography
        sx={{
          fontSize: "1.2rem",
          mx: 1,
          fontWeight: selected === title || to === router.asPath ? 700 : 400,
          color:
            selected === title || to === router.asPath
              ? constants.colors.main
              : "#2E353F",
        }}
      >
        {title}
      </Typography>
    </MenuItem>
  );
};

export default function Sidebar() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");
  const router = useRouter();
  const { data: profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const persistor = persistStore(store);
  const showWalletItem =
    hasRole(["get withdraws", "update withdraw"]) ||
    profile?.data?.type === "admin" ||
    profile?.data?.type === "providers";
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= "768") {
        setIsCollapsed(true);
      }
    });
    if (window.innerWidth <= "768") setIsCollapsed(true);
  }, []);

  const handleLogoOut = async () => {
    sessionStorage.removeItem("didRootRedirect");
    await dispatch(logout());
    persistor.pause();
    await persistor.flush().then(() => {
      return persistor.purge();
    });
    window.location.assign("/login");
  };

  return (
    <Box>
      <ProSidebar collapsed={isCollapsed} style={{ position: "relative" }}>
        <Menu iconShape="square" sx={{ zIndex: "none" }}>
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={
              isCollapsed ? (
                <MenuOutlinedIcon
                  sx={{ color: constants.colors.main, mt: 6 }}
                />
              ) : undefined
            }
            style={{
              margin: "30px 0px",
            }}
          >
            {!isCollapsed ? (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
                mt="20px"
              >
                <img width="140px" src="/images/logo.svg" />
                <IconButton
                  sx={{ bgcolor: "transparent" }}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  <MenuOutlinedIcon
                    sx={{ color: constants.colors.main, mr: 4 }}
                  />
                </IconButton>
                {/* <Box
                  edge="start"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{ mr: 2, cursor: "pointer"}}
                >
                  <Image
                    src="/images/icons/Minimize.svg"
                    width="24"
                    height="38"
                    alt="menu icon"
                  />
                </Box> */}
              </Box>
            ) : null}
          </MenuItem>
          <Box sx={{ pt: 4 }}>
            {hasRole([
              "get user analysis",
              "get auction analysis",
              "get payment analysis",
              "get agency analysis",
            ]) && (
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Item
                  title="التقارير"
                  icon={
                    <img
                      src="/images/icons/reports.svg"
                      style={{
                        filter:
                          selected === "التقارير" ||
                          router.asPath === "/control-panel"
                            ? "none"
                            : "brightness(0)", // makes icon black
                      }}
                    />
                  }
                  to={"/control-panel"}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            )}
          </Box>
          <Box sx={{ pt: 4 }}>
            {hasRole([
              "create category",
              "update category",
              "delete category",
              "create question",
              "update question",
              "delete question",
              "manage social",
              // "manage contact us",
              "manage sliders",
              "manage partners",
              "manage privacy policy",
              "manage auction logos",
            ]) && (
              <Box
                sx={
                  {
                    // mt: 10
                  }
                }
              >
                <Item
                  title={
                    !isCollapsed &&
                    t("components_layout_sidebar_index.ادارة_المحتوي")
                  }
                  icon={
                    <img
                      src="/images/icons/content.svg"
                      style={{
                        filter:
                          selected ===
                            t(
                              "components_layout_sidebar_index.ادارة_المحتوي"
                            ) || router.asPath === "/content-control"
                            ? "none"
                            : "brightness(0)", // makes icon black
                      }}
                    />
                  }
                  to="/content-control"
                  path={router.asPath}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            )}
            {hasRole([
              "get auction",
              "create auction",
              "review auction",
              "manage auction enrollments",
              "manage auction award",
            ]) && (
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Item
                  title={
                    !isCollapsed &&
                    t("components_layout_sidebar_index.إدارة_المزادات")
                  }
                  icon={
                    <img
                      src="/images/icons/auction.svg"
                      style={{
                        filter:
                          selected ===
                            t(
                              "components_layout_sidebar_index.إدارة_المزادات"
                            ) || router.asPath === "/auctions"
                            ? "none"
                            : "brightness(0)", // makes icon black
                      }}
                    />
                  }
                  to="/auctions"
                  path={router.asPath}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            )}
            {hasRole([
              "get providers",
              "create provider",
              "manage provider requests",
            ]) && (
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Item
                  title={
                    !isCollapsed &&
                    t("components_layout_sidebar_index.إدارة_الشركات")
                  }
                  icon={
                    <img
                      src="/images/icons/corperate.svg"
                      style={{
                        filter:
                          selected ===
                            t(
                              "components_layout_sidebar_index.إدارة_الشركات"
                            ) || router.asPath === "/corporate-management"
                            ? "none"
                            : "brightness(0)", // makes icon black
                      }}
                    />
                  }
                  to="/corporate-management"
                  path={router.asPath}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            )}
            {hasRole([
              "get users",
              "update user",
              "block user",
              "unblock user",
              "delete account",
              "manage users",
              "manage agencies",
              "review auction",
            ]) && (
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Item
                  title={!isCollapsed && " إدارة المستخدمين"}
                  icon={
                    <img
                      src="/images/icons/Profile.svg"
                      style={{
                        filter:
                          selected ===
                            t(
                              "components_layout_sidebar_index.إدارة_المستخدمين"
                            ) || router.asPath === "/users"
                            ? "none"
                            : "brightness(0)", // makes icon black
                      }}
                    />
                  }
                  to="/users"
                  path={router.asPath}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            )}
            {showWalletItem && (
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Item
                  title={!isCollapsed && "المحفظة"}
                  icon={
                    <img
                      src="/images/icons/wallet.svg"
                      style={{
                        filter:
                          selected ===
                            t(
                              "components_layout_sidebar_index.إدارة_المستخدمين"
                            ) || router.asPath === "/wallet"
                            ? "none"
                            : "brightness(0)", // makes icon black
                      }}
                    />
                  }
                  to="/wallet"
                  path={router.asPath}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            )}
            {hasRole("manage contact us") && (
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Item
                  title={
                    !isCollapsed &&
                    t("components_layout_sidebar_index.الدعم_الفني")
                  }
                  icon={
                    <img
                      src="/images/icons/support.svg"
                      style={{
                        filter:
                          selected ===
                            t("components_layout_sidebar_index.الدعم_الفني") ||
                          router.asPath === "/support"
                            ? "none"
                            : "brightness(0)",
                      }}
                    />
                  }
                  to="/support"
                  path={router.asPath}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            )}
            {hasRole([
             "manage property management",
            ]) && (
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Item
                  title={
                    !isCollapsed &&
                    t("components_layout_sidebar_index.إدارة_الأملاك")
                  }
                  icon={
                    <img
                      src="/images/icons/property.svg"
                      style={{
                        filter:
                          selected ===
                            t(
                              "components_layout_sidebar_index.إدارة_الأملاك"
                            ) || router.asPath === "/auctions"
                            ? "none"
                            : "brightness(0)", // makes icon black
                      }}
                    />
                  }
                  to="/property-management"
                  path={router.asPath}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            )}
            <Box
              sx={{
                mt: 2,
              }}
            >
              <Item
                title={
                  !isCollapsed && t("components_layout_sidebar_index.الاعدادات")
                }
                icon={
                  <img
                    src="/images/icons/setting.svg"
                    style={{
                      filter:
                        selected ===
                          t("components_layout_sidebar_index.الاعدادات") ||
                        router.asPath === "/"
                          ? "none"
                          : "brightness(0)", // makes icon black
                    }}
                  />
                }
                to="/"
                path={router.asPath}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: 30,
              right: !isCollapsed ? "50px" : "30px",
              display: "flex",
              color: "#fff",
              cursor: "pointer",
              alignItems: "center",
            }}
          >
            <LogoutIcon
              sx={{ fontSize: "1rem", color: constants.colors.warning_red }}
              onClick={handleLogoOut}
            />
            {!isCollapsed && (
              <Typography
                onClick={handleLogoOut}
                sx={{
                  mx: 1,
                  color: constants.colors.warning_red,
                  fontWeight: 700,
                }}
              >
                {t("components_layout_sidebar_index.تسجيل_الخروج")}
              </Typography>
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
}
