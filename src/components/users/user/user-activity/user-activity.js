import { useTranslation } from "next-i18next";
import { Box, Card, Typography, IconButton } from "@mui/material";
import { Button as MuiButton } from "@mui/material";
import CustomButton from "@/components/button";
import { useState } from "react";
import FilterMenu from "@/components/filter-menu";
import BasicPagination from "@/components/pagination";
import Custom_Card from "../Card";

const UserActivity = () => {
  const { t } = useTranslation();

  const activitiesData = [
  {
    id: 1,
    title: t("components_users_user_user-activity_user-activity.مزاد_العمول_عسيرهوية_المزادات"),
    description:
      t("components_users_user_user-activity_user-activity.تصل_مرحلة_الانتقالات_لعمليات"),
    date: t("components_users_user_user-activity_user-activity.مساء"),
    logo: "/images/success.svg",
    checked: true,
  },
  {
    id: 2,
    title: t("components_users_user_user-activity_user-activity.مزاد_العمول_عسيرهوية_المزادات"),
    description:
      t("components_users_user_user-activity_user-activity.تصل_مرحلة_الانتقالات_لعمليات"),
    date: t("components_users_user_user-activity_user-activity.مساء"),
    logo: "/images/success.svg",

    checked: false,
  },
];
  const [activities, setActivities] = useState(activitiesData);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const menuOpen = Boolean(anchorEl);
  const handlePaginationChange = (e, currentPage) => {
    setPage(currentPage);
  };
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const markAllAsRead = () => {
    setActivities(
      activities.map((activity) => ({ ...activity, checked: true }))
    );
  };

  const toggleCheck = (id) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id
          ? { ...activity, checked: !activity.checked }
          : activity
      )
    );
  };

  return (
    <Box sx={{ width: "100%", p: 2, direction: "rtl" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          النشاطات{" "}
        </Typography>
        <Box
          id="basic-button"
          aria-controls={menuOpen ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
        >
          <CustomButton
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
            text={t("components_users_user_user-activity_user-activity.تصفية")}
            type="filter"
          />
          <FilterMenu
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            handleCloseMenu={handleCloseMenu}
            title={t("components_users_user_user-activity_user-activity.تصفية")}
            onCloseIconClick={handleCloseMenu}
            // handleSubmitFilter={handleSubmitFilter}
            // handleResetData={handleResetData}
          >
            {/* custom dynamic content */}
            {/* <Box
                       sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                     >
                       <Input
                         label={t("components_users_user_user-activity_user-activity.الشركة")}
                         placeholder={t("components_users_user_user-activity_user-activity.حدد_الشركة")}
                         type="selectbox"
                         valuesOption={companyOptions}
                         handleChange={handleFilterChange}
                         value={filterData?.companyName || ""}
                         name="companyName"
                         customStyle={{ width: "100%" }}
                       />

                       <Input
                         label={t("components_users_user_user-activity_user-activity.النشاط_العقاري")}
                         placeholder={t("components_users_user_user-activity_user-activity.حدد_النشاط_العقاري")}
                         type="selectbox"
                         valuesOption={activityOptions}
                         handleChange={handleFilterChange}
                         value={filterData?.realEstateActivity || ""}
                         name="realEstateActivity"
                         customStyle={{ width: "100%" }}
                       />
                     </Box> */}
          </FilterMenu>
          {/*  */}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <MuiButton variant="text" color="success" onClick={markAllAsRead}>{t("components_users_user_user-activity_user-activity.وضع_علامة_على_الكل")}</MuiButton>
      </Box>

      {activities.map((activity) => (
        <Custom_Card
          key={activity.id}
          title={activity.title}
          description={activity.description}
          date={activity.date}
          logo={activity.logo}
          checked={activity.checked}
          amount={activity.amount}
          status={activity.status}
          type={"activity"}
          onClick={() => toggleCheck(activity.id)}
        />
      ))}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          my: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <Typography
            sx={{ color: "#6F6F6F", fontWeight: 700, fontSize: "1rem" }}
          >{t("components_users_user_user-activity_user-activity.من")}</Typography>
          <Typography sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}>
            {/* {usersData?.pagination?.resultCount} */}
            10
          </Typography>
        </Box>

        <BasicPagination
          handleChange={handlePaginationChange}
          page={page}
          count={totalCount}
        />
      </Box>
    </Box>
  );
};

export default UserActivity;
