import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { CustomPieChart } from "@/components/PieChartBox";
import BarChartBox from "@/components/BarChartBox";
import { CustomTooltip } from "@/components/CustomTooltip";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/loader";
import MainCard from "@/components/MainCard";
import constants from "@/services/constants";
const WithdrawalAnalysis = () => {
  const dispatch = useDispatch();

  const { walletdata, walletloading, walleterror } = useSelector((state) => {
    return state?.analysis;
  });
  const withdrawalAnalysis = walletdata?.data?.withdrawalAnalysis;

  if (walletloading || !withdrawalAnalysis) return <Loader open={true} />;


  const pieData = withdrawalAnalysis.statusDistribution.map((item) => {
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
  //   const total = pieData.reduce((sum, item) => sum + item.percentage, 0) || 1; // تجنب القسمة على صفر

  return (
    <>
      <Box sx={{ width: { sm: "100%", md: "100%", lg: "40%" } }}>
        <MainCard
          icon={
            <AccountBalanceWalletIcon
              sx={{ color: constants.colors.secondary }}
            />
          }
          title="إجمالي عمليات السحب"
          mainValue={withdrawalAnalysis.current.totalWithdrawals}
          stats={[
            {
              label: "إجمالي مبلغ السحب",
              value: withdrawalAnalysis.current.totalWithdrawAmount,
              percentage:
                withdrawalAnalysis.percentageChanges.totalWithdrawAmount,
              isMoney: true,
            },
            {
              label: "متوسط مبلغ السحب",
              value: withdrawalAnalysis.current.averageWithdrawAmount,
              percentage:
                withdrawalAnalysis.percentageChanges.averageWithdrawAmount,
              isMoney: true,
            },
          ]}
        />
      </Box>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4} sm={12}>
            <CustomPieChart
              data={pieData}
              title="حالات السحب"
              colors={["#F6E192", "#D6D9E1", "#99d1ebff", "#6CE9A5"]}
              CustomTooltip={CustomTooltip}
            />
          </Grid>
          <Grid item xs={12} lg={8} sm={12}>
            <BarChartBox
              title="توزيع السحب"
              data={withdrawalAnalysis.amountRanges}
              xKey="range"
              barKey="count"
              barName="عدد المحافظ"
              barColor={constants.colors.secondary}
              customTooltip={CustomTooltip}
              xAxisLabel="فئة الرصيد"
              yAxisLabel="عدد المحافظ"
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default WithdrawalAnalysis;
