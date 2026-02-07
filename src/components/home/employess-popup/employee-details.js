import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Typography, Box, Grid } from "@mui/material";
import { setStatusStyle, buildQueryParams, hasRole } from "@/services/utils";
import Button from "@/components/button";
import { unBlockSelectedUser } from "@/Redux/slices/userSlice";
import { getEmployees } from "@/Redux/slices/employeeSlice";
import { useSelector, useDispatch } from "react-redux";
import constants from "@/services/constants";
import { BreakLineInfo } from "../break-line-item";
import Loader from "@/components/loader";
import PopupTitle from "@/components/popup-title";
import CustomBackdrop from "@/components/backdrop";
import BlockUser from "./employee-block";

export default function EmployeeDetails({
  page,
  filterData,
  employee,
  handleClose,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { loading, blockSelectedUserLoading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  console.log(employee);
  const handleUnBlockUser = async () => {
    // if (!unBlock) return;
    let response = await dispatch(unBlockSelectedUser(employee?.user));
    dispatch(getEmployees(buildQueryParams({ ...filterData, page })));
    if (response?.meta?.requestStatus === "fulfilled") handleClose();
  };
  const handleOpenPopup = () => {
    setOpen(true);
  };
  const handleClosePopup = () => {
    setOpen(false);
  };

  if (blockSelectedUserLoading) return <Loader open={true} />;
  return (
    <Box
      sx={{
        border: "1px solid #EBEEF3",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        background: "#fff",
        width: "100%",
      }}
    >
      <PopupTitle title=" تفاصيل الموظف" handleClose={handleClose} />

      <Box
        sx={{
          borderRadius: "8px",
          border: "1px solid #E1E1E2",
          padding: "24px 16px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {/**name */}
          <Box sx={{ mb: "16px", display: "flex", gap: 5 }}>
            <Typography
              sx={{
                color: constants.colors.dark_black,
                fontSize: "1.25rem",
                fontWeight: 700,
              }}
            >
              {employee.name}
            </Typography>
            <Box>
              <Typography
                sx={{
                  height: "fit-content",
                  width: "fit-content",
                  ...setStatusStyle(
                    employee?.blocked?.value
                      ? t(
                          "components_home_employess-popup_employee-details.محظور"
                        )
                      : t(
                          "components_home_employess-popup_employee-details.نشط"
                        )
                  ),
                }}
              >
                {employee?.blocked?.value
                  ? t("components_home_employess-popup_employee-details.محظور")
                  : t("components_home_employess-popup_employee-details.نشط")}
              </Typography>
            </Box>
          </Box>
          {!employee?.blocked?.value && hasRole("block user") ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1px",
              }}
            >
              <Button
                handleClick={() => {
                  handleOpenPopup();
                }}
                disabled={blockSelectedUserLoading}
                text={
                  blockSelectedUserLoading
                    ? t(
                        "components_home_employess-popup_employee-details.جاري_التجميل"
                      )
                    : t(
                        "components_home_employess-popup_employee-details.حظر_الموظف"
                      )
                }
                customeStyle={{
                  // p: "1px 16px",
                  // height: "2.5rem",
                  background: "#E34935",
                  border: !blockSelectedUserLoading && "1px solid #E34935",
                  color: "#fff",
                  fontWeight: 700,
                  "&:hover": {
                    background: "#E34935",
                    boxShadow: "none",
                  },
                }}
              />
            </Box>
          ) : null}
          {employee?.blocked?.value && hasRole("unblock user") ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1px",
              }}
            >
              <Button
                handleClick={handleUnBlockUser}
                disabled={blockSelectedUserLoading}
                text={
                  blockSelectedUserLoading
                    ? t(
                        "components_home_employess-popup_employee-details.جاري_التجميل"
                      )
                    : t(
                        "components_home_employess-popup_employee-details.الغاء_الحظر"
                      )
                }
                customeStyle={{
                  p: "1px 16px",
                  // height: "2.5rem",
                  background: "#FFEDEA",
                  border: !blockSelectedUserLoading && "1px solid #E34935",
                  color: "#E34935",
                  fontWeight: 700,
                  "&:hover": {
                    background: "#FFEDEA",
                    boxShadow: "none",
                  },
                }}
              />
            </Box>
          ) : null}
        </Box>
        {/**data between */}
        <Grid container spacing={2} sx={{ mb: "16px" }}>
          {/* رقم الجوال */}
          <Grid item xs={12} sm={6} md={3}>
            <BreakLineInfo
              label={t(
                "components_home_employess-popup_employee-details.رقم_الجوال"
              )}
              value={employee?.phoneNumber?.number}
            />
          </Grid>

          {/* المسمي الوظيفي (repeated) */}
          <Grid item xs={12} sm={6} md={3}>
            <BreakLineInfo
              label={t(
                "components_home_employess-popup_employee-details.المسمي_الوظيفي"
              )}
              value={employee?.role?.name}
            />
          </Grid>
          {/* القسم */}
          {employee?.identityNumber && (
            <Grid item xs={12} sm={6} md={3}>
              <BreakLineInfo
                label={"رقم الهوية"}
                value={employee?.identityNumber}
              />
            </Grid>
          )}
          {/* القسم */}
          {employee?.department && (
            <Grid item xs={12} sm={6} md={3}>
              <BreakLineInfo
                label={t(
                  "components_home_employess-popup_employee-details.القسم"
                )}
                value={employee?.department?.name}
              />
            </Grid>
          )}

          {/* تابع لـ */}
          {employee?.provider && (
            <Grid item xs={12} sm={6} md={3}>
              <BreakLineInfo
                label={t(
                  "components_home_employess-popup_employee-details.تابع_لـ"
                )}
                value={employee?.provider?.name}
              />
            </Grid>
          )}
        </Grid>
        {/**roles */}
        <Box>
          <Typography
            sx={{
              color: "#202726",
              fontSize: "1.25rem",
              fontWeight: "700",
              mb: "16px",
            }}
          >
            {t("components_home_employess-popup_employee-details.الصلاحيات")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              // justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {employee?.role?.permissions?.length > 0 &&
              employee.role.permissions.map((permission, index) => (
                <Typography
                  key={index}
                  sx={{
                    borderRadius: "12px",
                    padding: "10px 14px",
                    background: "#F8FAFA",
                    color: "#2E353F",
                    fontSize: "0.8rem",
                    width: { md: "140px" },
                    textAlign: "center",
                    // fontWeight: "700",
                  }}
                >
                  {permission}
                </Typography>
              ))}
          </Box>
        </Box>
      </Box>
      <CustomBackdrop
        open={open}
        setOpen={setOpen}
        handleOpen={handleOpenPopup}
        handleClose={handleClosePopup}
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
            <BlockUser
              handleClosePopup={handleClosePopup}
              handleClose={handleClose}
              employee={employee}
              filterData={filterData}
              page={page}
            />
          </Box>
        }
      />
    </Box>
  );
}
