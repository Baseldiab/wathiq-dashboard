import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import NewRequsets from "./new-requests";
import Rejected from "./rejected/rejected";
import InProgress from "./inprogress/inProgress";
import Active from "./active";
import { useTranslation } from "react-i18next";

export default function Withdrawal_Requests() {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(1);

  const router = useRouter();

  useEffect(() => {
    if (router.query.mainTab) {
      setSelectedItem(Number(router.query.mainTab));
    }
  }, [router.query.mainTab]);

  const handleItemChange = (id) => {
    setSelectedItem(id);
  };

  const tabItems = [
    { text: t("components_wallet_withdrawal-requests_index.جديدة"), id: 1 },
    { text: t("components_wallet_withdrawal-requests_index.تحت_الإجراء"), id: 2 },
    { text: t("components_wallet_withdrawal-requests_index.تم_التحويل"), id: 3 },
    { text: t("components_wallet_withdrawal-requests_index.مرفوضة"), id: 4 }
  ];

  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <NewRequsets />;
      case 2:
        return <InProgress />;
      case 3:
        return <Active />;
      case 4:
        return <Rejected />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          mb: 3,
          ...styles.dataSpaceBetween,
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid #D6D9E1",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            padding: "8px",
            fontWeight: 700,
          }}
        >
          {tabItems.map((item) => (
            <TabItem
              key={item.id}
              item={item}
              selectedItem={selectedItem}
              handleItemChange={handleItemChange}
            />
          ))}
        </Box>
      </Box>
      <Box>{showBoxContent()}</Box>
    </Box>
  );
}
