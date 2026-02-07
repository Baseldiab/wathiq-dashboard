import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useRouter } from "next/router";
import { socketEmitter } from "@/services/socketEmitter";
import { emitEvent, disconnectSocket, socket } from "@/services/socketEmitter"; // ✅ Import correctly

import {
  extendOrUpdateExisting,
  getAllnotifications,
  updateAll,
} from "@/Redux/slices/notificationsSlice";
import { store } from "@/Redux/store/store";
import Loader from "./loader";
import CustomButton from "./button";

export default function Notifications({
  usage,
  containerStyle,
  setNotificationDropdownAnchorEl,
}) {
  //   const { emitEvent } = socketEmitter();
  const dispatch = useDispatch();

  const router = useRouter();
  const currentUrl = router.asPath;
  const { notifications, loading } = useSelector(
    (state) => state.notifications
  );
  const notificationsdata = notifications?.data;
  const isAllNotificationRead = notificationsdata?.some(
    (item) => item?.status !== "READ"
  );
  useEffect(() => {
    socket.on("notification", () => {
      dispatch(getAllnotifications());
    });
    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    !loading && (
      <Box
        sx={{
          // width: "1000px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          ...containerStyle,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* {loading && <Loader open={true} />} */}

          <Box
            sx={{
              color: "#202726",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            الإشعارات
          </Box>
          {notificationsdata?.length > 0 && (
            <>
              <Box
                sx={{
                  mr: { xs: "initial", sm: "auto" },
                  display: "flex",
                }}
              >
                <IconButton
                  disableRipple
                  // disabled={!isAllNotificationRead}
                  sx={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "var(--empress_teal)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    mb: { xs: "20px", sm: "0" },
                  }}
                  onClick={() => {
                    emitEvent("read_all_notification");

                    dispatch(
                      updateAll({
                        mainKey: "notification",
                        key: "status",
                        value: "READ",
                      })
                    );
                    dispatch(getAllnotifications());
                  }}
                >
                  <Box
                    sx={{
                      color: !isAllNotificationRead ? "#6F6F6F" : "#22A06B",
                    }}
                  >
                    وضع علامة على الكل كمقروء
                  </Box>
                  <DoneAllIcon
                    sx={{
                      color: !isAllNotificationRead ? "#292927" : "#22A06B",

                      fontSize: { xs: "30px", sm: "35px" },
                    }}
                  />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
        {notificationsdata?.length > 0 && (
          <>
            {notificationsdata?.map((notification) => (
              <Box
                onClick={() => {
                  dispatch(getAllnotifications());

                  dispatch(
                    extendOrUpdateExisting({
                      key: "notification",
                      payload: { ...notification, status: "READ" },
                    })
                  );

                  emitEvent("read_notification", {
                    notificationId: notification._id,
                  });
                }}
                sx={{
                  bgcolor: notification.status !== "READ" ? "#0239360D" : "",
                  p: "16px",
                  borderRadius: "16px",
                  "&:hover": {
                    cursor: "pointer",
                    bgcolor: "#E1ECF9",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "space-between",
                  }}
                >
                  <Box component="img" src="images/icons/notification-icon.svg" width={45}/>
                  <Box>
                    <Box
                      sx={{
                        color: "#202726",
                        fontSize: "1.1rem",
                        fontWeight: "700",
                        mt:1
                      }}
                    >
                      {notification.title}
                    </Box>
                    <Box
                      sx={{
                        color: "#202726",
                        fontSize: ".75rem",
                        fontWeight: "500",
                      }}
                    >
                      {notification.date}
                    </Box>
                  </Box>
                  <DoneAllIcon
                    sx={{
                      mr: "auto",
                      color:
                        notification.status !== "READ" ? "#292927" : "#22A06B",
                      fontSize: { xs: "20px", sm: "25px" },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#6F6F6F",
                    mt: "10px",
                  }}
                >
                  {notification.message}
                </Box>
              </Box>
            ))}
            {usage === "popup" && (
              <CustomButton
                // className="CustomButton"
               customeStyle={{
                  width: "100%",
                  // background: "#22A06B",
                  // "&:hover": {
                  //   background: "#22A06B",
                  // },
                }}
                handleClick={() => {
                  router.push("/notifications");
                  setNotificationDropdownAnchorEl(null);
                }}
                text={" كل الاشعارات"}
              >
              </CustomButton>
            )}
          </>
        )}
        {!notificationsdata?.length > 0 > 0 && !loading && (
          <Box
            component="img"
            src="/images/icons/no-notifications.svg"
            sx={{
              width: { xs: "200px", sm: "300px" },
              alignSelf: "center",
            }}
          />
        )}
      </Box>
    )
  );
}
