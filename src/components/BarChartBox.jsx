import React from "react";
import { Box, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
  Label,
} from "recharts";

const BarChartBox = ({
  title,
  data = [],
  xKey = "x",
  barKey = "y",
  barColor = "#6CE9A5",
  //   barName = "Value",
  xAxisLabel,
  yAxisLabel,
  customTooltip,
}) => {
  return (
    <Box
      // sx={{
      //   background: "#fff",
      //   borderRadius: 3,
      //   p: { xs: 2, md: 3 },
      //   height: "100%",
      //   // width:"100%"
      // }}

      sx={{
        p: 5,
        borderRadius: "16px",
        // border: "1px solid #D6D9E1",
        backgroundColor: "#fff",
        // boxShadow: "none",
        mb: 5,
        maxHeight: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
       boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",

      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 600,
          fontSize: "20px",
          color: "#222",
        }}
      >
        {title}
      </Typography>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          barSize={40}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xKey}
            //   tick={{ angle: -30, textAnchor: 'start' }}
            height={50}
            interval={0}
            tickMargin={0}
          >
            {xAxisLabel && (
              <Label value={xAxisLabel} offset={0} position="insideBottom" />
            )}
          </XAxis>
          <YAxis tick={{ fontSize: 13 }} tickMargin={20}>
            {yAxisLabel && (
              <Label
                value={yAxisLabel}
                angle={-90}
                position="insideLeft"
                offset={10}
              />
            )}
          </YAxis>
          <Tooltip content={customTooltip || undefined} />
          <Bar
            dataKey={barKey}
            // name={barName}
            fill={barColor}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartBox;
