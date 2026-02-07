import { useTranslation } from "next-i18next";
import { Box, Card, Typography, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import BasicPagination from "@/components/pagination";
import Custom_Card from "../Card";
import SyncIcon from "@mui/icons-material/Sync";
import TransctionHistory from "./transaction_history";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
const Wallet = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const menuOpen = Boolean(anchorEl);
  const [selectedItem, setSelectedItem] = useState(1);

  const tabItems = [
    { text: "المعاملات  ", id: 1 },
    { text: "طلبات السحب ", id: 2 },
    { text: "المبالغ المحجوزة ", id: 3 },
    { text: "الشيكات ", id: 4 },
  ];
  const handlePaginationChange = (e, currentPage) => {
    setPage(currentPage);
  };
  const handleItemChange = (id) => {
    setSelectedItem(id);
  };
  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <TransctionHistory />;
      case 2:
        return <TransctionHistory />;
      case 3:
        return <TransctionHistory />;
      case 4:
        return <TransctionHistory />;

      default:
        break;
    }
  };
  return (
    <Box sx={{ width: "100%", p: 2, direction: "rtl" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontSize={"24px"} fontWeight={700}>
          المحفظة{" "}
        </Typography>
      </Box>
      <Card
        sx={{
          background: "linear-gradient(136deg, #00DB81 -89.31%, #023936 100%)",
          borderRadius: "22px",
          padding: "32px",
          color: "#fff",
          width: "100%",
          textAlign: "right",
          direction: "rtl",
          mt: 3,
          mb: 6,
        }}
      >
        <Typography fontSize={"16px"} fontWeight={700} mb={1}>{t("components_users_user_wallet_index.الرصيد_المتاح")}</Typography>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              fontSize={"36px"}
              fontWeight={700}
              m={1}
              color="#00DB81"
            >
              556,138.5{" "}
              <Typography component="span" variant="body2">{t("components_users_user_wallet_index.رس")}</Typography>
              <SyncIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Typography>
          </Stack>
          <Box
            sx={{
              bgcolor: "#023936",
              p: "4px 8px",
              borderRadius: "8px",
              maxWidth: "280px",
            }}
          >
            <Typography fontSize={"14px"} fontWeight={500}>{t("components_users_user_wallet_index.مبلغ_متعلق_في_المزادات")}</Typography>
          </Box>
        </Stack>
      </Card>
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          my: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <Typography
            sx={{ color: "#6F6F6F", fontWeight: 700, fontSize: "1rem" }}
          >{t("components_users_user_wallet_index.من")}</Typography>
          <Typography sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}>
            {/* {usersData?.pagination?.resultCount} */}
            10
          </Typography>
        </Box>

        <BasicPagination
          handleChange={handlePaginationChange}
          page={page}
          count={totalCount}
        />
      </Box>
    </Box>
  );
};

export default Wallet;
