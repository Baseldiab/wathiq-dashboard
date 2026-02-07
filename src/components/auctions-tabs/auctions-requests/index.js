import { useTranslation } from "next-i18next";
import { styles } from "@/components/globalStyle";
import { Box } from "@mui/material";
import React, { useMemo, useState } from "react";

import TabItem from "@/components/tab-item";
import CustomButton from "@/components/button";
import FilterMenu from "@/components/filter-menu";

import AuctionTable from "../auction-table";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";


export default function OnPlatform() {
  const { t } = useTranslation();
  const tabItems = [
  { text: t("components_auctions-tabs_auctions-requests_index.مزادات_خاصة"), id: 1 },
  { text: t("components_auctions-tabs_auctions-requests_index.هيئة_إنفاذ"), id: 2 },
  //   { text: t("components_auctions-tabs_auctions-requests_index.طلبات_افراد"), id: 3 },
];
const childTabs = {
  1: [
    { text: t("components_auctions-tabs_auctions-requests_index.إنتظار_المراجعة"), id: 1 },
    { text: t("components_auctions-tabs_auctions-requests_index.مقبولة"), id: 2 },
    { text: t("components_auctions-tabs_auctions-requests_index.المرفوضة"), id: 3 },
  ],
  2: [
    { text: t("components_auctions-tabs_auctions-requests_index.إنتظار_المراجعة"), id: 1 },
    { text: t("components_auctions-tabs_auctions-requests_index.مقبولة"), id: 2 },
    { text: t("components_auctions-tabs_auctions-requests_index.المرفوضة"), id: 3 },
  ],
};
  const { data: profile } = useSelector((state) => state.profile);
  const [selectedItem, setSelectedItem] = useState(1);
  const [selectedChildItem, setSelectedChildItem] = useState(1);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const router = useRouter();
  // Handle main tab change
  const handleItemChange = (id) => {
    setSelectedItem(id);
    setSelectedChildItem(1);
  };

  // Handle child tab change
  const handleChildChange = (id) => {
    setSelectedChildItem(id);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const renderedChildComponent = useMemo(() => {
    if (selectedChildItem === 1)
      return (
        <AuctionTable
          status="pending"
          specialToSupportAuthority={selectedItem == 2 ? "true" : "false"}
          reviewStatus="need_to_review"
          createdByAdmin="false"
        />
      );
    if (selectedChildItem === 2)
      return (
        <AuctionTable
          status="pending"
          specialToSupportAuthority={selectedItem == 2 ? "true" : "false"}
          reviewStatus="approved"
          createdByAdmin="false"
        />
      );
    if (selectedChildItem === 3)
      return (
        <AuctionTable
          status="pending"
          specialToSupportAuthority={selectedItem == 2 ? "true" : "false"}
          reviewStatus="rejected"
          createdByAdmin="false"
        />
      );
    return null;
  }, [selectedChildItem, selectedItem]);
  const renderedComponent = useMemo(() => {
    return (
      <>
        <Box
          sx={{
            ...styles.tabsItemContainer,
            mb: 2,
          }}
        >
          {(childTabs[selectedItem] || []).map((item) => (
            <TabItem
              key={item.id}
              item={item}
              selectedItem={selectedChildItem}
              handleItemChange={handleChildChange}
            />
          ))}
        </Box>
        <Box>{renderedChildComponent}</Box>
      </>
    );
  }, [selectedItem, selectedChildItem]);

  return (
    <Box
      sx={{
        ...styles.boxData,
        border: "1px solid #D6D9E1",
        minHeight: "350px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          ...styles.dataSpaceBetween,
        }}
      >
        <Box
          sx={{
            ...styles.tabsItemContainer,
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
        <Box
          sx={{
            flex: 1,
            flex: "none",
            display: "flex",
            gap: "12px",
          }}
        >
          <CustomButton
            handleClick={() => router.push("/auctions/create-auction")}
            text={t("components_auctions-tabs_auctions-requests_index.إنشاء_مزاد")}
            // type="add"
          />
         
        </Box>{" "}
      </Box>
      <Box>{renderedComponent}</Box>
    </Box>
  );
}
