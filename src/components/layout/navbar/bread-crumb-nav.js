import constants from "@/services/constants";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useRouter } from "next/router";

const BreadcrumbsNav = ({ title, links, currentText }) => {
  const router = useRouter();

  const handleNavigation = (href) => {
    router.push(href);
  };
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#202726",
          mb: { xs: "16px", md: "24px" },
        }}
      >
        {title}
      </Typography>
      <Breadcrumbs separator=" / " aria-label="breadcrumb">
        {links
          .filter(Boolean) 
          .map((link, index) => (
            <Box
              key={index}
              sx={{
                cursor: !link.noHref ? "pointer" : "default",
                color: "inherit",
              }}
              onClick={
                !link.noHref ? () => handleNavigation(link.href) : undefined
              }
            >
              {link.label}
            </Box>
          ))}
        <Typography color={constants.colors.main}>{currentText}</Typography>
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsNav;
