import { useTranslation } from "next-i18next";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/button";
import FilterMenu from "@/components/filter-menu";
import Contracts from "@/components/corporate/contracting-corporates";
import ContractRequests from "@/components/corporate/contract-requests";
import CompanyInfo from "@/components/home/companyInfo";
import { useDispatch, useSelector } from "react-redux";
import Archive from "@/components/corporate/archive";
import Input from "@/components/inputs";
import { getAllProviders } from "@/Redux/slices/providerSlice";
import { useRouter } from "next/router";
import { buildQueryParams, hasRole } from "@/services/utils";
import constants from "@/services/constants";

export default function CorporateManagement() {
  const { t } = useTranslation();
  const tabItems = [
    {
      text: t("pages_corporate-management_index.الشركات_المتعاقدة"),
      id: 1,
      role: ["get providers"],
    },
    {
      text: t("pages_corporate-management_index.طلبات_التعاقد"),
      id: 2,
      role: ["manage provider requests"],
    },
    {
      text: t("pages_corporate-management_index.الأرشيف"),
      id: 3,
      role: ["get providers", "manage provider requests"],
    },
  ];
  const [selectedItem, setSelectedItem] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const { data: profile } = useSelector((state) => state.profile);

  const [tabTitle, setTabTitle] = useState(
    t("pages_corporate-management_index.الشركات_المتعاقدة")
  );

  const [filterData, setFilterData] = useState({});
  const { approvedProviders, loadingApproved, providerLoading } = useSelector(
    (state) => state.provider
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const filteredTabItems = tabItems.filter(
    (item) => !item.role || hasRole(item.role)
  );
  useEffect(() => {
    if (filteredTabItems.length === 0) {
      router.push("/");
    } else if (!filteredTabItems.find((tab) => tab.id === selectedItem)) {
      setSelectedItem(filteredTabItems[0].id);
    }
  }, [filteredTabItems.length]);
  useEffect(() => {
    if (router.query.mainTab) {
      setSelectedItem(Number(router.query.mainTab));
      const selectedTitle = tabItems.find(
        (item) => item.id === Number(router.query.mainTab)
      )?.text;
      if (selectedTitle) {
        setTabTitle(selectedTitle);
      }
    }
  }, [router.query.mainTab]);

  useEffect(() => {
    if (router.query.mainTab || router.query.subTab) {
      router.replace("/corporate-management", undefined, { shallow: true });
    }
  }, []);
  useEffect(() => {
    if (!hasRole(["get providers", "manage provider requests"]))
      router.push("/");
  }, []);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleItemChange = (id, title) => {
    setSelectedItem(id);
    setTabTitle(title);
  };

  const handleResetData = () => {
    handleCloseMenu();
    setFilterData({});
    dispatch(handleReload());
  };
  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <Contracts />;
      case 2:
        return <ContractRequests />;
      case 3:
        return <Archive />;
      default:
        break;
    }
  };

  return (
    <>
      <Head>
        <title>{t("pages_corporate-management_index.إدارة_الشركات")}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#202726",
            mb: { xs: "16px", md: "24px" },
          }}
        >
          إدارة الشركات{" "}
        </Typography>
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
          {filteredTabItems.map((item) => (
            <TabItem
              item={item}
              selectedItem={selectedItem}
              handleItemChange={handleItemChange}
              flag
            />
          ))}
        </Box>
        <Box
          sx={{
            ...(selectedItem !== 3 && {
              minHeight: "350px",
              bgcolor: constants.colors.light_grey,
              padding: "20px",
              borderRadius: "20px",
            }),
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedItem != 3 && (
            <Box
              sx={{
                width: "100%",
                ...styles.dataSpaceBetween,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  width: "fit-content",
                  gap: "8px",
                  borderRadius: "12px",
                  padding: "8px",
                  fontWeight: 700,
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
              </Box>
              <Box
                sx={{
                  flex: 1,
                  flex: "none",
                  display: "flex",
                  gap: "12px",
                }}
              >
                {hasRole("create provider") && (
                  <Button
                    handleClick={() =>
                      router.push("/corporate-management/create-provider")
                    }
                    text={t("pages_corporate-management_index.إضافة_شركة")}
                    // customeStyle={{ p: "16px", height: "2.5rem" }}
                  />
                )}
              </Box>
            </Box>
          )}

          <Box>{showBoxContent()}</Box>
        </Box>
      </>
    </>
  );
}
