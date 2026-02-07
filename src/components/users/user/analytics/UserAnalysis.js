import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "@/Redux/slices/analysisSlice";
import { useEffect } from "react";
import Loader from "@/components/loader";
import CustomLineChart from "@/components/LineChartBox";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MainCard from "@/components/MainCard";
import StatsWithPieChartCard from "../../../StatsWithPieChartCard";
import constants from "@/services/constants";
export default function UserAnalysis() {
  const dispatch = useDispatch();

  const { userdata, userloading, usererror } = useSelector((state) => {
    return state?.analysis;
  });
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);
  const userAnalysis = userdata;
  if (userloading || !userAnalysis) return <Loader open={true} />;
  const platForm = [
    {
      statues: "مستخدمو الجوال ",
      count: userAnalysis.newUsersPlatformUsage.mobile.count,
      percentage: userAnalysis.newUsersPlatformUsage.mobile.percentage,
    },
    {
      statues: "مستخدمو الويب ",
      count: userAnalysis.newUsersPlatformUsage.web.count,
      percentage: userAnalysis.newUsersPlatformUsage.web.percentage,
    },
    {
      statues: "مستخدمون غير معروفين",
      count: userAnalysis.newUsersPlatformUsage.unknown.count,
      percentage: userAnalysis.newUsersPlatformUsage.unknown.percentage,
    },
  ];
  const dailyRegistrations = userAnalysis.dailyRegistrations?.map((item) => ({
    date: item.date,
    count: item.count,
  }));
  return (
    <>
      <Box
        sx={{
          borderRadius: "25px",
          border: "1px solid #D6D9E1",
          backgroundColor: "#fff",
          p: 3,
          mb: 4,
          mt: 7,
        }}
      >
        <Grid container spacing={1.5}>
          {/* الكروت على اليمين (عموديًا) */}
          <Grid item xs={12} lg={5}>
            <Box display="flex" flexDirection="column" gap={1}>
              <MainCard
                icon={
                  <AccountCircleIcon
                    color="success"
                    sx={{ color: constants.colors.main }}
                  />
                }
                title="إجمالي المستخدمين"
                mainValue={userAnalysis.current.totalUsers}
                stats={[
                  {
                    label: "نشط",
                    value: userAnalysis.current.onlineUsers,
                    percentage: userAnalysis.percentageChanges.onlineUsers,
                  },
                  {
                    label: "محظور",
                    value: userAnalysis.current.blockedUsers,
                    percentage: userAnalysis.percentageChanges.blockedUsers,
                  },
                ]}
              />
              <MainCard
                icon={
                  <AccountCircleIcon
                    color="success"
                    sx={{ color: constants.colors.main }}
                  />
                }
                title="عدد المستخدمين الجدد هذا الشهر"
                mainValue={userAnalysis.current.newUsersThisMonth}
                percentage={userAnalysis.percentageChanges.newUsers}
              />
              {/* <StatsWithPieChartCard
                title="عدد المستخدمين الجدد هذا الشهر"
                value={userAnalysis.current.newUsersThisMonth}
                percentage={userAnalysis.percentageChanges.newUsers}
                chartData={platForm}
              /> */}
            </Box>
          </Grid>

          {/* الشارت على اليسار (أو تحت لو شاشة صغيرة) */}
          <Grid item xs={12} lg={7}>
            <CustomLineChart
              title="معدل التسجيل اليومي"
              data={dailyRegistrations}
              xKey="date"
              lines={[
                { key: "count", label: "عدد المسجلين", color: "#18365F" },
                { key: "date", label: "التاريخ", color: "#00DB81" },
              ]}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
