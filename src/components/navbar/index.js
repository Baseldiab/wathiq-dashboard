import { useTranslation } from "next-i18next";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import { useRouter } from "next/router";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import constants from "@/services/constants";
import { IconButton } from "@mui/material";
import SourceOutlinedIcon from "@mui/icons-material/SourceOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { hasRole } from "@/services/utils";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import HeadsetMicRoundedIcon from "@mui/icons-material/HeadsetMicRounded";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import { ArticleRounded } from "@mui/icons-material";
import DomainIcon from '@mui/icons-material/Domain';
const drawerWidth = 300;
export default function DrawerAppBar(props) {
  const { t } = useTranslation();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const navItems = [
    {
      href: "/control-panel",
      text: "التقارير",
      icon: <AutoAwesomeMosaicIcon sx={{ fontSize: "1.8rem" }} />,
      admin: hasRole([
        "get user analysis",
        "get auction analysis",
        "get payment analysis",
        "get agency analysis",
      ]),
    },
    {
      href: "/auctions",

      text: t("components_navbar_index.إدارة_المزادات"),
      icon: <ArticleRounded sx={{ fontSize: "1.8rem" }} />,
      admin: hasRole([
        "get auction",
        "create auction",
        "review auction",
        "manage auction enrollments",
        "manage auction award",
      ]),
    },
    {
      href: "/content-control",
      text: t("components_navbar_index.ادارة_المحتوي"),
      icon: <SourceOutlinedIcon sx={{ fontSize: "1.8rem" }} />,
      // admin: profile?.data?.type === "admin",
      admin: hasRole([
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
      ]),
    },
    {
      href: "/corporate-management",
      text: t("components_navbar_index.إدارة_الشركات"),
      icon: <ApartmentRoundedIcon sx={{ fontSize: "1.8rem" }} />,
      // admin: profile?.data?.type === "admin",
      admin: hasRole([
        "get providers",
        "create provider",
        "manage provider requests",
      ]),
    },
    {
      href: "/users",
      text: t("components_navbar_index.إدارة_المستخدمين"),
      icon: <PersonIcon sx={{ fontSize: "1.8rem" }} />,
      // admin: profile?.data?.type === "admin",
      admin: hasRole([
        "get users",
        "update user",
        "block user",
        "unblock user",
        "delete account",
        "manage users",
        "manage agencies",
        "review auction",
      ]),
    },
    {
      href: "/property-management",
      text: t("components_navbar_index.إدارة_الأملاك"),
      icon: <ApartmentRoundedIcon sx={{ fontSize: "1.8rem" }} />,
      // admin: profile?.data?.type === "admin",
      admin: hasRole(["manage property management"]),
    },

    {
      href: "/wallet",
      text: "المحفظه",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: "1.8rem" }} />,
      // admin: hasRole("manage contact us"),
      // admin: profile?.data?.type === "admin",
    },
    {
      href: "/support",
      text: t("components_navbar_index.الدعم_الفني"),
      icon: <HeadsetMicRoundedIcon sx={{ fontSize: "1.8rem" }} />,
      admin: hasRole("manage contact us"),
      // admin: profile?.data?.type === "admin",
    },
    {
      href: "/",
      text: t("components_navbar_index.الاعدادات"),
      icon: <SettingsOutlinedIcon sx={{ fontSize: "1.8rem" }} />,
    },
  ];
  //drawer ==>  when click on Menu in small screen to open list
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ mt: 6, mb: 3 }}>
        <Image src="/images/logo.svg" width="122" height="40" alt="logo" />
      </Box>
      <List>
        {navItems
          .filter((item) => item.admin === undefined || item.admin)
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => item.href && router.push(item.href)}
                sx={{
                  textAlign: "center",
                  color: constants.colors.main,
                }}
              >
                {item.icon}
                <ListItemText
                  sx={{
                    flex: "unset",
                    color: constants.colors.main,
                    mx: 2,
                    "& span": {
                      fontSize: "1.8rem",
                      fontWeight: 700,
                    },
                  }}
                  primary={item.text}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar ==> navbar in small screnn contain menu icon to click on it to open drawer */}
      <AppBar
        component="nav"
        sx={{
          backgroundColor: "#ffff",
          justifyContent: "center",
          minHeight: "100px",
          padding: "14px 0px",
          borderBottom: "2px solid #E0E0E0",
          boxShadow: "none",
          alignItems: "base-line",
          verticalAlign: "middle",
          zIndex: "99", //999 trasform to 99 to solve index in datepacker!
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            px: 5,
          }}
        >
          {!mobileOpen && (
            <Image
              alt="logo"
              src="/images/logo.svg"
              width="122"
              height="40"
              style={{
                margin: {
                  md: "0px 16px",
                  xs: "0px 8px",
                },
                verticalAlign: "middle",
              }}
            />
          )}
          <IconButton
            sx={{ mr: 2, cursor: "pointer", display: { md: "none" } }}
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuOutlinedIcon sx={{ color: constants.colors.main, mr: 4 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          anchor={"right"}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              color: "#fff !important",
              background: `#fffff !important`,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box
        component="main"
        sx={{
          padding: { xs: "32px 24px", md: "42px 24px" },
        }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
}
