import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "@/components/loader";
import { getAgency, getUser } from "@/Redux/slices/analysisSlice";
import { CustomPieChart } from "@/components/PieChartBox";
import CustomLineChart from "@/components/LineChartBox";
import MainCard from "@/components/MainCard";
import BusinessIcon from "@mui/icons-material/Business";
import constants from "@/services/constants";

export default function AgencieyAnalysis() {
  const dispatch = useDispatch();
  const { agencydata, agencyloading, Agencieyerror } = useSelector((state) => {
    return state?.analysis;
  });
  // const { userdata } = useSelector((state) => {
  //   return state?.analysis;
  // });
  useEffect(() => {
    // userdata == null && dispatch(getUser());
    dispatch(getAgency());
  }, [dispatch]);
  const AgencieyAnalysis = agencydata?.data?.agencyOverview;
  const auctionParticipation = agencydata?.data?.auctionParticipation;
  const auctionPerformance = agencydata?.data?.auctionPerformance;
  if (agencyloading || !AgencieyAnalysis) return <Loader open={true} />;

  const pieData = AgencieyAnalysis.statusDistribution.map((item) => {
    let label = "";
    switch (item.status) {
      case "approved":
        label = "الموافق عليها";
        break;
      case "rejected":
        label = "المرفوضة";
        break;
      case "pending":
        label = "المعلقة";
        break;
      case "inProgress":
        label = "قيد التنفيذ";
        break;
      default:
        label = item.status;
    }

    return {
      statues: label,
      percentage: item.percentage,
      count: item.count,
    };
  });

  const monthlyTrends = agencydata?.data?.timeBasedAnalysis?.monthlyTrends?.map(
    (item) => ({
      date: item.month, // لأن الـ xKey هو "date"
      newAgencies: item.newAgencies,
      totalEnrollments: item.totalEnrollments,
      totalWins: item.totalWins,
    })
  );

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
        <Box sx={{ width: { sm: "100%", md: "100%", lg: "40%" } }}>
          <MainCard
            icon={<BusinessIcon sx={{ color: constants.colors.secondary }} />}
            title="عدد الوكالات"
            mainValue={AgencieyAnalysis.current.totalAgencies}
            stats={[
              // {
              //   label: "العملاء",
              //   value: userdata?.current.totalUsers,
              //   percentage: userdata?.percentageChanges.totalUsers,
              // },
              {
                label: "مزادات نفذها وكلاء",
                value: auctionParticipation?.current.totalEnrollments,
                percentage:
                  auctionParticipation?.percentageChanges.totalEnrollments,
              },
            ]}
          />
        </Box>
        {monthlyTrends.length > 0 && (
          <CustomLineChart
            title="التريند الشهري للوكالات"
            data={monthlyTrends}
            xKey="date"
            lines={[
              {
                key: "newAgencies",
                label: "وكالات جديدة",

                color: constants.colors.secondary,
              },
              {
                key: "totalEnrollments",
                label: "الاشتراكات",
                color: "#FF9800",
              },
              { key: "totalWins", label: "مرات الفوز", color: "#22A06B",},
            ]}
          />
        )}

        <Box mt={4}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            الوكالات ذات الأداء الأعلى{" "}
          </Typography>
          <TableContainer
            sx={{
              textAlign: "right",
              boxShadow: "none",
              border: "1px solid #D6D9E1",
              borderRadius: "12px",
              display: "block",
              mb: 5,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>رقم</TableCell> */}
                  <TableCell>عدد العروض</TableCell>
                  <TableCell>مرات الفوز</TableCell>
                  <TableCell>نسبة الفوز</TableCell>
                  <TableCell>إجمالي الفوز</TableCell>
                  <TableCell>متوسط الفوز</TableCell>
                  <TableCell>آخر فوز</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auctionPerformance.topPerformingAgencies.map((agency, idx) => (
                  <TableRow key={agency._id}>
                    {/* <TableCell align="right">#{idx + 1} </TableCell> */}
                    <TableCell align="right">{agency.totalBids}</TableCell>
                    <TableCell align="right">{agency.totalWins}</TableCell>
                    <TableCell align="right">{agency.winRate} %</TableCell>
                    <TableCell align="right">
                      {agency.totalWinAmount.toLocaleString()}{" "}
                      {/* {constants.symbol({ width: { xs: "10px", md: "10px" } })} */}
                    </TableCell>
                    <TableCell align="right">
                      {agency.averageWinAmount.toLocaleString()}{" "}
                      {/* {constants.symbol({ width: { xs: "10px", md: "10px" } })} */}
                    </TableCell>
                    <TableCell align="right">
                      {new Date(agency.lastWinDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {auctionParticipation.enrollmentStatusDistribution.length > 0 && (
          <CustomPieChart
            data={auctionParticipation.enrollmentStatusDistribution.map(
              (item) => ({
                statues:
                  item.status === "approved"
                    ? "تمت الموافقة"
                    : item.status === "rejected"
                    ? "مرفوضة"
                    : item.status === "canceled"
                    ? "تم الإلغاء"
                    : item.status,
                percentage: item.percentage,
              })
            )}
            title="  توزيع حالات الاشتراك في المزاد"
            colors={["#6CE9A5", "#F6E192", "#FFB4B4"]}
            CustomTooltip={CustomTooltip}
          />
        )}
        {/* <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <CustomPieChart
            data={pieData}
            title=""
            colors={["#F6E192", "#D6D9E1", "#99d1ebff", "#6CE9A5"]}
            CustomTooltip={CustomTooltip}
          />
        </Grid> */}
        {/* </Grid> */}
      </Box>
    </>
  );
}
