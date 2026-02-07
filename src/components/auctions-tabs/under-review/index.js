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
import { isAdmin } from "@/services/utils";

export default function UnderReview() {
  const { t } = useTranslation();
  const tabItems = [
    {
      text: t("components_auctions-tabs_under-review_index.مزادات_خاصة"),
      id: 1,
    },
    {
      text: t("components_auctions-tabs_under-review_index.هيئة_إنفاذ"),
      id: 2,
    },
  ];
  const { data: profile } = useSelector((state) => state.profile);
  const [selectedItem, setSelectedItem] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const router = useRouter();

  const handleItemChange = (id) => {
    setSelectedItem(id);
  };
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const renderedComponent = useMemo(() => {
    if (selectedItem === 1)
      return (
        <AuctionTable
          createdByAdmin={isAdmin()}
          status="pending"
          specialToSupportAuthority="false"
          reviewStatus="need_to_review"
        />
      );
    if (selectedItem === 2)
      return (
        <AuctionTable
          createdByAdmin={isAdmin()}
          status="pending"
          specialToSupportAuthority="true"
          reviewStatus="need_to_review"
        />
      );
    return null;
  }, [selectedItem]);
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
            text={t("components_auctions-tabs_under-review_index.إنشاء_مزاد")}
            // type="add"
          />
        </Box>{" "}
      </Box>
      <Box>{renderedComponent}</Box>
    </Box>
  );
}
