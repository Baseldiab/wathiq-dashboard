import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import Loader from "@/components/loader";
import { useRouter } from "next/router";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import AllCard from "./AllCard";
import TransferredCard from "./TransferredCard";
import NotTransferredCard from "./NotTransferredCard";

const tabItems = [
  { text: "الكل", id: 1 },
  { text: "لم يتم التحويل ", id: 2 },
  { text: "تم التحويل  ", id: 3 },
];
export default function Withdrawal_Requests() {
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
  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <AllCard />;
      // case 2:
      //   return <NotTransferredCard></NotTransferredCard>;
      // case 3:
      //   return <TransferredCard></TransferredCard>;

      default:
        break;
    }
  };
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          // mb: 3,
          ...styles.dataSpaceBetween,
        }}
      >
        {" "}
        {/* <Box
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
        </Box> */}
      </Box>
      <Box>{showBoxContent()}</Box>
    </Box>
  );
}
