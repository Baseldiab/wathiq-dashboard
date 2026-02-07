import React, { useState } from "react";
import { Box } from "@mui/material";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import PrivateEnrollments from "./special/PrivateEnrollments";
import EnforcementSection from "./EnforcementSection";
import { useTranslation } from "react-i18next";

export default function AuctionWinner() {
  const { t } = useTranslation();

  const tabItems = [
    { text: t("components_auction-winner_tabs.خاص"), id: 1 },
    { text: t("components_auction-winner_tabs.هيئة_إنفاذ"), id: 2 },
  ];

  const [selectedTabId, setSelectedTabId] = useState(1);

  const handleTabChange = (item) => {
    setSelectedTabId(item);
  };

  const renderTabContent = () => {
    switch (selectedTabId) {
      case 1:
        return <PrivateEnrollments />;
      case 2:
        return <EnforcementSection />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* التابات الرئيسية */}
      <Box sx={{ ...styles.tabsItemContainer, mb: 3 }}>
        {tabItems.map((item) => (
          <TabItem
            key={item.id}
            item={item}
            selectedItem={selectedTabId}
            handleItemChange={handleTabChange}
          />
        ))}
      </Box>

      {/* المحتوى الخاص بكل تاب */}
      {renderTabContent()}
    </Box>
  );
}
