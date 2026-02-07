import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Typography, Box, Grid } from "@mui/material";

export const CustomPieChart = ({
  data = [],
  title = "Pie Chart",
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00C49F"],
  CustomTooltip,
  type,
}) => {
  const isAllZero = data.every((item) => Number(item.percentage) === 0);

  const fallbackData = [{ name: "No Data", percentage: 100 }];
  const fallbackColor = "#E0E0E0"; // رمادي فاتح

  return (
    <Box
      sx={{
        p: 5,
        borderRadius: "16px",
        backgroundColor: "#fff",
        // boxShadow: "none",
        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",

        mb: 5,
        // border: type === "platform" ? "none" : "1px solid #D6D9E1",
        maxHeight: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6" mb={2} fontWeight="bold">
        {title}
      </Typography>

      <ResponsiveContainer width="100%" height={258}>
        <PieChart>
          <Pie
            data={isAllZero ? fallbackData : data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={80}
            outerRadius={100}
            dataKey="percentage"
          >
            {(isAllZero ? fallbackData : data).map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={isAllZero ? fallbackColor : colors[index % colors.length]}
              />
            ))}
          </Pie>
          {!isAllZero && <Tooltip content={CustomTooltip} />}
        </PieChart>
      </ResponsiveContainer>

      {/* {!isAllZero && ( */}
      <Grid container spacing={1} mt={3}>
        {data.map((entry, index) => (
          <Grid item xs={6} sm={data.length <= 3 ? 12 : 6} key={index}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  backgroundColor: colors[index % colors.length],
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2" noWrap>
                {entry.statues}: {entry.percentage}%
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      {/* )} */}
    </Box>
  );
};
