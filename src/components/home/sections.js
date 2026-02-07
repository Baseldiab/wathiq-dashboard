import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import Button from "@/components/button";
import Pagination from "@/components/pagination";
import { formatDate } from "@/services/utils";
import {
  Typography,
  Box,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Input from "@/components/inputs";
import Backdrop from "@/components/backdrop";
import SectionRemove from "@/components/home/section-popup/section-remove.js";
import SectionModification from "@/components/home/section-popup/section-modification.js";
import {
  getAllDepartments,
  getDepartments,
  handleReload,
} from "@/Redux/slices/departmentSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { getAllProviders } from "@/Redux/slices/providerSlice";
import Loader from "@/components/loader";
import { buildQueryParams, hasRole } from "@/services/utils";
import { useRouter } from "next/router";
import { styles } from "../globalStyle";
import FilterMenu from "../filter-menu";
import constants from "@/services/constants";
import NoData from "../no-data";

export default function Section() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [selectedSection, setSelectedSection] = useState({});
  const [source, setSource] = useState("");
  const [filterData, setFilterData] = useState({});
  //
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const router = useRouter();

  const dispatch = useDispatch();
  const { departments, loading, reload, allDepartments } = useSelector(
    (state) => state.department
  );

  const { approvedProviders } = useSelector((state) => state.provider);
  const { data: profile } = useSelector((state) => state.profile);

  useEffect(() => {
    if ((!departments || reload) && hasRole("get departments")) {
      dispatch(getDepartments(buildQueryParams({ ...filterData, page })));
    }
  }, [dispatch, page, reload]);

  useEffect(() => {
    if (departments) {
      setPage(departments?.pagination?.currentPage);
      setTotalCount(departments?.pagination?.totalPages);
    }
  }, [departments]);

  useEffect(() => {
    if (!approvedProviders && profile?.data?.type === "admin")
      dispatch(getAllProviders(buildQueryParams({ status: "approved" })));
    if (!allDepartments) dispatch(getAllDepartments());
  }, []);

  const handleFilterChange = (value, name) => {
    setFilterData({ ...filterData, [name]: value });
  };

  const handleSubmitFilter = () => {
    handleCloseMenu();
    dispatch(getDepartments(buildQueryParams({ ...filterData, page })));
  };

  const handleOpenMenu = (event) => {
    dispatch(getAllDepartments());

    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleResetData = () => {
    handleCloseMenu();
    setFilterData({});
    dispatch(handleReload());
  };

  const handlePaginationChange = (e, currentPage) => {
    setPage(currentPage);
    dispatch(handleReload());
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedSection({});
  };

  const showBackDropContent = () => {
    switch (type) {
      case "section-remove":
        return (
          <SectionRemove
            department={selectedSection}
            handleClose={handleClose}
          />
        );
      case "section-modification":
        return (
          <SectionModification
            source={source}
            department={selectedSection}
            handleClose={handleClose}
          />
        );
      default:
        break;
    }
  };

  const handleOpenSectionPopup = (type, section = {}) => {
    if (Object.keys(section).length > 0) {
      setSelectedSection(section);
      setSource("EDIT");
    } else {
      setSource("ADD");
    }
    setType(type);
    handleOpen();
  };

  if (loading) return <Loader open={true} />;

  return (
    <Box
      sx={{
        padding: "20px",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "38px",
        background: "#fff",
        width: "100%",
      }}
    >
      <Box
        sx={{
          ...styles.dataSpaceBetween,
        }}
      >
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
          {t("components_home_sections.الاقسام")}
        </Typography>
        <Box
          sx={{
            flex: 1,
            flex: "none",
            display: "flex",
            gap: "12px",
          }}
        >
          {hasRole("create department") && (
            <Button
              handleClick={() => handleOpenSectionPopup("section-modification")}
              text={t("components_home_sections.اضافة_قسم")}
              // type="add"
              // customeStyle={{ p: "16px", height: "2.5rem" }}
            />
          )}
          {departments?.data?.length > 0 && hasRole("get departments") && (
            <Box
              id="basic-button"
              aria-controls={menuOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
            >
              <Button
                customeStyle={{
                  background: "#FFFFFF",
                  border: `1px solid ${constants.colors.main}`,
                  color: constants.colors.main,
                  "&:hover": {
                    background: "#FFFFFF",
                    border: `1px solid ${constants.colors.main}`,
                    boxShadow: "none",
                  },
                  // p: "16px",
                  // height: "2.5rem",
                  fontWeight: "600",
                }}
                handleClick={handleOpenMenu}
                text={t("components_home_sections.تصفية")}
                type="filter"
              />
              {/*  */}
              <FilterMenu
                anchorEl={anchorEl}
                menuOpen={menuOpen}
                handleCloseMenu={handleCloseMenu}
                title={t("components_home_sections.تصفية")}
                onCloseIconClick={handleCloseMenu}
                handleSubmitFilter={handleSubmitFilter}
                handleResetData={handleResetData}
              >
                {hasRole("get department") && (
                  <Input
                    label="اسم القسم	"
                    placeholder="حدد اسم القسم	"
                    type="selectbox"
                    valuesOption={allDepartments?.data?.map(
                      (item, index) => item.name
                    )}
                    handleChange={handleFilterChange}
                    value={filterData?.search}
                    name="search"
                    customStyle={{ width: "100%", mb: 2 }}
                  />
                )}
                <Input
                  label="مدير القسم	"
                  placeholder="حدد مدير القسم	"
                  type="selectbox"
                  valuesOption={allDepartments?.data?.map(
                    (item, index) => item.manager
                  )}
                  handleChange={handleFilterChange}
                  value={filterData?.manager}
                  name="manager"
                  customStyle={{ width: "100%", mb: 2 }}
                />
              </FilterMenu>
              {/*  */}
            </Box>
          )}
        </Box>
      </Box>

      {hasRole("get departments") && (
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
                <TableCell>{t("components_home_sections.اسم_القسم")}</TableCell>
                <TableCell>
                  {t("components_home_sections.مدير_القسم")}
                </TableCell>
                <TableCell>
                  {t("components_home_sections.تاريخ_اضافة_القسم")}
                </TableCell>
                {/* {profile?.data?.type === "admin" && (
                  <TableCell align="right">{t("components_home_sections.الشركة")}</TableCell>
                )} */}
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments?.data?.length > 0 ? (
                departments?.data.map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item?.name}
                    </TableCell>
                    <TableCell align="right">{item?.manager?.name}</TableCell>
                    <TableCell align="right">
                      {formatDate(item?.createdAt)}
                    </TableCell>
                    {/* {profile?.data?.type === "admin" && (
                      <TableCell align="right">
                        {item?.provider?.name}
                      </TableCell>
                    )} */}

                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          gap: "24px",
                          justifyContent: "center",
                          ml: 2,
                        }}
                      >
                        {hasRole("update department") && (
                          <Box sx={{ cursor: "pointer" }}>
                            <img
                              onClick={() =>
                                handleOpenSectionPopup(
                                  "section-modification",
                                  item
                                )
                              }
                              src="/images/edit.svg"
                            />
                          </Box>
                        )}
                        {hasRole("delete department") && (
                          <Box sx={{ cursor: "pointer" }}>
                            <img
                              onClick={() =>
                                handleOpenSectionPopup("section-remove", item)
                              }
                              src="/images/icons/trash.svg"
                            />
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <NoData
                      // img="images/auction.svg"
                      desc={t("components_home_sections.لا_يوجد_أقسام")}
                      // onClick={() => router.push("/auctions/create-auction")}
                      // add
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {departments?.data?.length > 0 && hasRole("get departments") && (
        <Box
          sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <Typography
              sx={{ color: "#6F6F6F", fontWeight: 700, fontSize: "1rem" }}
            >
              {t("components_home_sections.من")}
            </Typography>
            <Typography
              sx={{ color: "#000", fontWeight: 700, fontSize: "1rem" }}
            >
              {departments?.pagination?.resultCount}
            </Typography>
          </Box>

          <Pagination
            handleChange={handlePaginationChange}
            page={page}
            count={totalCount}
          />
        </Box>
      )}
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
  );
}
