import { useTranslation } from "next-i18next";
import { styles } from "@/components/globalStyle";
import { Backdrop, Box, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import TabItem from "@/components/tab-item";
import CustomButton from "@/components/button";
import FilterMenu from "@/components/filter-menu";

import AuctionTable from "../auction-table";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getSetting, updateSetting } from "@/Redux/slices/settingSlice";
import CustomSnackbar from "@/components/toastMsg";
import { hasRole } from "@/services/utils";
import Input from "@/components/inputs";
import Loader from "@/components/loader";
import PopupTitle from "@/components/popup-title";

export default function OnPlatform() {
  const { t } = useTranslation();
  const tabItems = [
    {
      text: t("components_auctions-tabs_on-platform_index.مزادات_خاصة"),
      id: 1,
    },
    { text: t("components_auctions-tabs_on-platform_index.هيئة_إنفاذ"), id: 2 },
  ];
  const childTabs = {
    1: [
      { text: t("components_auctions-tabs_on-platform_index.مستقبلية"), id: 1 },
      { text: t("components_auctions-tabs_on-platform_index.قائمة"), id: 2 },
      { text: t("components_auctions-tabs_on-platform_index.منتهية"), id: 3 },
      { text: t("components_auctions-tabs_on-platform_index.متوقفة"), id: 4 },
    ],
    2: [
      { text: t("components_auctions-tabs_on-platform_index.مستقبلية"), id: 1 },
      { text: t("components_auctions-tabs_on-platform_index.قائمة"), id: 2 },
      { text: t("components_auctions-tabs_on-platform_index.منتهية"), id: 3 },
      { text: t("components_auctions-tabs_on-platform_index.متوقفة"), id: 4 },
    ],
  };
  const { data: profile } = useSelector((state) => state.profile);
  const [selectedItem, setSelectedItem] = useState(1);
  const [selectedChildItem, setSelectedChildItem] = useState(1);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const {
    setting,
    loading: settingLoading,
    error: settingError,
  } = useSelector((state) => state.setting);
  const [time, setTime] = useState(0);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({});
  const [defaultTime, setDefaultTime] = useState(0);

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const router = useRouter();
  // Handle main tab change
  const handleItemChange = (id) => {
    setSelectedItem(id);
    setSelectedChildItem(1); // Reset child tab when main tab changes
  };

  // Handle child tab change
  const handleChildChange = (id) => {
    setSelectedChildItem(id);
  };

  const handleInputChange = (value, name) => {
    if (/^\d*$/.test(value)) {
      setTime(value);
    }
    setError("");
  };
  useEffect(() => {
    const isAuthority = selectedItem === 2;
    const extractedTime = isAuthority
      ? setting?.data?.authorityAuctionExtraTime
      : setting?.data?.privateAuctionExtraTime;

    setTime(extractedTime || 0);
    setDefaultTime(extractedTime || 0);
  }, [selectedItem]);
  const renderedChildComponent = useMemo(() => {
    if (selectedChildItem === 1)
      return (
        <AuctionTable
          status="in_progress"
          specialToSupportAuthority={selectedItem == 2 ? "true" : "false"}
          reviewStatus="approved"
        />
      );
    if (selectedChildItem === 2)
      return (
        <AuctionTable
          status="on_going"
          specialToSupportAuthority={selectedItem == 2 ? "true" : "false"}
          reviewStatus="approved"
        />
      );
    if (selectedChildItem === 3)
      return (
        <AuctionTable
          status="completed"
          specialToSupportAuthority={selectedItem == 2 ? "true" : "false"}
          reviewStatus="approved"
        />
      );
    if (selectedChildItem === 4)
      return (
        <AuctionTable
          status="canceled"
          specialToSupportAuthority={selectedItem == 2 ? "true" : "false"}
          reviewStatus="approved"
        />
      );
    return null;
  }, [selectedChildItem, selectedItem]);
  const renderedComponent = useMemo(() => {
    return (
      <>
        <Box
          sx={{
            ...styles.tabsItemContainer,
            mb: 2,
          }}
        >
          {(childTabs[selectedItem] || []).map((item) => (
            <TabItem
              key={item.id}
              item={item}
              selectedItem={selectedChildItem}
              handleItemChange={handleChildChange}
            />
          ))}
        </Box>
        <Box>{renderedChildComponent}</Box>
      </>
    );
  }, [selectedItem, selectedChildItem]);
  const handleSubmit = async () => {
    if (!time) {
      setError("يرجى إدخال الوقت");
      return;
    }

    const isAuthority = selectedItem === 2;

    let payload = {
      [isAuthority ? "authorityAuctionExtraTime" : "privateAuctionExtraTime"]:
        time,
    };

    const response = await dispatch(updateSetting(payload));

    if (response?.meta?.requestStatus === "fulfilled") {
      setAlert({ msg: "تم التحديث بنجاح", type: "success" });
      setOpenAlert(true);
      setOpen(false);
      await dispatch(getSetting());
    } else {
      setAlert({ msg: settingError || "حدث خطأ", type: "error" });
      setOpenAlert(true);
      setOpen(false);
      setTime(defaultTime);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setTime(defaultTime);
    setError("");
  };
  const showBackDropContent = () => {
    return (
      <Box
        sx={{ ...styles.popupContainer, alignItems: "start", border: "none" }}
      >
        <PopupTitle
          title="التحكم اليدوي في وقت المزاد"
          handleClose={handleClose}
        />
        <Typography>
          أضف المدة المراد تمديدها عن طريق التحكم اليدوي في وقت المزاد
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Input
            label="الوقت"
            value={time}
            handleChange={handleInputChange}
            placeholder="حدد مدة الوقت بالدقيقة"
            type="text"
            name="time"
            customStyle={{ width: "100%" }}
            error={error}
            endIcon={
              <Typography sx={{ color: "#555", fontSize: "0.9rem", ml: 0.5 }}>
                دقيقة
              </Typography>
            }
          />
        </Box>
        <Box
          sx={{
            ...styles.popupBtnsContainer,
          }}
        >
          <CustomButton
            customeStyle={{
              width: "100%",

              fontWeight: 700,
            }}
            handleClick={handleSubmit}
            text={settingLoading ? "...جاري التحميل" : "حفظ"}
          />
        </Box>
      </Box>
    );
  };
  // if (settingLoading) return <Loader open={true} />;

  return (
    <Box
      sx={{
        ...styles.boxData,
        border: "1px solid #D6D9E1",
        minHeight: "350px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          ...styles.dataSpaceBetween,
        }}
      >
        <Box
          sx={{
            ...styles.tabsItemContainer,
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
        <Box
          sx={{
            flex: 1,
            flex: "none",
            display: "flex",
            gap: "12px",
          }}
        >
          {selectedChildItem === 2 && hasRole("update setting") && (
            <CustomButton
              text={"إعدادات وقت المزاد"}
              type="add"
              handleClick={() => setOpen(true)}
            />
          )}
        </Box>{" "}
      </Box>
      <Box>{renderedComponent}</Box>
      {hasRole(["update setting"]) && (
        <Backdrop open={open} onClick={handleClose} sx={{ zIndex: "99" }}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxHeight: "85%",
              overflow: "auto",
              bgcolor: "white",
              borderRadius: "12px",
              // padding: "20px",
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
            {showBackDropContent()}
          </Box>
        </Backdrop>
      )}
      <CustomSnackbar
        type={alert.type}
        open={openAlert}
        setOpen={setOpenAlert}
        message={alert.msg}
      />
    </Box>
  );
}
