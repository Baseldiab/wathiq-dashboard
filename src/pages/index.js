import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import { Typography, Box, Divider } from "@mui/material";
import constants from "@/services/constants";
import PersonalInfo from "@/components/home/personalInfo.js";
import Sections from "@/components/home/sections.js";
import Employees from "@/components/home/employees.js";
import JobTitle from "@/components/home/jobTitle.js";
import CompanyInfo from "@/components/home/companyInfo.js";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@/Redux/slices/profileSlice";
import { getRoles } from "@/Redux/slices/roleSlice";
import { getPermissions } from "@/Redux/slices/globalSlice";
import TabItem from "@/components/tab-item";
import { styles } from "@/components/globalStyle";
import { hasRole } from "@/services/utils";
import { useRouter } from "next/router";
import Loader from "@/components/loader";

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const tabItems = [
    { text: t("pages_index.المعلومات_الاساسية"), id: 1 },
    { text: t("pages_index.الموظفين"), id: 2, role: ["get employees"] },
    { text: t("pages_index.الصلاحيات"), id: 3, role: ["get roles"] },
    { text: t("pages_index.الاقسام"), id: 4, role: ["get departments"] },
  ];
  const [selectedItem, setSelectedItem] = useState(1);
  const [isChecking, setIsChecking] = useState(true); // حالة فحص الصلاحيات

  const dispatch = useDispatch();
  const { data: profile } = useSelector((state) => state.profile);
  const { permissions } = useSelector((state) => state.global);
  const { roles } = useSelector((state) => state.role);
  const handleItemChange = (id) => {
    setSelectedItem(id);
  };
  useEffect(() => {
    if (!router.isReady) return;

    const permissions = profile?.data?.role?.permissions;
    if (!permissions) return; // لسه البيانات ما اتحملتش

    if (
      router.pathname === "/" &&
      permissions.length === 0 &&
      !sessionStorage.getItem("didRootRedirect")
    ) {
      sessionStorage.setItem("didRootRedirect", "1");
      router.replace("/control-panel");
    } else {
      setIsChecking(false);
    }
  }, [router.isReady, router.pathname, profile]);
  useEffect(() => {
    if (!permissions) dispatch(getPermissions());
    if (!roles && hasRole("getRole")) dispatch(getRoles());
  }, []);

  useEffect(() => {
    if (!profile?.data?._id) {
      dispatch(getProfile());
    }
  }, []);
  const filteredTabItems = tabItems.filter(
    (item) => !item.role || hasRole(item?.role)
  );

  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return profile?.data?.type === "admin" ||
          profile?.data?.employeeType?.includes("admin") ? (
          <PersonalInfo />
        ) : profile?.data?.type === "providers" ||
          profile?.data?.employeeType?.includes("provider") ? (
          <CompanyInfo />
        ) : null;

      case 2:
        return <Employees />;
      case 3:
        return <JobTitle />;
      case 4:
        return <Sections />;
      default:
        break;
    }
  };
  if (isChecking) {
    return <Loader open={true} />;
  }
  return (
    <>
      <Head>
        <title>{t("pages_index.المزاد_العقاري")}</title>
        <meta name="description" content="auction" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <Box
            sx={{
              ...styles.tabsItemContainer,
            }}
          >
            {filteredTabItems.map((item) => (
              <TabItem
                item={item}
                selectedItem={selectedItem}
                handleItemChange={handleItemChange}
              />
            ))}
          </Box>
          <Divider />
          <Box
            sx={{
              display: "flex",
            }}
          >
            {showBoxContent()}
          </Box>
        </Box>
      </main>
    </>
  );
}
