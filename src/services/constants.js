import { Box } from "@mui/material";
export default {
  colors: {
    main: "#18365F",
    secondary: "#1C4F92",
    black: "#24262D",
    dark_black: "#161008",
    green: "#00DB81",
    grey: "#6F6F6F",
    dark_green: "#202726",
    light_blue: "#E1ECF9",
    light_blueWith_opacity: "#1C4F921A",
    light_grey: "#FAFAFA",
    warning_red: "#FE4D4F",
    dark_grey: "#D6D9E1",
    light_green: "#22A06B",
  },

  footer: {
    sections: [
      { text: "الرئيسية", link: "/home" },
      { text: "المزادات", link: "/auction" },
      { text: "تواصل معنا", link: "/contact-us" },
      { text: "الأسئلة الشائعة", link: "/frequently-asked-question" },
    ],
    other: [
      { text: "الشروط والاحكام", link: "/home" },
      { text: "ترخيص الهيئة العامة للعقار", link: "/auction" },
    ],
    contact: [
      { text: "تواصل معنا", link: "/home", icon: "" },
      { text: "920008806", link: "/auction" },
      { text: "جدة حي الرويس شارع حائل 23213", link: "/contact-us" },
    ],
  },
  symbol: ({ filter = false, width = { xs: "12px", md: "20px" } } = {}) => (
    <Box
      component="img"
      src="/images/icons/SAR.svg"
      sx={{
        fontSize: "inherit",
        marginRight: "2px",
        display: "inline",
        width: width,
        ...(filter && {
          filter: "brightness(0) saturate(100%) invert(100%)",
        }),
      }}
    />
  ),
};
