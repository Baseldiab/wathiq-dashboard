// pages/dashboard.js
import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import TabItem from "@/components/tab-item";
import { styles } from "@/components/globalStyle";
import WalletAnalysisMain from "@/components/wallet/analytics";
import UserAnalysis from "@/components/users/user/analytics/UserAnalysis";
import AgencieyAnalysisMain from "@/components/users/agencies/analytics";
import AgencieyAnalysis from "@/components/users/agencies/analytics/AgencyOverview";
import AuctionAnalysis from "@/components/auctions-tabs/analysis/auction";
import { hasRole } from "@/services/utils";
import { useRouter } from "next/router";

const tabItems = [
  { text: "التقارير المالية", id: 1, role: ["get payment analysis"] },
  { text: "المستخدمين", id: 2, role: ["get user analysis"] },
  { text: "المزادات", id: 3, role: ["get auction analysis"] },
  { text: "الوكالات", id: 4, role: ["get agency analysis"] },
];
export default function Dashboard() {
  const [selectedItem, setSelectedItem] = useState(1);
  const handleItemChange = (id) => {
    setSelectedItem(id);
  };
  const filteredTabItems = tabItems.filter(
    (item) => !item.role || hasRole(item.role)
  );
  const router = useRouter();
  useEffect(() => {
    if (filteredTabItems.length === 0) {
      router.push("/");
    } else if (!filteredTabItems.find((tab) => tab.id === selectedItem)) {
      setSelectedItem(filteredTabItems[0].id);
    }
  }, [filteredTabItems.length]);
  const renderedComponent = useMemo(() => {
    if (selectedItem === 1)
      return (
        <>
          <WalletAnalysisMain />
        </>
      );
    if (selectedItem === 2) return <UserAnalysis />;
    if (selectedItem === 3) return <AuctionAnalysis />;
    if (selectedItem === 4) return <AgencieyAnalysis />;

    return null;
  }, [selectedItem]);
  return (
    <>
      <Box
        sx={{
          ...styles.tabsItemContainer,
          mb: 3,
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
      <Box>{renderedComponent}</Box>
    </>
  );
}
