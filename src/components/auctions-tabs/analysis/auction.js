import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CustomLineChart from "@/components/LineChartBox";
import { getAuctions } from "@/Redux/slices/analysisSlice";
import Loader from "@/components/loader";
import GavelIcon from "@mui/icons-material/Gavel";
import MainCard from "@/components/MainCard";
import constants from "@/services/constants";

export default function AuctionAnalysis() {
  const dispatch = useDispatch();
  const { auctiondata, auctionloading, auctionerror } = useSelector(
    (state) => state?.analysis
  );

  useEffect(() => {
    dispatch(getAuctions());
  }, [dispatch]);

  const auctionAnalysis = auctiondata?.data;

  if (auctionloading || !auctionAnalysis) return <Loader open={true} />;

  const dailyAnalysis = auctionAnalysis.dailyAnalysisLastMonth?.map((item) => ({
    date: item.date,
    total: item.total,
    private: item.specialToSupportAuthorityTrue,
    public: item.specialToSupportAuthorityFalse,
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
        <Box sx={{ width: { sm: "100%", md: "100%", lg: "40%" } }}>
          <MainCard
            icon={<GavelIcon sx={{ color: constants.colors.secondary }} />}
            title="إجمالي المزادات"
            mainValue={auctionAnalysis.totalAuctions}
            stats={[
              {
                label: "مزادات انفاذ",
                value: auctionAnalysis.specialToSupportAuthorityTrue,
                percentage: auctionAnalysis.percentageTrue,
              },
              {
                label: "مزادات  خاصة",
                value: auctionAnalysis.specialToSupportAuthorityFalse,
                percentage: auctionAnalysis.percentageFalse,
              },
            ]}
          />
        </Box>

        <CustomLineChart
          title="نسبة مزادات انفاذ إلى الخاصة"
          data={dailyAnalysis}
          xKey="date"
          lines={[
            {
              key: "private",
              label: "المزادات الخاصة",
              color: constants.colors.secondary,
            },
            {
              key: "public",
              label: "مزادات انفاذ",
              color: "#22A06B",
            },
          ]}
        />
      </Box>
    </>
  );
}
