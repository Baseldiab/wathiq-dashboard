import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Typography, Box, Grid } from "@mui/material";
import Button from "@/components/button";
import Input from "@/components/inputs";
import { useSelector, useDispatch } from "react-redux";
import Loader from "@/components/loader";
import Snackbar from "@/components/toastMsg/index.js";
import ErrorMsg from "@/components/error-message/index";
import Backdrop from "@/components/backdrop";
import constants from "@/services/constants";
import { truncateFileName, isEmptyObject, hasRole } from "@/services/utils";
import LogoRemove from "@/components/content/home-logos-popup/logo-remove.js";
import LogoModification from "@/components/content/home-logos-popup/logo-modification.js";
import { styles } from "../globalStyle";
import { getLogos, updateLogo } from "@/Redux/slices/logosSlice";
import { getSetting, updateSetting } from "@/Redux/slices/settingSlice";

export default function HomeControl({}) {
  const { t } = useTranslation();
  const messages = {
    valNumber: t("components_content_homeControl.الرقم_اجباري"),
  };
  const [open, setOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [alert, setAlert] = useState({});
  const [data, setData] = useState({ valNumber: "", auctionPhoneNumber: "" });
  const [errors, setErrors] = useState({});
  const [selectedLogo, setSelectedLogo] = useState({});
  const [source, setSource] = useState("");
  const [type, setType] = useState("");
  const [initialData, setInitialData] = useState({
    valNumber: "",
    auctionPhoneNumber: "",
  });
  const isChanged =
    data.valNumber !== initialData.valNumber ||
    data.auctionPhoneNumber !== initialData.auctionPhoneNumber;

  const { logos, loading, errorLogo, reload } = useSelector(
    (state) => state.logos || {}
  );
  const {
    setting,
    loading: settingLoading,
    error: settingError,
  } = useSelector((state) => state.setting);

  console.log("settingError", setting);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!setting) dispatch(getSetting());
    else {
      const initial = {
        valNumber: setting?.data?.valAuctionsLicenseNumber || "",
        auctionPhoneNumber: setting?.data?.auctionPhoneNumber?.number || "",
      };
      setInitialData(initial);
      setData(initial);
    }
  }, [dispatch, setting]);

  useEffect(() => {
    if (!logos) dispatch(getLogos()); // Fetch logos when the component mounts
  }, [dispatch, reload]);
  const handleInputChange = (value, name) => {
    setErrors({ ...errors, [name]: "" });
    setData({ ...data, [name]: value });
  };
  const validateInputs = () => {
    let newErrors = {};

    if (!/^\d{10}$/.test(data.valNumber)) {
      newErrors.valNumber=t("components_content_homeControl.رقم_الرخصه_يجب_ان");
    }

    if (!/^5\d{8}$/.test(data.auctionPhoneNumber)) {
      newErrors.auctionPhoneNumber=t("components_content_homeControl.رقم_الجوال_يجب_أن");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateSetting = async () => {
    if (!validateInputs()) return;

    let payload = {
      valAuctionsLicenseNumber: data.valNumber,
      auctionPhoneNumber: {
        key: "+966", // static
        number: data.auctionPhoneNumber,
      },
    };

    const response = await dispatch(updateSetting(payload));

    if (response?.meta?.requestStatus === "fulfilled") {
      dispatch(getSetting());
      setAlert({ msg: t("components_content_homeControl.تم_التحديث_بنجاح"), type: "success" });
      setOpen(true);
    } else {
      setAlert({ msg: settingError || t("components_content_homeControl.حدث_خطأ"), type: "error" });
      setOpen(true);
    }
  };

  const handleChangeSwitch = async (e, logo) => {
    const newActiveStatus = !logo.active;
    const updatedLogo = { ...logo, active: newActiveStatus };

    const response = await dispatch(
      updateLogo({
        data: updatedLogo,
        id: logo._id,
      })
    );
    dispatch(getLogos());
    if (response?.meta?.requestStatus === "fulfilled") {
      setAlert({ msg: t("components_content_homeControl.تم_تحديث_حالة_اللوجو"), type: "success" });
      setOpen(true);
    } else {
      setAlert({ msg: errorLogo || t("components_content_homeControl.حدث_خطأ"), type: "error" });
      setOpen(true);
    }
  };

  const handleBackdropOpen = () => {
    setBackdropOpen(true);
  };
  const handleBackdropClose = () => {
    setBackdropOpen(false);
    setSelectedLogo({});
  };
  const handleOpenLogoPopup = (type, logo = {}) => {
    if (Object.keys(logo).length > 0) {
      setSelectedLogo(logo);
      setSource("EDIT");
    } else {
      setSource("ADD");
      setSelectedLogo({});
    }
    setType(type);
    handleBackdropOpen();
  };

  const showBackDropContent = () => {
    switch (type) {
      case "logo-remove":
        return (
          <LogoRemove
            logo={selectedLogo}
            handleClose={handleBackdropClose}
            setAlert={setAlert}
            setOpen={setOpen}
          />
        );
      case "logo-modification":
        return (
          <LogoModification
            source={source}
            logo={selectedLogo}
            handleClose={handleBackdropClose}
            setAlert={setAlert}
            setOpen={setOpen}
          />
        );
      default:
        break;
    }
  };
  if (loading || settingLoading) return <Loader open={true} />;

  return (
    <Box
      sx={{
        ...styles.boxData,
      }}
    >
      <Box sx={{ mt: 3 }}>
        <Input
          label={t("components_content_homeControl.رقم_رخصة_فال_للمزادات")}
          placeholder={t("components_content_homeControl.رقم_رخصة_فال_للمزادات")}
          type="text"
          handleChange={handleInputChange}
          value={data?.valNumber}
          name="valNumber"
          customStyle={{ width: "100%" }}
        />
        {errors?.valNumber && <ErrorMsg message={errors?.valNumber} />}
      </Box>
      <Box>
        <Input
          label={t("components_content_homeControl.رقم_جوال_خدمة_العملاء")}
          placeholder={t("components_content_homeControl.رقم_جوال_خدمة_العملاء")}
          type="text"
          handleChange={handleInputChange}
          value={data?.auctionPhoneNumber}
          name="auctionPhoneNumber"
          customStyle={{ width: "100%" }}
        />
        {errors?.auctionPhoneNumber && (
          <ErrorMsg message={errors?.auctionPhoneNumber} />
        )}
      </Box>
      {hasRole("update setting") && (
        <Box sx={{ mb: 3 }}>
          <Button
            handleClick={handleUpdateSetting}
            text={t("components_content_homeControl.حفظ_التعديلات")}
            disabled={!isChanged}
          />
        </Box>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ color: "#202726", fontWeight: 700, fontSize: "1rem" }}
        >{t("components_content_homeControl.لوجو_الشركات")}</Typography>
        <Button
          type="add"
          transparentBtn={true}
          handleClick={() => handleOpenLogoPopup("logo-modification")}
          customeStyle={{
            color: constants.colors.main,
            background: "transparent",
            border: `1px solid ${constants.colors.main}`,
            "&:hover": {
              color: constants.colors.main,
              background: "transparent",
              border: `1px solid ${constants.colors.main}`,
              boxShadow: "none",
            },
          }}
          text={t("components_content_homeControl.اضافة_لوجو")}
        />
      </Box>
      <Grid sx={{ alignItems: "end", my: 2 }} container spacing={2}>
        {logos &&
          logos.data.map((logo) => (
            <Grid item xs={12} sm={6} md={3} sx={{ my: 1 }}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid #D6D9E1",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <img
                  style={{
                    display: "block",
                    // width: "160px",
                    // height: "44px",
                    height: "auto",
                    width: "auto",
                    maxWidth: {md:"50%"},
                    maxHeight: {md:"50%"},
                  }}
                  src={logo?.logo}
                />
                <Typography
                  sx={{ color: "#6F6F6F", fontWeight: 700, fontSize: "0.8rem" }}
                >
                  {logo?.name}{" "}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Input
                    handleChange={(e) => handleChangeSwitch(e, logo)}
                    value={logo.active}
                    customStyle={{ mx: 0 }}
                    type="switch"
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      alignItems: "end",
                    }}
                  >
                    <img
                      onClick={(e) =>
                        handleOpenLogoPopup("logo-modification", logo)
                      }
                      style={{ cursor: "pointer" }}
                      src="/images/icons/edit-table.svg"
                    />
                    <img
                      onClick={(e) => handleOpenLogoPopup("logo-remove", logo)}
                      style={{ cursor: "pointer" }}
                      src="/images/icons/trash.svg"
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
      </Grid>
      <Backdrop
        open={backdropOpen}
        setOpen={setBackdropOpen}
        handleOpen={handleBackdropOpen}
        handleClose={handleBackdropClose}
        component={
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxHeight: "85%",
              overflow: "auto",
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
        }
      />
      <Snackbar
        type={alert.type}
        open={open}
        setOpen={setOpen}
        message={alert.msg}
      />
    </Box>
  );
}
