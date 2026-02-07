import React from "react";
import { Box, Card, Typography, Tooltip, Divider } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const StatsWithPieChartCard = ({
  title,
  value,
  percentage,
  chartData = [],
  // نفس ألوانك الافتراضية
  colors = ["#0b423fff", "#99D1EB", "#F6E192"],
}) => {
  const COLOR_BY_STATUS = {
    "مستخدمو الجوال": "#0b423fff", 
    "مستخدمو الويب": "#90B7EA", 
    "مستخدمون غير معروفين": "#FFF7D7", 
  };

  const getLabel = (entry) =>
    entry?.statues ?? entry?.status ?? entry?.name ?? "";
  const getColor = (entry, index) =>
    COLOR_BY_STATUS[getLabel(entry)] ?? colors[index % colors.length];

  const isEmpty = chartData.every((d) => Number(d.percentage) === 0);
  const fallbackData = [{ name: "No Data", percentage: 100 }];

  const renderPercentageChip = (pct) => {
    if (pct === undefined || pct === null) return null;
    const isPositive = pct >= 0;
    return (
      <Box
        display="inline-flex"
        alignItems="center"
        gap={0.5}
        fontWeight={700}
        fontSize="14px"
        color={isPositive ? "#4CAF50" : "#F44336"}
        bgcolor={isPositive ? "#E8F5E9" : "#FFEBEE"}
        px={1}
        py={0.5}
        borderRadius="20px"
      >
        {Math.abs(pct).toFixed(2)}%
        {isPositive ? (
          <TrendingUpIcon sx={{ fontSize: 16 }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 16 }} />
        )}
      </Box>
    );
  };

  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: "1px solid #D6D9E1",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        p: 3,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 5,
      }}
    >
      {/* النصوص */}
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        gap={1}
        pl={2}
      >
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Tooltip title={value?.toLocaleString()}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                maxWidth: 160,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {value?.toLocaleString()}
            </Typography>
            {renderPercentageChip(percentage)}
          </Box>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ m: 5 }} />

      {/* الرسم + الليجند */}
      <Box
        flex="0 0 140px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {/* Pie Chart */}
        <Box width={100} height={100}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={isEmpty ? fallbackData : chartData}
                dataKey="percentage"
                innerRadius={35}
                outerRadius={50}
                stroke="none"
              >
                {(isEmpty ? fallbackData : chartData).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={isEmpty ? "#E0E0E0" : getColor(entry, index)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* الليجند */}
        {!isEmpty && (
          <Box mt={1} width="100%">
            {chartData.map((entry, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={1}
                justifyContent="flex-start"
                mb={0.5}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: getColor(entry, index),
                  }}
                />
                <Typography variant="caption" noWrap>
                  {getLabel(entry)}: {entry.percentage}%
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default StatsWithPieChartCard;
