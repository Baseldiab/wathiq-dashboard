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
import ContactForm from "@/components/content/contact-us";
import { hasRole } from "@/services/utils";

export default function ContentControl() {
  const { t } = useTranslation();
  const tabItems = [
    {
      text: t("pages_content-control.الاسئلة_الشائعة"),
      id: 1,
      role: [
        "create question",
        "update question",
        "delete question",
        "create category",
        "update category",
        "delete category",
      ],
    },
    {
      text: t("pages_content-control.الشروط_و_الاحكام"),
      id: 2,
      role: ["manage privacy policy"],
    },
    // {
    //   text: t("pages_content-control.الشاشة_الرئيسية"),
    //   id: 3,
    //   role: ["manage sliders", "manage partners"],
    // },
    {
      text: t("pages_content-control.تواصل_معنا"),
      id: 4,
      role: ["manage social"],
    },
    {
      text: t("pages_content-control.اخري"),
      id: 5,
      role: ["manage auction logos"],
    },
  ];
  const filteredTabItems = tabItems.filter(
    (item) => !item.role || hasRole(item.role)
  );
  const [selectedItem, setSelectedItem] = useState(
    filteredTabItems[0]?.id || null
  );

  useEffect(() => {
    if (filteredTabItems.length > 0) {
      setSelectedItem(filteredTabItems[0].id);
    }
  }, [filteredTabItems.length]);
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: profile } = useSelector((state) => state.profile);
  const { allQuestions, loading, reload } = useSelector(
    (state) => state.question
  );
  const { allQuestionCatefories } = useSelector(
    (state) => state.questionCategory
  );

  const handleItemChange = (id) => {
    setSelectedItem(id);
  };

  useEffect(() => {
    // if (profile?.data?.type !== "admin") router.push("/");
  });

  useEffect(() => {
    if (!allQuestions) dispatch(getAllQuestions());
    if (!allQuestionCatefories) dispatch(getAllQuestionCategories());
    // dispatch(getAllQuestionCategories());
    // dispatch(getAllQuestions());
  }, []);

  useEffect(() => {
    if (!profile?.data?._id) {
      dispatch(getProfile());
    }
  }, []);

  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return <Questions />;
      case 2:
        return <Policies />;
      case 3:
        return <MainPage />;
      case 4:
        return <ContactForm />;
      case 5:
        return <HomeControl />;
      default:
        break;
    }
  };
  return (
    <>
      <Head>
        <title>{t("pages_content-control.ادارة_المحتوي")}</title>
        <meta name="description" content="broker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <Box
            sx={{
              ...styles.tabsItemContainer,
            }}
          >
            {filteredTabItems.map((item) => (
              <TabItem
                item={item}
                selectedItem={selectedItem}
                handleItemChange={handleItemChange}
              />
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            {showBoxContent()}
          </Box>
        </Box>
      </main>
    </>
  );
}
