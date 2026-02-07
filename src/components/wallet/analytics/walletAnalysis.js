import { Grid } from "@mui/material";
import BarChartBox from "@/components/BarChartBox";
import { CustomTooltip } from "@/components/CustomTooltip";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "@/Redux/slices/analysisSlice";
import { useEffect } from "react";
import Loader from "@/components/loader";
import MainCard from "@/components/MainCard";
import constants from "@/services/constants";

export default function WalletAnalysis() {
  const dispatch = useDispatch();
  const { walletdata, walletloading } = useSelector((state) => {
    return state?.analysis;
  });
  useEffect(() => {
    dispatch(getWallet());
  }, [dispatch]);
  const walletAnalysis = walletdata?.data?.walletAnalysis;
  if (walletloading || !walletAnalysis) return <Loader open={true} />;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <MainCard
            title="إجمالي المحافظ"
            icon={
              <AccountBalanceWalletIcon
                sx={{ color: constants.colors.secondary }}
                fontSize="medium"
              />
            }
            mainValue={walletAnalysis.current.totalWallets}
            stats={[
              {
                label: "محافظ المستخدمين",
                value: walletAnalysis.current.userWallets,
                percentage: walletAnalysis.percentageChanges.userWallets,
              },
              {
                label: "محافظ المزودين",
                value: walletAnalysis.current.providerWallets,
                percentage: walletAnalysis.percentageChanges.providerWallets,
              },
              {
                label: "المحافظ النشطة",
                value: walletAnalysis.current.activeWallets,
                percentage: walletAnalysis.percentageChanges.activeWallets,
              },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <MainCard
            title="إجمالي الرصيد"
            icon={
              <AccountBalanceWalletIcon
                sx={{ color: constants.colors.secondary }}
                fontSize="medium"
              />
            }
            mainValue={walletAnalysis.current.totalBalance}
            isMoney={true}
            stats={[
              {
                label: "الأموال المجمّدة",
                value: walletAnalysis.current.totalHeldFunds,
                percentage: walletAnalysis.percentageChanges.totalHeldFunds,
                isMoney: true,
              },
              {
                label: "متوسط الرصيد",
                value: walletAnalysis.current.averageBalance,
                percentage: walletAnalysis.percentageChanges.averageBalance,
                isMoney: true,
              },
            ]}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <BarChartBox
            title="توزيع الرصيد"
            data={walletAnalysis.balanceDistribution}
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
    </>
  );
}
