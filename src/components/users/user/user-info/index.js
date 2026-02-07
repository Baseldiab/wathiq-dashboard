import { useTranslation } from "next-i18next";
import LabelData from "@/components/corporate/main-info/label-data";
import SectionHead from "@/components/corporate/main-info/section-head";
import { styles } from "@/components/corporate/style";
import ProfileImg from "@/components/image-box/profile-img";
import constants from "@/services/constants";
import { formatDate } from "@/services/utils";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export default function UserInfo() {
  const { t } = useTranslation();
  const { usersData, selectedUser, All_loading, selected_loading } =
    useSelector((state) => state.user);
  console.log(selectedUser);

  return (
    <>
      <SectionHead
        title={t("components_users_user_user-info_index.المعلومات_الأساسية")}
        customStyle={{
          bgcolor: "#fff",
          borderRadius: "20px",
          padding: "16px",
        }}
        childrenStyle={{
          bgcolor: constants.colors.light_grey,
          border: "1px solid #E1E1E2",
          borderRadius: { xs: "16px", md: "24px" },
          padding: { xs: "16px", md: " 20px" },
        }}
      >
        <Box
          sx={{
            ...styles.rowBox,
            bgcolor: "inherit",
          }}
        >
          {/* <ProfileImg
            src={selectedUser?.data?.profileImage}
            defultSrc="/images/company.svg"
            // role="update provider"
            noUpdate
            dim="80px"
            // handleFileChange={handleFileChange}
          /> */}
          <Box sx={{pl:2 ,mt:-3,mr:-2}}>
            <Box
              sx={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "6px solid #D6D9E1",
                overflow: "hidden",
              }}
            >
              <img
                style={{ height: "100%", width: "100%" }}
                src={
                  selectedUser?.data?.profileImage
                    ? selectedUser?.data?.profileImage
                    : "/images/icons/company.svg"
                }
              />
            </Box>
          </Box>
          <LabelData label={t("components_users_user_user-info_index.إسم_المستخدم")} value={selectedUser?.data?.name} />
          <LabelData
            label={t("components_users_user_user-info_index.رقم_الجوال")}
            value={`${selectedUser?.data?.phoneNumber?.number}`}
          />
          <LabelData
            label={t("components_users_user_user-info_index.رقم_بطاقة_الاحوال_الإقامة")}
            value={selectedUser?.data?.identityNumber}
          />
        </Box>
        <Box
          sx={{
            ...styles.rowBox,
            bgcolor: "inherit",
          }}
        >
          <LabelData
            label={t("components_users_user_user-info_index.البريد_الإلكتروني")}
            value={
              selectedUser?.data?.email ? selectedUser?.data?.email : t("components_users_user_user-info_index.لا_يوجد")
            }
          />
          <LabelData
            label={t("components_users_user_user-info_index.تاريخ_الميلاد")}
            value={formatDate(selectedUser?.data?.birthDay)}
          />
          <LabelData
            label={t("components_users_user_user-info_index.تاريخ_التسجيل")}
            value={formatDate(selectedUser?.data?.createdAt)}
          />
        </Box>
      </SectionHead>
      {/* Basic Information */}

      {/* <Box sx={{ mb: 2 }}>
        <SectionHead title="بيانات المحفظة " />
      </Box> */}

      {/* <Box
        sx={{
          ...styles.rowBox,
        }}
      >
        {" "}
        <LabelData label={t("components_users_user_user-info_index.رقم")} value={545445455} />
        <LabelData label={t("components_users_user_user-info_index.اسم_البنك")} value={t("components_users_user_user-info_index.الراجحي")} />
      </Box> */}
    </>
  );
}
