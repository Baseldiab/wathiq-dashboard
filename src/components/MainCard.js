import { Box, Card, Typography, Divider, Avatar, Tooltip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import constants from "@/services/constants";

const symbol = constants.symbol({
  width: { xs: "10px", md: "10px" },
});

const renderPercentageChip = (percentage) => {
  if (percentage === undefined || percentage === null || percentage === 0)
    return null;

  const isPositive = percentage >= 0;
  const percentageColor = isPositive ? "#4CAF50" : "#F44336";
  const percentageBg = isPositive ? "#E8F5E9" : "#FFEBEE";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontWeight: 700,
        fontSize: "14px",
        color: percentageColor,
        backgroundColor: percentageBg,
        padding: "4px 8px",
        borderRadius: "20px",
      }}
    >
      {Math.abs(percentage)} %
      {isPositive ? (
        <TrendingUpIcon sx={{ fontSize: 18 }} />
      ) : (
        <TrendingDownIcon sx={{ fontSize: 18 }} />
      )}
    </Box>
  );
};

const formatValue = (value, suffix, isMoney, options = {}) => {
  const str = value?.toLocaleString(); // ex: 14,407.692
  const plainStr = String(value).replace(/\D/g, ""); // remove commas, keep digits
  const isDecimal = String(value).includes(".");
  const groups = str?.split(",");
  const short = !isDecimal && plainStr.length > 20; // فقط لو رقم كبير و مش عشري

  const shortenedStr = short ? "..." + groups?.slice(0, 3).join(",") : str;

  return (
    <Tooltip title={short ? str : ""}>
      <Box display="inline-flex" alignItems="center" gap={0.5}>
        <Typography
          sx={{
            fontSize: options.isMain ? "32px" : "14px",
            fontWeight: options.isMain ? 700 : 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            // textOverflow: "ellipsis",
            textOverflow: short ? "clip" : "unset", // أو "hidden"

            maxWidth: short ? "200px" : "none",
            display: "inline-block",
            // mt: options.isMain ? 2 : 1,
          }}
        >
          {shortenedStr}
        </Typography>
        {isMoney && symbol}
        {suffix && <Typography variant="caption">{suffix}</Typography>}
      </Box>
    </Tooltip>
  );
};

export default function MainCard({
  icon,
  title,
  mainValue,
  stats = [],
  isMoney = false, // ✅ أضفنا ده
  suffix = "",
}) {
  return (
    <Card
      sx={{
        display: "flex",
        p: 2,
        borderRadius: "16px",
        border: "1px solid #D6D9E1",
        backgroundColor: "#fff",
        boxShadow: "none",
        mb: 5,
        // width: 600,
        minHeight: "220px",
      }}
    >
      {/* Right Section: Main Value */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        pr={2}
      >
        <Box display="flex" gap={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: constants.colors.light_blueWith_opacity,
              width: 40,
              height: 40,
            }}
          >
            {icon}
          </Avatar>
          <Typography fontSize={14} fontWeight={500} color="#7F7F7F">
            {title}
          </Typography>
        </Box>

        {formatValue(mainValue, suffix, isMoney, { isMain: true })}
      </Box>

      {/* Divider */}
      {stats.length > 0 && (
        <Divider orientation="vertical" flexItem sx={{ m: 2 }} />
      )}

      {/* Left Section: Additional Stats */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        gap={2}
        justifyContent={"center"}
      >
        {stats.map((item, index) => (
          <Box key={index}>
            <Typography fontSize={14} fontWeight={500} color="#7F7F7F">
              {item.label}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1" fontWeight="bold">
                {formatValue(item.value, item.suffix, item.isMoney)}
              </Typography>
              {renderPercentageChip(item.percentage)}
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
