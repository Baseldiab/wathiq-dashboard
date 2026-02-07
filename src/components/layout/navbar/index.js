import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Badge, Box, IconButton, Popover, Typography } from "@mui/material";
import Input from "@/components/inputs";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useDispatch, useSelector } from "react-redux";
import Notifications from "@/components/notification";
import { useSocketListener } from "@/services/socketHook";
import { extendOrUpdateExisting, getAllnotifications, update } from "@/Redux/slices/notificationsSlice";
import { emitEvent } from "@/services/socketEmitter";

export default function Navbar() {
  const { t } = useTranslation();
  const [searchVal, setSearchVal] = useState("");
  const { notifications: reduxNotification } = useSelector(
    (state) => state?.notifications
  );
  const notificationsdata = reduxNotification?.data;

  const isAllNotificationRead = notificationsdata?.some(
    (item) => item?.status !== "READ"
  );
  const { response: notificationCountResponse, error: notificationCountError } =
    useSocketListener("unread_notification_count");
  const { response: notificationResponse, error: notificationError } =
    useSocketListener("notification");
  const { data: profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  useEffect(() => {
    if (notificationResponse) {
      dispatch(
        extendOrUpdateExisting({
          key: "notification",
          payload: notificationResponse,
        })
      );
    }
  }, [notificationResponse]);
  useEffect(() => {
    if (notificationsdata?.length > 0) {
      dispatch(
        update({
          notification: notificationsdata,
        })
      );
    }
  }, [notificationsdata]);
  const [notificationDropdownAnchorEl, setNotificationDropdownAnchorEl] =
    useState(null);
  const notificationDropdownOpen = Boolean(notificationDropdownAnchorEl);

  const handleInputChange = (value) => {
    setSearchVal(value);
  };
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{
        width: "100%",
        // height: "76px",
        borderBottom: "8px solid #F0F0F0",
        padding: {
          // xs: "8px 24px",
          md: "20px 32px",
        },
      }}
    >
      {/* <Box sx={{ flex: 1, width: "50%" }}>
        <Input
          value={searchVal}
          handleChange={handleInputChange}
          placeholder={t("components_layout_navbar_index.ابحث_عن_عنصر")}
          type="text"
          disabled={false}
          startIcon="/images/icons/search.svg"
          name="searrchVal"
          customStyle={{ width: "65%" }}
          inputStyle={{
            fontSize: "12px",
            padding: "4px",
            maxHeight: "64px",
            backgroundColor: "#F5F5F5",
          }}
        />
      </Box> */}

      <Box
        sx={{
          flex: 1,
          width: "50%",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gap: {
            xs: "6px",
            md: "24px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            backgroundColor: "#F5F5F5",
            borderRadius: "12px",
            padding: "8px",
            // boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {/* User Image */}
          {/* <Box
            component="img"
            src="/images/icons/Ellipse.svg"
            alt="User Avatar"
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          /> */}
          <img
            src={
              profile?.data?.profileImage ??
              profile?.data?.provider?.companyProfileImage ??
              profile?.data?.companyProfileImage ??
              "/images/icons/Ellipse.svg"
            }
            style={{ borderRadius: "15px" }}
            width="44px"
            height="44px"
          />
          {/* User Details */}
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#000",
                ml: 2,
              }}
            >
              {profile?.data?.name}{" "}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#6C757D",
              }}
            >
              {profile?.data?.role?.name}{" "}
            </Typography>
          </Box>
        </Box>
        {/* <Box
          sx={{
            border: "1px solid #D6D9E1",
            padding: "8px 8px",
            borderRadius: "100px",
            alignItems: "center",
            display: {
              xs: "block",
              md: "none",
            },
            cursor: "pointer",
          }}
        >
          <img
            src="/images/icons/user-card.svg"
            style={{ display: "block", margin: "auto" }}
            width="44px"
            height="44px"
          />
        </Box> */}
        {/* <Box
          component="img"
          src="/images/icons/notification.svg"
          alt="notification"
          sx={{
            width: 35,
            height: 35,
            borderRadius: "50%",
            objectFit: "cover",
            cusrsor: "pointer",
          }}
        /> */}
        <Box
          onClick={(e) => {
            dispatch(getAllnotifications());
            setNotificationDropdownAnchorEl(e.currentTarget);
            emitEvent("deliver_notification");
          }}
          sx={{
            cursor: "pointer",
            // display: {
            //   xs: "none",
            //   md: "flex",
            // },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: { xs: "30px", md: "60px" },
            width: { xs: "30px", md: "60px" },
            mr: { xs: "auto", md: "0" },
            borderRadius: "50%",
            backgroundColor: notificationDropdownOpen
              ? "#ffffff"
              : isAllNotificationRead
              ? "#00DB81"
              : "#FAFAFAB2",
            transition: "background-color 0.5s ease",
          }}
        >
          <Badge
            invisible={false}
            badgeContent={notificationCountResponse?.count}
            sx={{
              position: "relative",
              "& .MuiBadge-badge": {
                color: "#ffffff",
                backgroundColor: "#BD7611 !important", // Replace with your desired color
                position: "absolute",
                right: "6px",
                top: "6px",
              },
            }}
          >
            <Box
              component="img"
              src={
                // notification.length > 0
                reduxNotification?.length > 0
                  ? "/images/icons/notification.svg"
                  : "/images/icons/notification.svg"
              }
              sx={{
                height: { xs: "20px", md: "40px" },
                width: { xs: "20px", md: "40px" },
              }}
            />
          </Badge>
        </Box>

        <Popover
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "0 16px 16px 0 !important",
            },
            mt: "10px",
            // "& .MuiPaper-root": {
            //   overflowY: "auto", // Ensures scrollability
            // },
            "& .MuiPaper-root::-webkit-scrollbar": {
              width: "4px", // Set scrollbar width
            },
            "& .MuiPaper-root::-webkit-scrollbar-thumb": {
              backgroundColor: "var(--empress_teal)", // Thumb color
              // borderRadius: "10px", // Rounded corners for the scrollbar thumb
              height: "50px", // Set the length of the scrollbar thumb
            },
            "& .MuiPaper-root::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "var(--shrub_green)", // Darker on hover
            },
            "& .MuiPaper-root::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1", // Track color
            },
          }}
          open={notificationDropdownOpen}
          anchorEl={notificationDropdownAnchorEl}
          onClose={() => {
            setNotificationDropdownAnchorEl(null);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Notifications
            usage="popup"
            setNotificationDropdownAnchorEl={setNotificationDropdownAnchorEl}
            containerStyle={{
              p: 3,
            }}
          />
        </Popover>
      </Box>
    </Box>
  );
}
