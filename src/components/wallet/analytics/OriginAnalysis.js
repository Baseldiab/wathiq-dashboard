import React from "react";
import {
  Grid,
  Box,
  Typography,
  TableHead,
  Table,
  TableContainer,
  TableBody,
  Paper,
  TableRow,
  TableCell,
} from "@mui/material";
import { CustomPieChart } from "@/components/PieChartBox";
import BarChartBox from "@/components/BarChartBox";
import { CustomTooltip } from "@/components/CustomTooltip";
import constants from "@/services/constants";
import GavelIcon from "@mui/icons-material/Gavel";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/loader";
import StatsCard from "@/components/StatsWithPieChartCard";
import MainCard from "@/components/MainCard";

const OriginAnalysis = ({ data }) => {
  // const { providerOriginAnalysis } = data.data;
  const dispatch = useDispatch();

  const { walletdata, walletloading, walleterror } = useSelector((state) => {
    return state?.analysis;
  });
  // useEffect(() => {
  //   dispatch(getWallet());
  // }, [dispatch]);
  const providerOriginAnalysis = walletdata?.data?.providerOriginAnalysis;

  if (walletloading || !providerOriginAnalysis) return <Loader open={true} />;

  const stats = [
    {
      title: "إجمالي الاصول",
      current: providerOriginAnalysis.current.totalOrigins,
      previous: providerOriginAnalysis.previous.totalOrigins,
      percentage: providerOriginAnalysis.percentageChanges.totalOrigins,
      icon: (
        <GavelIcon
          sx={{ color: constants.colors.secondary }}
          fontSize="medium"
        />
      ),
    },
    {
      title: "إجمالي المزادات",
      current: providerOriginAnalysis.current.totalAuctions,
      previous: providerOriginAnalysis.previous.totalAuctions,
      percentage: providerOriginAnalysis.percentageChanges.totalAuctions,
    },
    {
      title: "إجمالي المزودين",
      current: providerOriginAnalysis.current.totalProviders,
      previous: providerOriginAnalysis.previous.totalProviders,
      percentage: providerOriginAnalysis.percentageChanges.totalProviders,
    },

    {
      title: "الاصول الموافق عليها",
      current: providerOriginAnalysis.current.approvedOrigins,
      previous: providerOriginAnalysis.previous.approvedOrigins,
      percentage: providerOriginAnalysis.percentageChanges.approvedOrigins,
    },
    {
      title: "الاصول المرفوضة",
      current: providerOriginAnalysis.current.rejectedOrigins,
      previous: providerOriginAnalysis.previous.rejectedOrigins,
      percentage: providerOriginAnalysis.percentageChanges.rejectedOrigins,
    },
    {
      title: "إجمالي مبلغ  الاصول",
      current: providerOriginAnalysis.current.totalOriginValue,
      previous: providerOriginAnalysis.previous.totalOriginValue,
      percentage: providerOriginAnalysis.percentageChanges.totalOriginValue,
      isMoney: true,
    },

    {
      title: "متوسط  مبلغ الاصول",
      current: providerOriginAnalysis.current.averageOriginPrice,
      previous: providerOriginAnalysis.previous.averageOriginPrice,
      percentage: providerOriginAnalysis.percentageChanges.averageOriginPrice,
      isMoney: true,
    },
  ];

  const pieData = providerOriginAnalysis.statusDistribution.map((item) => {
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
      totalAmount: item.totalAmount,
    };
  });
  return (
    <>
      {/* <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={6} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid> */}
      {/* <StatCard details={stats} /> */}
      {/* <StatsCard stats={stats} /> */}
      <Grid container spacing={2} mb={5}>
        <Grid item xs={12} md={6}>
          <MainCard
            title="إجمالي الأصول"
            icon={
              <GavelIcon
                sx={{ color: constants.colors.secondary }}
                fontSize="medium"
              />
            }
            mainValue={providerOriginAnalysis.current.totalOrigins}
            stats={[
              {
                label: "إجمالي المزادات",
                value: providerOriginAnalysis.current.totalAuctions,
                percentage:
                  providerOriginAnalysis.percentageChanges.totalAuctions,
              },
              {
                label: "إجمالي المزودين",
                value: providerOriginAnalysis.current.totalProviders,
                percentage:
                  providerOriginAnalysis.percentageChanges.totalProviders,
              },
              {
                label: "الأصول الموافق عليها",
                value: providerOriginAnalysis.current.approvedOrigins,
                percentage:
                  providerOriginAnalysis.percentageChanges.approvedOrigins,
              },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <MainCard
            title="إجمالي مبلغ الأصول"
            icon={
              <GavelIcon
                sx={{ color: constants.colors.secondary }}
                fontSize="medium"
              />
            }
            mainValue={providerOriginAnalysis.current.totalOriginValue}
            isMoney={true}
            stats={[
              {
                label: "الأصول المرفوضة",
                value: providerOriginAnalysis.current.rejectedOrigins,
                percentage:
                  providerOriginAnalysis.percentageChanges.rejectedOrigins,
              },
              {
                label: "متوسط مبلغ الأصول",
                value: providerOriginAnalysis.current.averageOriginPrice,
                percentage:
                  providerOriginAnalysis.percentageChanges.averageOriginPrice,
                isMoney: true,
              },
            ]}
          />
        </Grid>
      </Grid>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4} sm={12}>
            <CustomPieChart
              data={pieData}
              title="حالات الاصول"
              colors={["#F6E192", "#D6D9E1", "#99d1ebff", "#6CE9A5"]}
              CustomTooltip={CustomTooltip}
            />
          </Grid>
          <Grid item xs={12} lg={8} sm={12}>
            <BarChartBox
              title="توزيع الاصول"
              data={providerOriginAnalysis.priceRanges}
              xKey="range"
              barKey="count"
              barName="عدد المحافظ"
              barColor={constants.colors.secondary}
              customTooltip={CustomTooltip}
              xAxisLabel="فئة الرصيد "
              yAxisLabel="عدد المحافظ"
            />
          </Grid>
        </Grid>
      </Box>
      <Box mt={4}>
        <Typography variant="h6" mb={2} fontWeight="bold">
          أعلى المزودين
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
                <TableCell align="right">اسم المزود</TableCell>
                <TableCell align="right">عدد العمليات</TableCell>
                <TableCell align="right">إجمالي القيمة</TableCell>
                <TableCell align="right">متوسط السعر</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {providerOriginAnalysis.topProviders.map((provider) => (
                <TableRow key={provider._id}>
                  <TableCell align="right">
                    {provider.providerName || "-"}
                  </TableCell>
                  <TableCell align="right">{provider.totalOrigins}</TableCell>
                  <TableCell align="right">
                    {provider.totalValue.toLocaleString()}{" "}
                    {constants.symbol({ width: { xs: "10px", md: "10px" } })}
                  </TableCell>
                  <TableCell align="right">
                    {provider.averagePrice.toLocaleString()}{" "}
                    {constants.symbol({ width: { xs: "10px", md: "10px" } })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default OriginAnalysis;
