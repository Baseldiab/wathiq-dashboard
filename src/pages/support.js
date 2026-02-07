import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import constants from "@/services/constants";
import Questions from "@/components/content/questions.js";
import Policies from "@/components/content/policies.js";
import MainPage from "@/components/content/mainPage.js";
import HomeControl from "@/components/content/homeControl.js";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@/Redux/slices/profileSlice";
import { getAllQuestions } from "@/Redux/slices/questionSlice";
import { getAllQuestionCategories } from "@/Redux/slices/questionCategorySlice";
import { useRouter } from "next/router";
import TabItem from "@/components/tab-item";
import { styles } from "@/components/globalStyle";
import { getAllContactUs } from "@/Redux/slices/supportSlice";
import SupportTable from "@/components/support-table";
import { hasRole } from "@/services/utils";

export default function Support() {
  const { t } = useTranslation();
  
const tabItems = [
  { text: t("pages_support.إستفسار"), id: 1 },
  { text: t("pages_support.إقتراح"), id: 2 },
  { text: t("pages_support.شكوى"), id: 3 },
  { text: t("pages_support.اخري"), id: 4 },
];
  const [selectedItem, setSelectedItem] = useState(1);

  const dispatch = useDispatch();
  const router = useRouter();

  const { data: profile } = useSelector((state) => state.profile);

  const handleItemChange = (id) => {
    setSelectedItem(id);
  };

  useEffect(() => {
    // if (profile?.data?.type !== "admin") router.push("/");
    if (!hasRole("manage contact us")) router.push("/");
  }, []);

  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <SupportTable supportType="question" supportTypear={t("pages_support.إستفسار")} />;
      case 2:
        return (
          <SupportTable supportType="suggestion" supportTypear="إقتراح

" />
        );
      case 3:
        return <SupportTable supportType="complaint" supportTypear="شكوى

" />;
      case 4:
        return <SupportTable supportType="other" supportTypear="اخري

" />;
      default:
        break;
    }
  };
  return (
    <>
      <Head>
        <title>{t("pages_support.الدعم_الفني")}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#202726",
            mb: { xs: "16px", md: "24px" },
          }}
        >
          الدعم الفني{" "}
        </Typography>
        <Box
          sx={{
            ...styles.tabsItemContainer,
            mb: { xs: "16px", md: "24px" },
            flexWrap: "wrap",
          }}
        >
          {tabItems.map((item) => (
            <TabItem
              item={item}
              selectedItem={selectedItem}
              handleItemChange={handleItemChange}
            />
          ))}
        </Box>

        <Box>{showBoxContent()}</Box>
      </>
    </>
  );
}
