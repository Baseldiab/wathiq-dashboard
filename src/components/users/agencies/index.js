import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import Loader from "@/components/loader";
import { useRouter } from "next/router";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import UserInfo from "../user/user-info";
import NewRequsets from "./new-requests";
import ContractRequests from "@/components/corporate/contract-requests";
import Active from "./active";
import Rejected from "./rejected/rejected";
import Expired from "./expired/expired";
import Blocked from "../blocked";

export default function Agencies({ user }) {
  const { t } = useTranslation();
  const tabItems = [
  { text: t("components_users_agencies_index.تحت_الإجراء"), id: 1 },
  { text: "النشطة ", id: 2 },
  { text: "المنتهية ", id: 3 },
  { text: "الملغيه ", id: 4 },
  { text: "المرفوضة ", id: 5 },
];
  const [selectedItem, setSelectedItem] = useState(1);

  const { loadingApproved, providerLoading } = useSelector(
    (state) => state.provider
  );

  const router = useRouter();

  useEffect(() => {
    if (router.query.mainTab) {
      setSelectedItem(Number(router.query.mainTab));
    }
  }, [router.query.mainTab]);
  const handleItemChange = (id) => {
    setSelectedItem(id);
  };
  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <NewRequsets user={user} />;
      case 2:
        return <Active user={user} />;
      case 3:
        return <Expired user={user} />;
      case 4:
        return <Blocked user={user} />;
        // return "";
      case 5:
        return <Rejected user={user} />;

      default:
        break;
    }
  };
  if (loadingApproved || providerLoading) return <Loader open={true} />;
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          mb: 3,
          ...styles.dataSpaceBetween,
        }}
      >
        {" "}
        <Box
          sx={{
            border: "1px solid #D6D9E1",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            borderRadius: "12px",
            padding: "8px",
            fontWeight: 700,
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
      </Box>
      <Box>{showBoxContent()}</Box>
    </Box>
  );
}
