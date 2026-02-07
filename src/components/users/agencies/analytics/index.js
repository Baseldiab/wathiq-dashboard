import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import Loader from "@/components/loader";
import { useRouter } from "next/router";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import AgencieyAnalysis from "./AgencyOverview";
const tabItems = [
  { text: "تحليلات الوكالات", id: 1 },
  { text: "تحليلات المسحوبات  ", id: 2 },
  { text: "تحليلات الاصول  ", id: 3 },
  { text: "اخري ", id: 4 },
];
export default function AgencieyAnalysisMain() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(1);

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
        return <AgencieyAnalysis />;
  
      default:
        break;
    }
  };
  
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          mb: 5,
          mt: 3,
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
      <Box
        sx={{
          m: 5,
        }}
      >
        {showBoxContent()}
      </Box>
    </Box>
  );
}
