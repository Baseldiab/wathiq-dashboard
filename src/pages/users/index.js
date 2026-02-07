import { useTranslation } from "next-i18next";
import { styles } from "@/components/globalStyle";
import TabItem from "@/components/tab-item";
import { Backdrop, Box, Typography } from "@mui/material";
import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/button";
import FilterMenu from "@/components/filter-menu";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import User from "@/components/users/user";
import Agencies from "@/components/users/agencies";
import CustomSnackbar from "@/components/toastMsg";
import Loader from "@/components/loader";
import SendNotification from "@/components/corporate/contracting-corporates/popup/send-notification";
import {
  FiltergetAllusers,
  getAllusers,
  notifyAllusers,
} from "@/Redux/slices/userSlice";
import Input from "@/components/inputs";
import { buildQueryParams, hasRole } from "@/services/utils";
import FilterDropDown from "@/components/inputs/drop-down-filter";
import AuctionsRequest from "@/components/users/user/auctions-request";

export default function Users() {
  const { t } = useTranslation();
  const tabItems = [
    { text: t("pages_users_index.المستخدمين"), id: 1, role: ["get users"] },
    { text: "الوكالات ", id: 2, role: ["manage agencies"] },
    { text: "طلبات المزادات", id: 3, role: ["review auction"] },
  ];
  const [selectedItem, setSelectedItem] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [alert, setAlert] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [filterData, setFilterData] = useState({});
  const {
    notifyAllusersLoading,
    All_Loading,
    usersFilterData,
    usersFilterLoading,
    usersFilterError,
  } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchNameQuery, setSearchNameQuery] = useState("");
  const [isNameDropdownOpen, setIsNameDropdownOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const filteredTabItems = tabItems.filter(
    (item) => !item.role || hasRole(item.role)
  );
  useEffect(() => {
    if (filteredTabItems.length === 0) {
      router.push("/");
    } else if (!filteredTabItems.find((tab) => tab.id === selectedItem)) {
      setSelectedItem(filteredTabItems[0].id);
    }
  }, [filteredTabItems.length]);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleItemChange = (id) => {
    setSelectedItem(id);
  };
  const handleSubmitFilter = () => {
    handleCloseMenu();
    dispatch(getAllusers(buildQueryParams({ ...filterData })));
  };
  const handleFilterChange = (value, name) => {
    setFilterData({ ...filterData, [name]: value });
    if (name === "number") {
      setSearchQuery(event.target.value);
      setIsDropdownOpen(true);
    }
    if (name === "name") {
      setSearchNameQuery(event.target.value);
      setIsNameDropdownOpen(true);
    }
  };
  const handleResetData = () => {
    handleCloseMenu();
    setFilterData({});
    setSearchNameQuery("");
    setSearchQuery("");
    setIsNameDropdownOpen(false);
    setIsDropdownOpen(false);
    dispatch(getAllusers(buildQueryParams({ page: 1 })));
  };
  const handlePhoneClick = (phone) => {
    handleFilterChange(phone, "number");
    setSearchQuery(phone);
    setIsDropdownOpen(false);
  };
  const handleNameClick = (name) => {
    handleFilterChange(name, "name");
    setSearchNameQuery(name);
    setIsNameDropdownOpen(false);
  };
  const PhoneOptions = useMemo(() => {
    return usersFilterData?.data?.map((item) => item.phoneNumber.number) || [];
  }, [usersFilterData]);
  const filteredPhones = useMemo(() => {
    if (!debouncedQuery) return PhoneOptions;
    return PhoneOptions.filter(
      (phone) => phone.toLowerCase().includes(debouncedQuery.toLowerCase()) // Case-insensitive search
    );
  }, [PhoneOptions, debouncedQuery]);
  const NameOptions = useMemo(() => {
    return usersFilterData?.data?.map((item) => item.name) || []; // Get all user names
  }, [usersFilterData]);

  const filteredNames = useMemo(() => {
    if (!searchNameQuery) return NameOptions;
    return NameOptions.filter(
      (name) => name.toLowerCase().includes(searchNameQuery.toLowerCase()) // Case-insensitive search for names
    );
  }, [NameOptions, searchNameQuery]);
  // useEffect(() => {
  //   if (router.query.mainTab) {
  //     setSelectedItem(Number(router.query.mainTab));
  //   }
  // }, [router.query.mainTab]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);
  useEffect(() => {
    // if (router.query.mainTab || router.query.subTab) {
    //   router.replace("/users", undefined, { shallow: true });
    // }
    dispatch(FiltergetAllusers());
  }, []);

  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <User filterData={filterData} />;
      case 2:
        return <Agencies />;
      case 3:
        return <AuctionsRequest />;
      default:
        break;
    }
  };
  // useEffect(() => {
  //   if (!notifyAllusersLoading) {
  //     const timer = setTimeout(() => setLoading(false), 200);
  //     return () => clearTimeout(timer);
  //   } else {
  //     setLoading(true);
  //   }
  // }, [notifyAllusersLoading]);
  const handleNotification = async (formData) => {
    try {
      await dispatch(
        notifyAllusers({
          data: {
            title: { ar: formData.title },
            message: { ar: formData.msg },
          },
        })
      ).unwrap();
      setAlert({
        msg: t("pages_users_index.تم_ارسال_الاشعار_بنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      handleClose();
    } catch (error) {
      console.log(error);

      setAlert({ msg: error, type: "error" });
      setAlertOpen(true);
    }
  };

  if (notifyAllusersLoading) return <Loader open={true} />;
  return (
    <>
      <Head>
        <title>{t("pages_users_index.إدارة_المستخدمين")}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#202726",
            mb: { xs: "16px", md: "24px" },
          }}
        >
          إدارة المستخدمين{" "}
        </Typography>
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
                border: "1px solid #D6D9E1",
                display: "flex",
                justifyContent: "start",
                width: "fit-content",
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
            <Box
              sx={{
                flex: 1,
                flex: "none",
                display: "flex",
                gap: "12px",
              }}
            >
              {selectedItem == 1 && (
                <>
                  {hasRole("send notification") && (
                    <Button
                      handleClick={handleOpen}
                      text=" إرسال إشعار"
                      type="send_notification"
                    />
                  )}
                  <Box
                    id="basic-button"
                    aria-controls={menuOpen ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? "true" : undefined}
                  >
                    <Button
                      customeStyle={{
                        background: "#FFFFFF",
                        border: "1px solid #D6D9E1",
                        color: "#202726",
                        "&:hover": {
                          background: "#FFFFFF",
                          border: "1px solid #D6D9E1",
                          boxShadow: "none",
                        },
                      }}
                      handleClick={handleOpenMenu}
                      text={t("pages_users_index.تصفية")}
                      type="filter"
                    />

                    {/*  */}
                    <FilterMenu
                      anchorEl={anchorEl}
                      menuOpen={menuOpen}
                      handleCloseMenu={handleCloseMenu}
                      title={t("pages_users_index.تصفية")}
                      onCloseIconClick={handleCloseMenu}
                      handleSubmitFilter={handleSubmitFilter}
                      handleResetData={handleResetData}
                    >
                      {/* custom dynamic content */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Input
                          label={t("pages_users_index.إسم_المستخدم")}
                          placeholder="إدخل الاسم "
                          handleChange={handleFilterChange}
                          value={filterData?.name || ""}
                          name="name"
                          customStyle={{ width: "100%" }}
                          inputProps={{
                            autoComplete: "off",
                          }}
                        />
                        {isNameDropdownOpen && searchNameQuery && (
                          <FilterDropDown
                            filteredNames={filteredNames}
                            handleClick={handleNameClick}
                          />
                        )}

                        <Input
                          label={t("pages_users_index.رقم_الهاتف")}
                          placeholder=" ادخل رقم الهاتف"
                          value={searchQuery}
                          name="number"
                          handleChange={handleFilterChange}
                          customStyle={{
                            width: "100%",
                          }}
                        />
                        {isDropdownOpen && searchQuery && (
                          <FilterDropDown
                            filteredNames={filteredPhones}
                            handleClick={handlePhoneClick}
                          />
                        )}

                        <Input
                          label={t("pages_users_index.الحالة")}
                          placeholder={t("pages_users_index.حدد_الحالة")}
                          type="selectbox"
                          valuesOption={[
                            { name: t("pages_users_index.نشط"), _id: false },
                            { name: t("pages_users_index.غير_نشط"), _id: true },
                          ]}
                          handleChange={handleFilterChange}
                          value={filterData?.blocked}
                          name="blocked"
                          customStyle={{ width: "100%" }}
                        />
                        <Typography textAlign="center" mt={0.5}>
                          تاريخ التسجيل{" "}
                        </Typography>
                        <Input
                          label="من "
                          placeholder={t(
                            "pages_users_index.ادخل_تاريخ_التسجيل"
                          )}
                          value={filterData?.createdAtFrom}
                          handleChange={handleFilterChange}
                          type="date"
                          name="createdAtFrom"
                          customStyle={{ width: "100%" }}
                        />
                        <Input
                          label={t("pages_users_index.الي")}
                          placeholder={t(
                            "pages_users_index.ادخل_تاريخ_التسجيل"
                          )}
                          value={filterData?.createdAtTo}
                          handleChange={handleFilterChange}
                          type="date"
                          name="createdAtTo"
                          customStyle={{ width: "100%" }}
                        />
                      </Box>
                    </FilterMenu>
                    {/*  */}
                  </Box>
                </>
              )}
            </Box>{" "}
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
              <SendNotification
                handleNotification={handleNotification}
                handleClose={handleClose}
              />
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
    </>
  );
}
