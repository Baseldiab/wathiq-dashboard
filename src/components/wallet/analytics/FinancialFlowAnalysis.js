import React from "react";
import { Box, Grid } from "@mui/material";
import CustomLineChart from "@/components/LineChartBox";
import { CustomTooltip } from "@/components/CustomTooltip";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/loader";
import StatsCard from "@/components/StatsWithPieChartCard";
import MainCard from "@/components/MainCard";
import constants from "@/services/constants";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const FinancialFlowAnalysis = ({ data }) => {
  const dispatch = useDispatch();

  const { walletdata, walletloading, walleterror } = useSelector((state) => {
    return state?.analysis;
  });

  const financialFlow = walletdata?.data?.financialFlow;
  const trends = walletdata?.data?.trends;
  if (walletloading || !financialFlow || !trends) return <Loader open={true} />;
  const stats = [
    {
      title: "إجمالي الأموال في النظام",
      current: financialFlow.totalMoneyInSystem,
      isMoney: true,
    },
    {
      title: "إجمالي الأموال المتاحة",
      current: financialFlow.totalAvailableAmount,
      isMoney: true,
    },
    {
      title: "المبالغ المعلقة",
      current: financialFlow.totalPendingAmount,
      isMoney: true,
    },
    {
      title: "إجمالي الرسوم المحصلة",
      current: financialFlow.totalFeesGenerated,
      isMoney: true,
    },
    {
      title: "إجمالي أرباح المزودين",
      current: financialFlow.totalProviderEarnings,
      isMoney: true,
    },
    {
      title: "نسبة التدفقات المالية",
      current: financialFlow.paymentFlowRatio,
      suffix: "%",
    },
    {
      title: "نسبة السيولة",
      current: financialFlow.liquidityRatio,
      suffix: "%",
    },
  ];

  return (
    <>
      <Grid container spacing={2} mb={5}>
        <Grid item xs={12} md={6}>
          <MainCard
            icon={
              <AccountBalanceWalletIcon
                sx={{ color: constants.colors.secondary }}
                fontSize="medium"
              />
            }
            title="إجمالي الأموال"
            mainValue={financialFlow.totalMoneyInSystem}
            isMoney={true}
            stats={[
              {
                label: "إجمالي الأموال المتاحة",
                value: financialFlow.totalAvailableAmount,
                isMoney: true,
              },
              {
                label: "المبالغ المعلقة",
                value: financialFlow.totalPendingAmount,
                isMoney: true,
              },
              {
                label: "إجمالي الرسوم المحصلة",
                value: financialFlow.totalFeesGenerated,
                isMoney: true,
              },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <MainCard
            icon={
              <AccountBalanceWalletIcon
                sx={{ color: constants.colors.secondary }}
                fontSize="medium"
              />
            }
            title="مؤشرات التدفق"
            mainValue={financialFlow.totalProviderEarnings}
            stats={[
              {
                label: "نسبة التدفقات المالية",
                value: financialFlow.paymentFlowRatio,
                suffix: "%",
              },
              {
                label: "نسبة السيولة",
                value: financialFlow.liquidityRatio,
                suffix: "%",
              },
            ]}
          />
        </Grid>
      </Grid>
      <CustomLineChart
        title="المعدل اليومي لإنشاء المحافظ "
        data={trends.dailyWalletCreation}
        xKey="date"
        lines={[
          { key: "count", label: "عدد المحافظ", color: "#00DB81" },
          { key: "date", label: "التاريخ", color: "#FF9800" },
          {
            key: "totalBalance",
            label: "المبلغ الكلي",
            color: constants.colors.main,
          },
        ]}
        // tooltip={CustomTooltip}
      />
    </>
  );
};

export default FinancialFlowAnalysis;
