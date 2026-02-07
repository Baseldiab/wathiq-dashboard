import constants from "@/services/constants";
import { Box, Typography } from "@mui/material";

export const CustomTooltip = ({ active, payload, type }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: 2,
          borderRadius: 2,
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
          fontSize: "14px",
        }}
      >
        {type === "platform" ? (
          <>
            <Typography variant="body2">
              <strong>النوع:</strong> {item.statues}
            </Typography>
            <Typography variant="body2">
              <strong>النسبة:</strong> {item.percentage}%
            </Typography>
            <Typography variant="body2">
              <strong>عدد المستخدمين:</strong> {item.count}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body2">
              {item.statues && (
                <span>
                  <strong>الحالة:</strong> {item.statues}
                </span>
              )}
            </Typography>
            <Typography variant="body2">
              {item.percentage && (
                <span>
                  <strong>النسبة:</strong> {item.percentage}%
                </span>
              )}
            </Typography>
            <Typography variant="body2">
              <strong>عدد المحافظ:</strong> {item.count}
            </Typography>
            <Typography variant="body2">
              <strong>المبلغ الكلي:</strong>{" "}
              {item.totalAmount || item.totalValue || item.totalBalance}{" "}
              {constants.symbol({ width: { xs: "10px", md: "10px" } })}
            </Typography>
          </>
        )}
      </Box>
    );
  }

  return null;
};
