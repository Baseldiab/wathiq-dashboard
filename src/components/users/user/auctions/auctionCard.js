import { useTranslation } from "next-i18next";
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import DownTimer from "@/components/DownTimer";
import CustomButton from "@/components/button";
import { useRouter } from "next/router";

const AuctionCard = ({ auction, selectedItem }) => {
  const { t } = useTranslation();
  const {
    _id,
    title,
    status,
    cover,
    location,
    timer,
    auctionOrigins,
    logos,
    type,
  } = auction;
  const [currentTimer, setCurrentTimer] = useState(timer);
  const router = useRouter();
  return (
    _id && (
      <Box
        sx={{
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #D6D9E1",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          p: 2,
        }}
      >
        {/* Image Header */}
        <Box
          sx={{
            position: "relative",
            height: "200px",
            backgroundImage: `url(${cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "6px",
          }}
        >
          {/* Action Icons */}
          {/* <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <img src="/icons/heart.svg" />
            <img src="/icons/share.svg" />
          </Box> */}

          {/* Auction Type */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              // right: 8,
              bgcolor: "#1B5F5A",
              color: "#E6F6D5",
              px: 1.5,
              py: 0.5,
              borderTopLeftRadius: "12px",
              borderBottomLeftRadius: "12px",
              fontSize: "16px",
              fontWeight: "800",
            }}
          >
            {type}{" "}
          </Box>

          {/* Location Title */}
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(146, 145, 145, 0.4)",
              borderRadius: "6px",
              px: 1,
            }}
          >
            <Box
              component="a"
              href={`https://www.google.com/maps?q=${location?.latitude},${location?.longitude}`}
              target="_blank"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
                color: "#ffffff",
              }}
            >
              <img src="/images/icons/location.svg" />
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              >
                {location?.title}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Title */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "16px",
            px: 2,
            py: 1,
            color: "var(--washed_black)",
          }}
        >
          {title}
        </Typography>
        {/*  Status & Stats Box */}
        <Box
          sx={{
            backgroundColor: "#FBF8FC",
            borderRadius: "6px",
            px: 2,
            py: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {/* Top Row: Status Badges */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // gap: 1,
            }}
          >
            {/* Winner Badge */}
            {/* Auction Ended Badge */}
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #F5C6C6",
                color: "#D32F2F",
                backgroundColor: "#FCEAEA",
                borderRadius: "4px",
                // px: 2,
                // py: 0.5,
                p: "8px 16px",
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              {t("components_users_user_auctions_auctionCard.مزاد_منتهي")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border:
                  selectedItem === 1
                    ? "1px solid #22A06B"
                    : "1px solid #F5C6C6",
                color: selectedItem === 1 ? "#007C5B" : "#D32F2F",
                backgroundColor: selectedItem === 1 ? "#E1F3ED" : "#FCEAEA",
                borderRadius: "4px",
                // px: 2,
                // py: 0.5,
                p: " 8px 16px",
                fontWeight: 700,
                fontSize: "16px",
                gap: 1,
              }}
            >
              {selectedItem === 1 ? (
                <img src="/images/icons/auction-line-winner.svg" alt="winner" />
              ) : (
                <Typography> </Typography>
              )}
              {selectedItem === 1
                ? t("components_users_user_auctions_auctionCard.أنت_الرابح")
                : " خاسر"}
            </Box>
          </Box>
          <Box sx={{ borderBottom: "1px solid #F0F0F0" }}></Box>
          {/* Bottom Row: Stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              color: "#121212",
            }}
          >
            {/* Assets */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src="/images/icons/building.svg"
                alt={t("components_users_user_auctions_auctionCard.الاصول")}
              />
              <Typography>الاصول {auctionOrigins?.length}</Typography>
            </Box>

            {/* Duration */}
            {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src="/icons/clock.svg" alt={t("components_users_user_auctions_auctionCard.المدة")} />
              <Typography>{t("components_users_user_auctions_auctionCard.المدة_أيام")}</Typography>
            </Box> */}
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            {logos?.map((logo, idx) => (
              <Box
                key={idx}
                component="img"
                src={logo.logo}
                sx={{ width: "40px", height: "40px" }}
              />
            ))}
          </Box>
          <CustomButton
            customeStyle={{
              bgcolor: "#3E70B1",
              color: "#ffffff",
              // borderRadius: "12px",
              // p: 4,
              fontWeight: 400,
              fontSize: "16px",
            }}
            handleClick={() => {
              router.push(`/auctions/details/${_id}`);
            }}
            text={t("components_users_user_auctions_auctionCard.التفاصيل")}
          />
        </Box>
      </Box>
    )
  );
};

export default AuctionCard;
