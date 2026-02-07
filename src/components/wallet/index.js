import {
  Box,
  Card,
  Typography,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  Backdrop,
} from "@mui/material";
import { useEffect, useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";
import TransctionHistory from "./transaction_history";
import TabItem from "@/components/tab-item";
import CustomButton from "@/components/button";
import constants from "@/services/constants";
import ChargeWalletDialog from "./withdrawPopup";
import {
  addBalance,
  getUserWallet,
  getWallet,
} from "@/Redux/slices/walletSlice";
import CustomSnackbar from "@/components/toastMsg";
import { useDispatch, useSelector } from "react-redux";
import { formatNumber, hasRole } from "@/services/utils";
import Loader from "@/components/loader";
import PaymentOrigin from "./Payment_origin";
import HeldAmount from "./Held_amount";
import Withdrawal_Requests from "./Withdrawal_Requests";
import AuctionWinner from "./Deposite_Type/index";
import User_withDrwar from "./User-withdrwar";
import { styles } from "../globalStyle";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Input from "@/components/inputs";
import { getSetting, updateSetting } from "@/Redux/slices/settingSlice";
import SAR from "../sar";
import PopupTitle from "../popup-title";

const Wallet = ({ type, selectedUser }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [alertOpen, setAlertOpen] = useState(false);
  const [amountError, setAmountError] = useState("");
  const { data: profile } = useSelector((state) => state.profile);
  const [openSettings, setOpenSettings] = useState(false); // مودال الرسوم الإدارية
  const {
    setting,
    loading: settingLoading,
    error: settingError,
  } = useSelector((state) => state.setting);

  const [myWithdrawalFee, setWithdrawalFee] = useState(0);
  const [error, setError] = useState("");
  const [defaultWithdrawalFee, setDefaultWithdrawalFee] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);

  const {
    walletBalance,
    loadingBalance,
    loading,
    userWallet,
    loadinguserWallet,
  } = useSelector((state) => state.wallet);

  const dispatch = useDispatch();

  const handleConfirm = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setAmountError(t("components_wallet_index.الرجاء_إدخال_مبلغ_صالح"));
      return;
    }

    try {
      await dispatch(addBalance({ balance: amount })).unwrap();
      setAlert({
        msg: t("components_wallet_index.تم_الشحن_بالنجاح"),
        type: "success",
      });
      setAlertOpen(true);
      setAmount("");
      setAmountError("");
      setOpen(false);
    } catch (error) {
      setAlert({
        msg: t("components_wallet_index.حدث_خطأ_أثناء_الشحن"),
        type: "error",
      });
      setAlertOpen(true);
    }
  };

  useEffect(() => {
    if (type === "admin") {
      dispatch(getWallet());
    } else if (type === "user") {
      dispatch(getUserWallet({ userId: selectedUser.data._id }));
    }
  }, [type, dispatch, selectedUser?.data?._id]);

  useEffect(() => {
    if (!setting) {
      dispatch(getSetting());
    }
  }, [dispatch, setting]);

  // تحميل قيمة الرسوم في الحقول عند توفر الإعدادات
  useEffect(() => {
    if (setting?.data?.withdrawalFee !== undefined) {
      setWithdrawalFee(String(setting.data.withdrawalFee));
      setDefaultWithdrawalFee(setting.data.withdrawalFee);
    }
  }, [setting]);
  const tabItems =
    type === "user"
      ? [
          { text: t("components_wallet_index.المعاملات"), id: 1 },
          { text: t("components_wallet_index.المسحوبات"), id: 2 },
          { text: t("components_wallet_index.المبالغ_المحجوزة"), id: 3 },
        ]
      : [
          !profile?.data?.employeeType && {
            text: t("components_wallet_index.شحن_المحفظه"),
            id: 1,
          },
          hasRole(["get withdraws", "update withdraw"]) && {
            text: t("components_wallet_index.المسحوبات"),
            id: 2,
          },
          profile?.data?.type === "admin" && {
            text: t("components_wallet_index.عرابين_المزادات"),
            id: 3,
          },
          !profile?.data?.employeeType && {
            text: t("components_wallet_index.الصكوك"),
            id: 4,
          },
        ].filter(Boolean);

  const [selectedItem, setSelectedItem] = useState(tabItems[0]?.id || null);
  useEffect(() => {
    const visibleIds = tabItems.map((t) => t.id);
    if (!visibleIds.includes(selectedItem)) {
      setSelectedItem(tabItems[0]?.id ?? null);
    }
  }, [tabItems, selectedItem]);
  const handleItemChange = (id) => setSelectedItem(id);

  const handleRefresh = () => {
    if (type === "admin") {
      dispatch(getWallet());
    } else if (type === "user") {
      dispatch(getUserWallet({ userId: selectedUser.data._id }));
    }
  };

  const showBoxContent = () => {
    if (type === "admin") {
      switch (selectedItem) {
        case 1:
          return (
            <TransctionHistory type={type} walletBalance={walletBalance} />
          );
        case 2:
          return <Withdrawal_Requests />;
        case 3:
          return <AuctionWinner />;
        case 4:
          return <PaymentOrigin />;
        default:
          return null;
      }
    } else {
      switch (selectedItem) {
        case 1:
          return (
            <TransctionHistory
              type={type}
              walletBalance={userWallet}
              selectedUser={selectedUser}
            />
          );
        case 2:
          return <User_withDrwar selectedUser={selectedUser} />;
        case 3:
          return <HeldAmount selectedUser={selectedUser} />;
        default:
          return null;
      }
    }
  };

  // Handlers للرسوم الإدارية
  const handleInputChange = (value /*, name */) => {
    if (/^\d*$/.test(value)) {
      setWithdrawalFee(value);
    }
    setError("");
  };

  const handleSubmitSettings = async () => {
    if (
      myWithdrawalFee === "" ||
      myWithdrawalFee === null ||
      myWithdrawalFee === undefined
    ) {
      setError("يرجى إدخال الرسوم");
      return;
    }
    const payload = { withdrawalFee: Number(myWithdrawalFee) };
    const response = await dispatch(updateSetting(payload));

    if (response?.meta?.requestStatus === "fulfilled") {
      await dispatch(getSetting());
      setAlert({ msg: "تم التحديث بنجاح", type: "success" });
      setAlertOpen(true);
      setOpenSettings(false);
    } else {
      setAlert({ msg: settingError || "حدث خطأ", type: "error" });
      setAlertOpen(true);
      setOpenSettings(false);
      setWithdrawalFee(defaultWithdrawalFee);
    }
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
    setWithdrawalFee(defaultWithdrawalFee);
    setError("");
  };
  const balance =
    type === "admin" ? walletBalance?.data?.balance : userWallet?.data?.balance;
  if (loading) return <Loader open={true} />;

  return (
    <Box
      sx={{
        width: "100%",
        direction: "rtl",
        px: { xs: 1.5, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Typography fontSize={"24px"} fontWeight={700} mb={2}>
        {t("components_wallet_index.المحفظة")}
      </Typography>

      <Box
        sx={{
          background: "#FFFFFF",
          border: "1px solid #E6E8EE",
          borderRadius: "16px",
          boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
          p: { xs: 2, md: 3 },
          overflow: "hidden",
        }}
      >
        <Box>
          {(profile?.data?.type === "admin" ||
            profile?.data?.type === "providers") &&
            hasRole("update setting") && (
              <>
                {/*  الرسوم الإدارية */}
                <Box
                  sx={{
                    flex: 1,
                    flex: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    bgcolor: "#FFFFFF",
                    borderRadius: "5px",
                    border: "1px solid #EBEEF3",
                    width: "fit-content",
                    mr: "auto",
                    mb: 2,
                    padding: "10px 16px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Image
                      src="/images/icons/sar-file.svg"
                      width={42}
                      height={42}
                      alt="sar-file"
                    />
                    <Box>
                      <Typography sx={{ color: "#696969", fontSize: "14px" }}>
                        الرسوم الإدارية
                      </Typography>
                      <Typography sx={{ color: "#696969", fontSize: "14px" }}>
                        {formatNumber(setting?.data?.withdrawalFee)}
                      </Typography>
                    </Box>
                  </Box>
                  {profile?.data?.type === "admin" && (
                    <CustomButton
                      text={"تعديل"}
                      handleClick={() => setOpenSettings(true)}
                    />
                  )}
                </Box>
              </>
            )}
          <Grid container spacing={3} alignItems="stretch">
            {(profile?.data?.type === "admin" ||
              profile?.data?.type === "providers") && (
              <Grid item xs={12} md={6} lg={5} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    height: "100%",
                    width: "100%",
                    p: { xs: 3, md: 4 },
                    borderRadius: "10px",
                    border: "1px solid #EEE",
                    background:
                      "linear-gradient(180deg, #F9F2DD 27%, rgba(249, 242, 221, 0.00) 100%)",
                    textAlign: "center",
                    color: "#0F172A",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "none",
                  }}
                >
                  <Stack direction="row" justifyContent="flex-end" mb={1}>
                    <SyncIcon
                      onClick={handleRefresh}
                      sx={{
                        color: "#6B7280",
                        fontSize: 24,
                        cursor: "pointer",
                        transition: "transform .6s linear",
                        ...(loadingBalance || loadinguserWallet
                          ? { transform: "rotate(360deg)" }
                          : {}),
                      }}
                    />
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: { xs: 24, md: 32 },
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {loadingBalance ? "..." : `${formatNumber(balance)} `}
                    {constants.symbol()}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#22A06B",
                      fontWeight: 400,
                      mt: 1.2,
                      fontSize: "14px",
                    }}
                  >
                    {t("components_wallet_index.الرصيد_المتاح")}
                  </Typography>

                  <Box
                    sx={{
                      height: 0,
                      background:
                        "linear-gradient(180deg, #F6EFD8 0%, #FFFFFF 85%)",
                      my: { xs: 2.5, md: 3 },
                    }}
                  />

                  {type === "admin" ? (
                    <CustomButton
                      type="deposit"
                      handleClick={() => setOpen(true)}
                      text={t("components_wallet_index.شحن_رصيد")}
                      customeStyle={{
                        width: "100%",
                        background: "#22A06B",
                        color: "#ffffff",
                        fontWeight: 400,
                        borderRadius: "12px",
                        padding: "14px 16px",
                        border: "none",
                        "&:hover": { background: "#22A06B", boxShadow: "none" },
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        // bgcolor: "#F3F4F6",
                        p: "8px 12px",
                        borderRadius: "10px",
                        mt: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        fontWeight: 600,
                      }}
                    >
                      {`${t(
                        "components_wallet_index.مبلغ_متعلق_في_المزادات"
                      )} ${formatNumber(userWallet?.heldFunds ?? 0)}`}
                      {constants.symbol()}
                    </Box>
                  )}
                </Card>
              </Grid>
            )}

            <Grid item xs={12} md={6} lg={7}>
              <Box sx={{ ...styles.tabsItemContainer, mb: 3 }}>
                {tabItems.map((item) => (
                  <TabItem
                    key={item.id}
                    item={item}
                    selectedItem={selectedItem}
                    handleItemChange={handleItemChange}
                  />
                ))}
              </Box>

              <Box>{showBoxContent()}</Box>
            </Grid>
          </Grid>
        </Box>

        {/* Dialog + Toast */}
        <ChargeWalletDialog
          open={open}
          onClose={() => setOpen(false)}
          amount={amount}
          setAmount={setAmount}
          onConfirm={handleConfirm}
          amountError={amountError}
          setAmountError={setAmountError}
        />
        <Backdrop
          open={openSettings}
          onClick={handleCloseSettings}
          sx={{ zIndex: "99" }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxHeight: "85%",
              overflow: "auto",
              bgcolor: "white",
              borderRadius: "12px",
              boxShadow: 3,
              width: {
                xs: "90%",
                sm: "80%",
                md: "60%",
                lg: "45%",
                xl: "30%",
              },
              p: 3,
            }}
          >
            <PopupTitle
              title="الرسوم الإدارية"
              handleClose={handleCloseSettings}
            />

            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
            >
              <Input
                label="مبلغ الرسوم الإدارية"
                value={myWithdrawalFee}
                handleChange={handleInputChange}
                placeholder="مبلغ الرسوم الإدارية"
                type="text"
                name="myWithdrawalFee"
                customStyle={{ width: "100%", color: "#24262D" }}
                error={error}
                endIcon={<SAR img="/images/icons/SAR.svg" />}
              />

              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <CustomButton
                  customeStyle={{ width: "100%", fontWeight: 700 }}
                  handleClick={handleSubmitSettings}
                  text={settingLoading ? "...جاري التحميل" : "حفظ"}
                />
              </Box>
            </Box>
          </Box>
        </Backdrop>
        <CustomSnackbar
          message={alert.msg}
          open={alertOpen}
          setOpen={setAlertOpen}
          type={alert.type}
        />
      </Box>
    </Box>
  );
};

export default Wallet;
