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
import UnderConstruction from "@/components/auctions-tabs/under-construction";
import InProgress from "@/components/auctions-tabs/in-progress";
import RequestsAuction from "@/components/auctions-tabs/auctions-requests";
import OnPlatform from "@/components/auctions-tabs/on-platform";
import UnderReview from "@/components/auctions-tabs/under-review";
import WalletAvailable from "@/components/auctions-tabs/wallet-available";

export default function Auction() {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const { data: profile } = useSelector((state) => state.profile);
  const { walletBalance } = useSelector((state) => state.wallet);
  useEffect(() => {
    !walletBalance && dispatch(getWallet());
  }, []);

  const originPrice =
    profile?.data?.employeeType == "provider_staff"
      ? profile?.data?.provider.originPrice
      : profile?.data?.originPrice || 0;
  const wallet = walletBalance?.data?.balance || 0;

  const maxOrigins = useMemo(() => {
    return originPrice > 0 ? Math.floor(wallet / originPrice) : 0;
  }, [wallet, originPrice]);


  const allTabItems = [
    {
      text: t("pages_auctions_index.قيد_الانشاء"),
      id: 1,
      role: ["get auction", "create auction", "update auction"],
    },
    {
      text: t("pages_auctions_index.قيد_المراجعة"),
      id: 2,
      adminOnly: true,
      role: ["get auction", "review auction"],
    },
    {
      text: t("pages_auctions_index.قيد_التنفيذ"),
      id: 3,
      adminOnly: true,
      role: ["get auction", "update auction"],
    },
    {
      text: t("pages_auctions_index.طلبات_المزادات"),
      id: 4,
      role: ["get auction", "review auction"],
    },
    {
      text: t("pages_auctions_index.مزادات_علي_المنصة"),
      id: 5,
      adminOnly: true,
      role: [
        "get auction",
        "manage auction award",
        "manage auction enrollments",
      ],
    },
  ];

  const tabItems = allTabItems.filter((item) => {
    const checkRole = (itm) => !itm.role || hasRole(itm.role);
    const isAdmin =
      !item.adminOnly ||
      profile?.data?.type === "admin" ||
      profile?.data?.employeeType === "admin_staff";
    return checkRole(item) && isAdmin;
  });
  useEffect(() => {
    if (tabItems.length > 0) {
      setSelectedItem(tabItems[0].id);
    }
  }, [tabItems.length]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (router.query?.mainTab) {
      setSelectedItem(Number(router.query.mainTab));
    }
  }, [router.query?.mainTab]);

  useEffect(() => {
    if (router.isReady && (router.query?.mainTab || router.query?.subTab)) {
      router.replace("/auctions", undefined, { shallow: true });
    }
  }, [router.isReady, router.query]);
  // useEffect(() => {
  //   if (!hasRole("get auction")) router.push("/");
  // }, []);
  const handleItemChange = (id) => {
    setSelectedItem(id);
  };

  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <UnderConstruction />;
      // return <CompanyInfo />;
      case 2:
        return <UnderReview />;
      case 3:
        return <InProgress />;
      case 4:
        return <RequestsAuction />;
      case 5:
        return <OnPlatform />;
      default:
        break;
    }
  };

  return (
    <>
      <Head>
        <title>{t("pages_auctions_index.إدارة_المزادات")}</title>
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
          إدارة المزادات{" "}
        </Typography>
        {profile?.data?.type == "providers" && (
          <WalletAvailable maxOrigins={maxOrigins} />
        )}
        <Box
          sx={{
            ...styles.tabsItemContainer,
            mb: { xs: "16px", md: "24px" },
            flexWrap: "wrap",
          }}
        >
          {tabItems.map((item) => (
            <TabItem
              item={item}
              selectedItem={selectedItem}
              handleItemChange={handleItemChange}
            />
          ))}
        </Box>

        <Box>{showBoxContent()}</Box>
      </>
    </>
  );
}
