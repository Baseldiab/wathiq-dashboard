import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { getUserAuctions } from "@/Redux/slices/userSlice";
import Loader from "@/components/loader";
import TabItem from "@/components/tab-item";
import AuctionCard from "./auctionCard";

const Auction = ({ selectedUser }) => {
  const { t } = useTranslation();
  const tabItems = [
    { text: t("components_users_user_auctions_index.الرابحة"), id: 1 },
    { text: t("components_users_user_auctions_index.الخاسرة"), id: 2 },
  ];
  const dummyAuction = [
    {
      _id: "123456",
      title: t("components_users_user_auctions_index.مزاد_عقاري_في_الرياض"),
      type: "real_estate",
      status: "on_going", // options: "in_progress", "on_going", "completed"
      cover: "/images/auctions.jpg", // Replace with any placeholder or actual image
      location: {
        latitude: 24.7136,
        longitude: 46.6753,
        title: t("components_users_user_auctions_index.الرياض_السعودية"),
      },
      type: t("components_users_user_auctions_index.مزاد_هجين"),
      timerSize: "medium",
      timer: Date.now() + 1000 * 60 * 60, // 1 hour from now
      auctionOrigins: [
        { id: 1, name: "Origin 1" },
        { id: 2, name: "Origin 2" },
        { id: 3, name: "Origin 2" },
      ],
      logos: [
        {
          logo: "/images/icons/instagram.svg", // Replace with a placeholder if needed
        },
        {
          logo: "/images/icons/instagram.svg", // Replace with a placeholder if needed
        },
      ],
    },
    {
      _id: "123456",
      title: t("components_users_user_auctions_index.مزاد_عقاري_في_الرياض"),
      type: "real_estate",
      status: "on_going", // options: "in_progress", "on_going", "completed"
      cover: "/images/auctions.jpg", // Replace with any placeholder or actual image
      location: {
        latitude: 24.7136,
        longitude: 46.6753,
        title: t("components_users_user_auctions_index.الرياض_السعودية"),
      },
      type: t("components_users_user_auctions_index.مزاد_اونلاين"),
      timerSize: "medium",
      timer: Date.now() + 1000 * 60 * 60, // 1 hour from now
      auctionOrigins: [
        { id: 1, name: "Origin 1" },
        { id: 2, name: "Origin 2" },
      ],
      logos: [
        {
          logo: "/images/icons/instagram.svg", // Replace with a placeholder if needed
        },
        {
          logo: "/images/icons/instagram.svg", // Replace with a placeholder if needed
        },
      ],
    },
    {
      _id: "123456",
      title: t("components_users_user_auctions_index.مزاد_عقاري_في_الرياض"),
      type: "real_estate",
      status: "on_going", // options: "in_progress", "on_going", "completed"
      cover: "/images/auctions.jpg", // Replace with any placeholder or actual image
      location: {
        latitude: 24.7136,
        longitude: 46.6753,
        title: t("components_users_user_auctions_index.الرياض_السعودية"),
      },
      type: t("components_users_user_auctions_index.مزاد_اونلاين"),
      timerSize: "medium",
      timer: Date.now() + 1000 * 60 * 60, // 1 hour from now
      auctionOrigins: [
        { id: 1, name: "Origin 1" },
        { id: 2, name: "Origin 2" },
      ],
      logos: [
        {
          logo: "/images/icons/instagram.svg", // Replace with a placeholder if needed
        },
        {
          logo: "/images/icons/instagram.svg", // Replace with a placeholder if needed
        },
      ],
    },
    {
      _id: "123456",
      title: t("components_users_user_auctions_index.مزاد_عقاري_في_الرياض"),
      type: "real_estate",
      status: "on_going", // options: "in_progress", "on_going", "completed"
      cover: "/images/auctions.jpg", // Replace with any placeholder or actual image
      location: {
        latitude: 24.7136,
        longitude: 46.6753,
        title: t("components_users_user_auctions_index.الرياض_السعودية"),
      },
      type: t("components_users_user_auctions_index.مزاد_اونلاين"),
      timerSize: "medium",
      timer: Date.now() + 1000 * 60 * 60, // 1 hour from now
      auctionOrigins: [
        { id: 1, name: "Origin 1" },
        { id: 2, name: "Origin 2" },
      ],
      logos: [
        {
          logo: "/images/icons/instagram.svg", // Replace with a placeholder if needed
        },
        {
          logo: "/images/icons/instagram.svg", // Replace with a placeholder if needed
        },
      ],
    },
  ];

  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(1);

  const { selectedUserAuctions, selected_Auctions_loading } = useSelector(
    (state) => state.user
  );
  console.log("selectUSER", selectedUser);

  useEffect(() => {
    if (router.query.mainTab) {
      setSelectedItem(Number(router.query.mainTab));
    }
  }, [router.query.mainTab]);

  useEffect(() => {
    if (selectedUser?.data?._id) {
      console.log("getUserAuctionsID", selectedUser?.data?._id);

      const result = selectedItem === 1 ? "winner" : "loss";
      dispatch(getUserAuctions({ userId: selectedUser.data._id, result }));
    }
  }, [dispatch, selectedUser, selectedItem]);

  const handleItemChange = (id) => {
    setSelectedItem(id);
  };

  if (selected_Auctions_loading) return <Loader open={true} />;

  return (
    <>
      {/* Tab Items */}
      <Box
        sx={{
          width: "100%",
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
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
              key={item.id}
              item={item}
              selectedItem={selectedItem}
              handleItemChange={handleItemChange}
            />
          ))}
        </Box>
      </Box>

      {/* Auction Cards */}
      {selectedUserAuctions?.data?.length > 0 ? (
        <Grid container spacing={2}>
          {selectedUserAuctions?.data?.map((auction) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={auction?._id}>
              <AuctionCard auction={auction || {}} />
              {/* <AuctionCard
                auction={auction || {}}
                selectedItem={selectedItem}
              /> */}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>
          {t("components_users_user_auctions_index.لا_توجد_مزادات_حاليا")}
        </Typography>
      )}
      {/* {dummyAuction?.length > 0 ? (
        <Grid container spacing={2}>
          {dummyAuction?.map((auction) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={auction?._id}>
              <AuctionCard auction={auction || {}} selectedItem={selectedItem} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>{t("components_users_user_auctions_index.لا_توجد_مزادات_حاليا")}</Typography>
      )} */}
    </>
  );
};

export default Auction;
