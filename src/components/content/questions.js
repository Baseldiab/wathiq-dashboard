import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import constants from "@/services/constants";
import Button from "@/components/button";
import Backdrop from "@/components/backdrop";
import { getAllQuestions, handleReload } from "@/Redux/slices/questionSlice.js";
import { useSelector, useDispatch } from "react-redux";
import Loader from "@/components/loader";
import { buildQueryParams, hasRole } from "@/services/utils";
import {
  Typography,
  Box,
  Menu,
  Accordion,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import QuestionRemove from "@/components/content/question-popup/question-remove.js";
import QuestionModification from "@/components/content/question-popup/question-modification.js";
import CategoryRemove from "@/components/content/category-popup/category-remove.js";
import CategoryModification from "@/components/content/category-popup/category-modification.js";
import Input from "@/components/inputs";
import { getAllQuestionCategories } from "@/Redux/slices/questionCategorySlice";
import TabItem from "../tab-item";
import { styles } from "../globalStyle";
import FilterMenu from "../filter-menu";
import CustomSnackbar from "../toastMsg";
export default function Questions({}) {
  const { t } = useTranslation();
  const tabItems = [
    {
      text: t("components_content_questions.الاسئلة"),
      id: 1,
      role: ["create question", "update question", "delete question"],
    },
    {
      text: t("components_content_questions.الاقسام"),
      id: 2,
      role: ["create category", "update category", "delete category"],
    },
  ];
  const [filterData, setFilterData] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState({});
  const [source, setSource] = useState("");
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const [switchStates, setSwitchStates] = useState([]);
  const [OpenAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState({ msg: "", type: "" });
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
  const { allQuestions, reload, loading } = useSelector(
    (state) => state.question
  );
  const {
    allQuestionCategories,
    reload: categoryReLoad,
    categoryLoading,
  } = useSelector((state) => state.questionCategory);

  const dispatch = useDispatch();

  useEffect(() => {
    if (allQuestions) {
      setSwitchStates(allQuestions.data.map((item) => true));
    }
  }, [allQuestions]);

  useEffect(() => {
    if (!allQuestions || reload) {
      dispatch(getAllQuestions());
    }
  }, [reload]);

  useEffect(() => {
    if (!allQuestionCategories || categoryReLoad) {
      dispatch(getAllQuestionCategories());
    }
  }, [dispatch, categoryReLoad]);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleItemChange = (id) => {
    setSelectedItem(id);
  };

  const handleResetData = () => {
    handleCloseMenu();
    setFilterData({});
    dispatch(handleReload());
  };

  const showBackDropContent = () => {
    switch (type) {
      case "question-remove":
        return (
          <QuestionRemove
            question={selectedQuestion}
            handleClose={handleClose}
            setOpenAlert={setOpenAlert}
            setAlert={setAlert}
          />
        );
      case "question-modification":
        return (
          <QuestionModification
            source={source}
            question={selectedQuestion}
            handleClose={handleClose}
            setOpenAlert={setOpenAlert}
            setAlert={setAlert}
            OpenAlert={OpenAlert}
            alert={alert}
          />
        );
      case "category-remove":
        return (
          <CategoryRemove
            question={selectedQuestionCategory}
            handleClose={handleClose}
            setOpenAlert={setOpenAlert}
            setAlert={setAlert}
          />
        );
      case "category-modification":
        return (
          <CategoryModification
            source={source}
            category={selectedQuestionCategory}
            handleClose={handleClose}
            setOpenAlert={setOpenAlert}
            setAlert={setAlert}
            OpenAlert={OpenAlert}
            alert={alert}
          />
        );
      default:
        break;
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedQuestion({});
    setSelectedQuestionCategory({});
  };

  const handleOpenQuestionPopup = (type, question = {}) => {
    if (Object.keys(question).length > 0) {
      setSelectedQuestion(question);
      setSource("EDIT");
    } else {
      setSource("ADD");
    }
    setType(type);
    handleOpen();
  };

  const handleSubmitFilter = () => {
    handleCloseMenu();
    dispatch(getAllQuestions(buildQueryParams({ ...filterData })));
  };

  const handleChange = (e, index) => {
    setSwitchStates((prevState) =>
      prevState.map((state, i) => (i === index ? !state : state))
    );
  };

  const handleOpenQuestionCategoryPopup = (type, job = {}) => {
    if (Object.keys(job).length > 0) {
      setSelectedQuestionCategory(job);
      setSource("EDIT");
    } else {
      setSource("ADD");
    }
    setType(type);
    handleOpen();
  };

  const showBoxContent = () => {
    switch (selectedItem) {
      case 1:
        return (
          <>
            {allQuestions?.data?.length > 0
              ? allQuestions?.data?.map((question, index) => (
                  <Accordion
                    sx={{
                      background: "#FAFAFA",
                      borderRadius: "12px !important",
                      padding: "12px",
                      boxShadow: "none",
                      border: "1px #E1E1E2 solid",
                      my: 2,
                      "&::before": {
                        background: "transparent",
                      },
                    }}
                  >
                    <AccordionSummary
                      //   expandIcon={
                      // <ExpandMoreIcon
                      //   sx={{
                      //     transform: "translate(25px, 40px)", // Rotate icon initially
                      //     mx: 3,
                      //   }}
                      // />
                      //   }
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: "#202726",
                              fontSize: "0.9rem",
                              fontWeight: "700",
                              // mx: 2.5,
                              // mt: 2,
                            }}
                          >
                            {question?.question}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: constants.colors.main,
                              fontSize: "0.9rem",
                              fontWeight: "700",
                            }}
                          >
                            {question?.category?.name}
                          </Typography>
                          {hasRole("update question") && (
                            <Box sx={{ cursor: "pointer" }}>
                              <img
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenQuestionPopup(
                                    "question-modification",
                                    question
                                  );
                                }}
                                src="/images/icons/edit-table.svg"
                              />
                            </Box>
                          )}
                          {hasRole("delete question") && (
                            <Box sx={{ cursor: "pointer" }}>
                              <img
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenQuestionPopup(
                                    "question-remove",
                                    question
                                  );
                                }}
                                src="/images/icons/trash.svg"
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      dangerouslySetInnerHTML={{
                        __html: ` ${question?.answer}  `,
                      }}
                      sx={{
                        color: "#6F6F6F",
                        fontSize: "1rem",
                        fontWeight: "400",
                      }}
                    ></AccordionDetails>
                  </Accordion>
                ))
              : null}
          </>
        );

      case 2:
        return allQuestionCategories?.data?.length > 0 ? (
          <TableContainer
            sx={{
              textAlign: "right",
              boxShadow: "none",
              border: "1px solid #D6D9E1",
              borderRadius: "12px",
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    {t("components_content_questions.اسم_القسم")}
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allQuestionCategories?.data?.length > 0 &&
                  allQuestionCategories?.data?.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell align="left">
                        <Box
                          sx={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            justifyContent: "end",
                            mx: 2,
                          }}
                        >
                          {hasRole("update category") && (
                            <Box sx={{ cursor: "pointer" }}>
                              <img
                                onClick={() =>
                                  handleOpenQuestionCategoryPopup(
                                    "category-modification",
                                    item
                                  )
                                }
                                src="/images/edit.svg"
                              />
                            </Box>
                          )}
                          {hasRole("delete category") && (
                            <Box sx={{ cursor: "pointer" }}>
                              <img
                                onClick={() =>
                                  handleOpenQuestionCategoryPopup(
                                    "category-remove",
                                    item
                                  )
                                }
                                src="/images/icons/trash.svg"
                              />
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <Typography>
              {t("components_content_questions.لا_توجد_اقسام")}
            </Typography>
          </Box>
        );
      default:
        break;
    }
  };
  const handleFilterChange = (value, name) => {
    setFilterData({ ...filterData, [name]: value });
  };

  if (loading || categoryLoading) return <Loader open={true} />;

  return (
    <>
      <Box
        sx={{
          ...styles.boxData,
        }}
      >
        <Box
          sx={{
            ...styles.tabsItemContainer,
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
        <Box
          sx={{
            width: "100%",
            ...styles.dataSpaceBetween,
          }}
        >
          {selectedItem === 1 ? (
            <>
              <Typography
                sx={{
                  fontSize: "1.3rem",
                  // flex: 1,
                  fontWeight: 700,
                  color: "#202726",
                  flex: 1,
                  display: "flex",
                }}
              >
                {t("components_content_questions.الاسئلة")}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  flex: "none",
                  display: "flex",
                  gap: "12px",
                }}
              >
                {hasRole("create question") && (
                  <Button
                    handleClick={() =>
                      handleOpenQuestionPopup("question-modification")
                    }
                    text={t("components_content_questions.اضافة_سؤال")}
                    // type="add"
                    // customeStyle={{ p: "16px", height: "2.5rem" }}
                  />
                )}
                <Box
                  id="basic-button"
                  aria-controls={menuOpen ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? "true" : undefined}
                >
                  <Button
                    customeStyle={{
                      background: "#FFFFFF",
                      border: "1px solid #D6D9E1",
                      color: "#202726",
                      "&:hover": {
                        background: "#FFFFFF",
                        border: "1px solid #D6D9E1",
                        boxShadow: "none",
                      },
                      // p: "16px",
                      // height: "2.5rem",
                    }}
                    handleClick={handleOpenMenu}
                    text={t("components_content_questions.تصفية")}
                    type="filter"
                  />

                  {/*  */}
                  <FilterMenu
                    anchorEl={anchorEl}
                    menuOpen={menuOpen}
                    handleCloseMenu={handleCloseMenu}
                    title={t("components_content_questions.تصفية")}
                    onCloseIconClick={handleCloseMenu}
                    handleSubmitFilter={handleSubmitFilter}
                    handleResetData={handleResetData}
                  >
                    {/* custom dynamic content */}
                    <Box>
                      <Input
                        label={t("components_content_questions.القسم")}
                        placeholder={t(
                          "components_content_questions.حدد_القسم"
                        )}
                        type="selectbox"
                        valuesOption={allQuestionCategories?.data}
                        handleChange={handleFilterChange}
                        value={filterData?.category}
                        name="category"
                        customStyle={{ width: "100%" }}
                      />
                    </Box>
                  </FilterMenu>
                  {/*  */}
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Typography
                sx={{
                  fontSize: "1.3rem",
                  // flex: 1,
                  fontWeight: 700,
                  color: "#202726",
                  flex: 1,
                  display: "flex",
                }}
              >
                {t("components_content_questions.الاقسام")}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  flex: "none",
                  display: "flex",
                  gap: "12px",
                }}
              >
                {hasRole("create category") && (
                  <Button
                    handleClick={() =>
                      handleOpenQuestionCategoryPopup("category-modification")
                    }
                    // customeStyle={{ p: "16px", height: "2.5rem" }}
                    text={t("components_content_questions.اضافة_قسم")}
                    // type="add"
                  />
                )}
              </Box>
            </>
          )}
        </Box>

        <Box>{showBoxContent()}</Box>
        <Backdrop
          open={open}
          setOpen={setOpen}
          handleOpen={handleOpen}
          handleClose={handleClose}
          component={
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                maxHeight: "85%",
                overflow: "auto",
                width: {
                  xs: "90%",
                  sm: "80%",
                  md: "60%",
                  lg: "45%",
                  xl: "30%",
                },
              }}
            >
              {showBackDropContent()}
            </Box>
          }
        />
      </Box>
      <CustomSnackbar
        open={OpenAlert}
        setOpen={setOpenAlert}
        message={alert.msg}
        type={alert.type}
      />
    </>
  );
}
