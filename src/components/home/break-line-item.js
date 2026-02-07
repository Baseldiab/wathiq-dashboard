// EmployeeInfoItem.jsx
import { Box, Typography } from "@mui/material";
import constants from "@/services/constants";

export const BreakLineInfo = ({ label, value }) => {
  if (!value) return null; // Optionally skip rendering if value is empty

  return (
    <Box>
      <Typography
        sx={{
          color: constants.colors.dark_black,
          fontSize: "0.8rem",
          fontWeight: 700,
          mb: "8px",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: constants.colors.black,
          fontSize: "0.8rem",
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};
