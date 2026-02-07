import { useTranslation } from "next-i18next";
import CorMainInfo from "@/components/corporate/main-info";
import CompanyInfo from "@/components/home/companyInfo";
import { updateProfile } from "@/Redux/slices/profileSlice";
import {
  getAllProviders,
  getAnalysisProvider,
  getProvider,
  notifyProvider,
  updateProvider,
} from "@/Redux/slices/providerSlice";
import { Backdrop, Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/button";
import Image from "next/image";
import constants from "@/services/constants";
import { hasRole, setLargeStatusStyle } from "@/services/utils";
import Loader from "@/components/loader";
import ProfileImg from "@/components/image-box/profile-img";
import { useRouter } from "next/router";
import BreadcrumbsNav from "@/components/layout/navbar/bread-crumb-nav";
import Head from "next/head";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import Agencies from "@/components/users/agencies";
import UserInfo from "@/components/users/user/user-info";
import RequestReject from "@/components/corporate/contract-requests/popup/request-reject";
import {
  blockSelectedUser,
  getAllusers,
  getUser,
  notifyAllusers,
  notifySpacificusers,
  unBlockSelectedUser,
} from "@/Redux/slices/userSlice";
// import DialogBox from "@/components/DialogBox";
import UserActivity from "@/components/users/user/user-activity/user-activity";
// import Wallet from "@/components/users/user/wallet";
import SendNotification from "@/components/corporate/contracting-corporates/popup/send-notification";
import CustomSnackbar from "@/components/toastMsg";
import CustomButton from "@/components/button";
import Auction from "@/components/users/user/auctions";
import Wallet from "@/components/wallet";

export default function UserDetails() {
  const { t } = useTranslation();
  const {
    selectedUser,
    All_loading,
    selected_loading,
    notifySpacificusersLoading,
  } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(1);
  const [BlockReason, setBlockReason] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [alert, setAlert] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(true);

  const tabItems = [
    { text: "البيانات الاساسيه ", id: 1 },
    { text: "الوكالات ", id: 2, role: ["manage agencies"] },
    { text: "المزادات ", id: 3, role: ["get auction"] },
    // { text: "النشاطات ", id: 4 },
    { text: "المحفظة ", id: 5 },
  ];
  const dispatch = useDispatch();
  const router = useRouter();

  const handleOpen = (type) => {
    setType(type);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setError("");
    setBlockReason("");
  };

  const handleBlock = async () => {
    console.log(selectedUser);

    if (!BlockReason)
      return setError(t("pages_users_details_[id].يرجى_إدخال_سبب_الرفض"));
    try {
      await dispatch(
        blockSelectedUser({
          data: { reason: BlockReason },
          id: selectedUser?.data?._id,
        })
      ).unwrap();
      await dispatch(getUser(selectedUser?.data?._id)).unwrap();
      await dispatch(getAllusers()).unwrap();
      router.push({
        pathname: `/users/details/${selectedUser?.data?._id}`,
        //   query: { mainTab: 3, subTab: 1 },
      });
      setAlert({
        msg: t("pages_users_details_[id].تم_الحظر_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
      setError(error);
    }
  };
  const handleCloseAgree = async () => {
    setOpenDialog(false);
    try {
      await dispatch(unBlockSelectedUser(selectedUser?.data?._id)).unwrap();
      await dispatch(getUser(selectedUser?.data?._id)).unwrap();
      await dispatch(getAllusers()).unwrap();

      router.push({
        pathname: `/users/details/${selectedUser?.data?._id}`,
        //   query: { mainTab: 3, subTab: 1 },
      });
      setAlert({
        msg: t("pages_users_details_[id].تم_إلغاء_الحظر_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
      setError(error);
    }
  };
  useEffect(() => {
    if (router.query.mainTab) {
      setSelectedItem(Number(router.query.mainTab));
    }
  }, [router.query.mainTab]);
  const handleItemChange = (id) => {
    setSelectedItem(id);
  };
  useEffect(() => {
    if (!All_loading && !selected_loading && !notifySpacificusersLoading) {
      const timer = setTimeout(() => setLoading(false), 200);
      return () => clearTimeout(timer);
    } else {
      setLoading(true);
    }
  }, [All_loading, selected_loading, notifySpacificusersLoading]);
  const filteredTabItems = tabItems.filter(
    (item) => !item.role || hasRole(item.role) // Show if no role restriction or user has the required role
  );
  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <UserInfo />;
      case 2:
        return <Agencies user={true} />;
      case 3:
        return <Auction selectedUser={selectedUser} />;
      // case 4:
      //   // return <UserActivity />;
      //   return t("pages_users_details_[id].النشاطات") ;
      case 5:
        return <Wallet type="user" selectedUser={selectedUser} />;
      //   return t("pages_users_details_[id].المحفظه");

      default:
        break;
    }
  };
  const showBackDropContent = () => {
    switch (type) {
      case "blockUser":
        return (
          <RequestReject
            handleClose={handleClose}
            setRejectReason={setBlockReason}
            handleReject={handleBlock}
            error={error}
            setError={setError}
            type="blockUser"
          />
        );
      case "send-notification":
        return (
          <SendNotification
            handleNotification={handleNotification}
            handleClose={handleClose}
          />
        );
      case "un_block":
        return (
          <Box sx={{ ...styles.popupContainer, alignItems: "center" }}>
            <Typography sx={{ fontSize: "1rem", color: "#6F6F6F" }}>
              {t("pages_users_details_[id].هل_انت_متأكد_من")}
            </Typography>
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                gap: "24px",
                width: "100%",
              }}
            >
              {" "}
              <CustomButton
                customeStyle={{
                  width: "50%",
                  background: "transparent",
                  color: "#6F6F6F",
                  fontWeight: 700,
                  border: "1px solid #D6D9E1",
                  "&:hover": {
                    background: "transparent",
                    color: "#6F6F6F",
                    boxShadow: "none",
                  },
                }}
                handleClick={handleClose}
                text={t("pages_users_details_[id].إغلاق")}
                type="close"
              />
              <CustomButton
                customeStyle={{
                  width: "50%",
                  background: "#023936",
                  color: "#ffff",
                  fontWeight: 700,
                  border: "1px solid #D6D9E1",
                  "&:hover": {
                    background: "#023936",
                    color: "#ffff",
                    boxShadow: "none",
                  },
                }}
                handleClick={handleCloseAgree}
                text={t("pages_users_details_[id].تاكيد")}
                // type=""
              />
            </Box>
          </Box>
        );
      case "reason":
        return (
          <Box sx={{ ...styles.popupContainer, alignItems: "start" }}>
            <Typography
              sx={{
                fontSize: "1.3rem",
                color: "#161008",
                fontWeight: 700,
              }}
            >
              سبب الحظر{" "}
            </Typography>
            <Typography sx={{ fontSize: "1rem", color: "#6F6F6F" }}>
              {selectedUser?.data?.blocked?.reason}{" "}
            </Typography>
            <CustomButton
              customeStyle={{
                width: "50%",
                background: "transparent",
                color: "#6F6F6F",
                fontWeight: 700,
                border: "1px solid #D6D9E1",
                "&:hover": {
                  background: "transparent",
                  color: "#6F6F6F",
                  boxShadow: "none",
                },
              }}
              handleClick={handleClose}
              text={t("pages_users_details_[id].إغلاق")}
              type="close"
            />
          </Box>
        );

      default:
        break;
    }
  };
  const handleNotification = async (formData) => {
    try {
      await dispatch(
        notifySpacificusers({
          data: {
            title: { ar: formData.title },
            message: { ar: formData.msg },
            recipient: selectedUser?.data?._id,
          },
        })
      ).unwrap();
      setAlert({
        msg: t("pages_users_details_[id].تم_ارسال_الاشعار_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
    }
  };
  if (loading) return <Loader open={true} />;
  return (
    <>
      <Head>
        <title> تفاصيل المستخدم {selectedUser?.data?.name}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Box>
        <Box>
          <BreadcrumbsNav
            title={t("pages_users_details_[id].تفاصيل_المستخدم")}
            links={[
              {
                href: "/users",
                label: t("pages_users_details_[id].إدارة_المستخدمين"),
              },
            ]}
            currentText={selectedUser?.data?.name}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            // justifyContent: "space-between",
            justifyContent: "flex-end",
            alignItems: "center",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 2,
            mt: 4,
            mb: 4,
          }}
        >
          {!selectedUser?.data?.blocked?.value &&
            hasRole("send notification") && (
              <Box
                component="img"
                src="/images/icons/notification-2.svg"
                sx={{
                  background: constants.colors.secondary,
                  padding: "8px",
                  border: "1px solid #D6D9E1",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
                onClick={() => handleOpen("send-notification")}
              />
            )}
          {(selectedUser?.data?.blocked?.value
            ? hasRole("unblock user")
            : hasRole("block user")) && (
            <Typography
              onClick={() => {
                selectedUser?.data?.blocked?.value
                  ? handleOpen("un_block")
                  : handleOpen("blockUser");
              }}
              sx={{
                ...setLargeStatusStyle(
                  selectedUser?.data?.blocked?.value
                    ? t("pages_users_details_[id].إلغاء_الحظر")
                    : t("pages_users_details_[id].حظر")
                ),
              }}
            >
              {selectedUser?.data?.blocked?.value
                ? t("pages_users_details_[id].إلغاء_الحظر")
                : t("pages_users_details_[id].حظر_المستخدم")}
            </Typography>
          )}

          {selectedUser?.data?.blocked?.value && (
            <CustomButton
              customeStyle={{
                background: "transparent",
                border: "1px solid #D32F2F",
                color: "#D32F2F",
                fontWeight: 700,
                "&:hover": {
                  background: "transparent",
                  boxShadow: "none",
                },
              }}
              handleClick={() => {
                handleOpen("reason");
              }}
              text={t("pages_users_details_[id].سبب_الحظر")}
            />
          )}
        </Box>
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
            {filteredTabItems.map((item) => (
              <TabItem
                item={item}
                selectedItem={selectedItem}
                handleItemChange={handleItemChange}
              />
            ))}
          </Box>
        </Box>
        <Box>{showBoxContent()}</Box>
        <Backdrop open={open} onClick={handleClose} sx={{ zIndex: "100000" }}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxHeight: "85%",
              overflow: "auto",
              bgcolor: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: 3,
              width: {
                xs: "90%",
                sm: "80%",
                md: "60%",
                lg: "45%",
                xl: "30%",
              },
            }}
          >
            {showBackDropContent()}{" "}
          </Box>
        </Backdrop>
        <CustomSnackbar
          type={alert.type}
          open={alertOpen}
          setOpen={setAlertOpen}
          message={alert.msg}
        />
      </Box>
    </>
  );
}
