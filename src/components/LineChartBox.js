// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";

// export default function LineChartBox({ data }) {
//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//         <YAxis allowDecimals={false} />
//         <Tooltip
//           formatter={(value, name) => [value, name === "count" ? "Wallets" : name]}
//           labelStyle={{ fontWeight: "bold" }}
//         />
//         <Line
//           type="monotone"
//           dataKey="count"
//           stroke="#4CAF50"
//           strokeWidth={2}
//           dot={{ r: 4 }}
//           activeDot={{ r: 6 }}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// }
import { Box, Typography } from "@mui/material";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomLineChart = ({ title, data, xKey, lines, tooltip }) => {
  return (
    <Box
      sx={{
        p: 5,
        borderRadius: "16px",
        backgroundColor: "#fff",
        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
        minHeight: 500,
        mb: 5,
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
      <ResponsiveContainer width="100%" height={300} maxWidt={600}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} dy={2} />
          <YAxis dx={-35} />
          <Tooltip content={tooltip} />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="linear" // أو "step" بدل "monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 10 }}
              name={line.label} // ← دا اللي بيظهر في Legend
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CustomLineChart;
