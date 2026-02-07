import { useTranslation } from "next-i18next";
import CustomButton from "@/components/button";
import SAR from "@/components/sar";
import constants from "@/services/constants";
import { Box, Typography } from "@mui/material";
import React from "react";
import { hasRole } from "@/services/utils";

export default function UserBidding({
  index,
  participantNumber,
  name,
  amount,
  duration,
  completed,
  handleClick,
  awardStatue,
  awardedUser,
  userId,
  flag,
}) {
  const { t } = useTranslation();
  console.log("awardStatue", awardStatue);
  const statue = awardedUser == userId;
  return (
    <Box
      sx={{
        background: index == 0 ? "rgba(34, 160, 107, 0.05)" : "",
        backgroundColor: index == 0 ? "" : constants.colors.dark_white,
        borderRadius: "16px",
        p: { xs: "12px", md: "16px 12px" },
        display: "flex",
        width: "100%",
      }}
    >
      {/* right */}

      <Box
        component="img"
        src={index == 0 ? "/images/icons/up.svg" : "/images/icons/not-top.svg"}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%",
          mr: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span
              style={{
                // color: index == 0 ? "#fff" : constants.colors.main,
                color: constants.colors.main,
                marginLeft: "5px",
                fontSize: ".9rem",
              }}
            >
              {" "}
              {participantNumber}
            </span>{" "}
            <Typography
              sx={{
                fontSize: ".9rem",
                fontWeight: "700",
                color: index == 0 ? "#1A1A1A" : "#7A7B7A",
              }}
            >
              {name}
            </Typography>
          </Box>
          <Box
            sx={{
              fontSize: "1rem",
              fontWeight: "700",
              color: constants.colors.dark_green,
            }}
          >
            {amount} <SAR img="/images/icons/SAR.svg" />
          </Box>
        </Box>
        {/* left */}
        {duration && (
          <Box
            sx={{
              fontSize: ".9rem",
              color: "#2E353F",
              padding: "10px",
              borderRadius: "12px",
              bgcolor: "rgba(215, 216, 219, 0.20);",
            }}
          >
            منذ {duration}
          </Box>
        )}
        {completed &&
          hasRole("manage auction award") &&
          awardStatue == "pending" && (
            <CustomButton
              handleClick={handleClick}
              customeStyle={{
                color: "#fff",
                // height: "36px",
              }}
              // disabled={biddingBoard[0]?.auctionEnrollment == item?._id}
              text={t(
                "components_auctions-tabs_bidding-board_user-bidding.ترسية_المزاد"
              )}
            />
          )}
        {completed &&
          awardStatue == "awarded" &&
          (statue || flag ? (
            <CustomButton
              customeStyle={{
                color: "#fff",
                // height: "36px",
                background: "#22A06B",
                cursor: "auto",
                "&:hover": {
                  background: "#22A06B",
                  color: "#fff",
                  boxShadow: "none",
                },
              }}
              text={t(
                "components_auctions-tabs_bidding-board_user-bidding.تم_الترسية"
              )}
            />
          ) : (
            <CustomButton
              customeStyle={{
                color: "#fff",
                // height: "36px",
                background: "#E34935",
                cursor: "auto",
                "&:hover": {
                  background: "#E34935",
                  color: "#fff",
                  boxShadow: "none",
                },
              }}
              text={t(
                "components_auctions-tabs_bidding-board_user-bidding.خاسر"
              )}
            />
          ))}
      </Box>
    </Box>
  );
}
