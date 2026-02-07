import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import NoCorporate from "../no-corporate";
import { useDispatch, useSelector } from "react-redux";
import {
  buildQueryParams,
  hasRole,
} from "@/services/utils";
import {
  Box,
  Typography,
} from "@mui/material";
import { getAllProviders, getProvider } from "@/Redux/slices/providerSlice";
import { getAllRoles } from "@/Redux/slices/roleSlice";
import Loader from "@/components/loader";
import { useRouter } from "next/router";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import CustomButton from "@/components/button";
import Blocked from "./blocked";
import Rejected from "./rejected";
import constants from "@/services/constants";

export default function Archive() {
  const { t } = useTranslation();
  const tabItems = [
  { text: t("components_corporate_archive_index.شركات_محظورة"), id: 1 },
  { text: t("components_corporate_archive_index.طلبات_مرفوضة"), id: 2 },
];
  const [selectedItem, setSelectedItem] = useState(1);
  const [tabTitle, setTabTitle] = useState(t("components_corporate_archive_index.الشركات_محظورة"));

  const { blockedProviders, loading, loadingBlocked } = useSelector(
    (state) => state.provider
  );
  const { data: profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (router.query.subTab) {
      setSelectedItem(Number(router.query.subTab));
      const selectedTitle = tabItems.find(
        (item) => item.id === Number(router.query.subTab)
      )?.text;
      if (selectedTitle) {
        setTabTitle(selectedTitle);
      }
    }
  }, [router.query.subTab]);

  useEffect(() => {
    if (
      !blockedProviders &&
      // profile?.data?.type === "admin" &&
      hasRole("get providers")
    )
      dispatch(getAllProviders(buildQueryParams({ status: "blocked" })));
  }, []);
  const handleItemChange = (id, title) => {
    setSelectedItem(id);
    setTabTitle(title);
  };
  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <Blocked />;
      case 2:
        return <Rejected />;
      default:
        break;
    }
  };

  if (loadingBlocked) return <Loader open={true} />;
  return (
    <>
      <Box
        sx={{
          // ...styles.boxData,
          // border: "1px solid #D6D9E1",
          minHeight: "350px",
        }}
      >
        <Box
          sx={{
            // border: "1px solid #D6D9E1",
            display: "flex",
            justifyContent: "start",
            width: "fit-content",
            gap: "8px",
            borderRadius: "12px",
            padding: "8px",
            fontWeight: 700,
            bgcolor: constants.colors.light_grey,
            mb: "2rem",
          }}
        >
          {tabItems.map((item) => (
            <TabItem
              item={item}
              selectedItem={selectedItem}
              handleItemChange={handleItemChange}
              flag
            />
          ))}
        </Box>
        <Box sx={{ ...styles.boxData, bgcolor: constants.colors.light_grey }}>
          <Box
            sx={{
              width: "100%",
              ...styles.dataSpaceBetween,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "#202726",
                my: { xs: "16px" },
              }}
            >
              {tabTitle}
            </Typography>
            <Box
              sx={{
                flex: 1,
                flex: "none",
                display: "flex",
                gap: "12px",
              }}
            >
              {hasRole("create provider") && (
                <CustomButton
                  handleClick={() =>
                    router.push("/corporate-management/create-provider")
                  }
                  text={t("components_corporate_archive_index.إضافة_شركة")}
                  // customeStyle={{ p: "16px", height: "2.5rem" }}
                />
              )}
            </Box>
          </Box>
          <Box>{showBoxContent()}</Box>
        </Box>
      </Box>
    </>
  );
}
