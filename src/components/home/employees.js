import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import Button from "@/components/button";
import Pagination from "@/components/pagination";
import { setStatusStyle, buildQueryParams, hasRole } from "@/services/utils.js";
import {
  Typography,
  Box,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Input from "@/components/inputs";
import Backdrop from "@/components/backdrop";
import EmployeeDetails from "@/components/home/employess-popup/employee-details.js";
import EmployeeModification from "@/components/home/employess-popup/employee-modification.js";
import {
  getAllEmployees,
  getEmployees,
  resetAvailableDepartments,
  handleReload,
} from "@/Redux/slices/employeeSlice";
import { useSelector, useDispatch } from "react-redux";
import { getAllDepartments } from "@/Redux/slices/departmentSlice";
import Loader from "@/components/loader";
import { getAllProviders } from "@/Redux/slices/providerSlice";
import { useRouter } from "next/router";
import { styles } from "../globalStyle";
import FilterMenu from "../filter-menu";
import constants from "@/services/constants";
import NoData from "../no-data";

export default function Employees() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [selectedEm, setSelectedEm] = useState({});
  const [filterData, setFilterData] = useState({});

  const [source, setSource] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const router = useRouter();

  const dispatch = useDispatch();
  const { employees, allEmployees, loading, reload, updateLoading } =
    useSelector((state) => state.employee);
  const { loading: userLoading } = useSelector((state) => state.user);
  const { allDepartments } = useSelector((state) => state.department);
  const { approvedProviders } = useSelector((state) => state.provider);
  const { data: profile } = useSelector((state) => state.profile);
  const { blockSelectedUserLoading } = useSelector((state) => state.user);
  useEffect(() => {
    if ((!employees || reload) && hasRole("get employees")) {
      dispatch(getEmployees(buildQueryParams({ ...filterData, page })));
    }
  }, [dispatch, page, reload]);

  useEffect(() => {
    if (employees) {
      setPage(employees?.pagination?.currentPage);
      setTotalCount(employees?.pagination?.totalPages);
    }
  }, [employees]);

  useEffect(() => {
    if (!allDepartments) dispatch(getAllDepartments());
    if (!approvedProviders && profile?.data?.type === "admin")
      dispatch(getAllProviders(buildQueryParams({ status: "approved" })));
    if (!allEmployees) dispatch(getAllEmployees());
  }, []);

  const handleFilterChange = (value, name) => {
    console.log("filterData", filterData);
    console.log("name", name);
    console.log("value", value);

    setFilterData({ ...filterData, [name]: value });
  };

  const handleSubmitFilter = () => {
    // console.log("...filterData", ...filterData);
    handleCloseMenu();
    dispatch(getEmployees(buildQueryParams({ ...filterData, page })));
  };

  const handleOpenMenu = (event) => {
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
    setSelectedEm({});
    dispatch(resetAvailableDepartments());
  };

  const showBackDropContent = () => {
    switch (type) {
      case "em-details":
        return (
          <EmployeeDetails
            page={page}
            filterData={filterData}
            employee={selectedEm}
            handleClose={handleClose}
            handleOpen={handleOpen}
          />
        );
      case "em-modification":
        return (
          <EmployeeModification
            source={source}
            employee={selectedEm}
            handleClose={handleClose}
          />
        );
      default:
        break;
    }
  };

  const handleOpenEmPopup = (type, employee = {}) => {
    if (Object.keys(employee).length > 0) {
      setSelectedEm(employee);
      setSource("EDIT");
    } else {
      setSource("ADD");
    }
    setType(type);
    handleOpen();
  };
  // const uniqueAddedBy = allEmployees?.data
  //   ? Array.from(new Set(allEmployees.data.map((item) => item?.addedBy)))
  //   : [];
  const uniqueAddedBy = allEmployees?.data
    ?.map((item) => item?.addedBy)
    ?.filter(
      (user, index, self) => index === self.findIndex((u) => u._id === user._id)
    );

  if (loading || blockSelectedUserLoading || updateLoading)
    return <Loader open={true} />;
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
          {t("components_home_employees.الموظفين")}
        </Typography>
        <Box
          sx={{
            flex: 1,
            flex: "none",
            display: "flex",
            gap: "12px",
          }}
        >
          {hasRole("create employee") && (
            <Button
              handleClick={() => handleOpenEmPopup("em-modification")}
              text={t("components_home_employees.اضافة_موظف")}
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
            {hasRole("get employees") && (
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
                text={t("components_home_employees.تصفية")}
                type="filter"
              />
            )}
            {/*  */}
            <FilterMenu
              anchorEl={anchorEl}
              menuOpen={menuOpen}
              handleCloseMenu={handleCloseMenu}
              title={t("components_home_employees.تصفية")}
              onCloseIconClick={handleCloseMenu}
              handleSubmitFilter={handleSubmitFilter}
              handleResetData={handleResetData}
            >
              {/* custom dynamic content */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {hasRole("get depdepartment") && (
                  <Box>
                    <Input
                      label={t("components_home_employees.حدد_القسم")}
                      placeholder={
                        allDepartments?.data.length > 0
                          ? t("components_home_employees.القسم")
                          : t("components_home_employees.لا_يوجد_اقسام")
                      }
                      disabled={allDepartments?.data.length == 0}
                      type="selectbox"
                      valuesOption={allDepartments?.data}
                      handleChange={handleFilterChange}
                      value={filterData?.department}
                      name="department"
                      customStyle={{ width: "100%" }}
                    />
                  </Box>
                )}
                <Box>
                  <Input
                    label={t("components_home_employees.تم_انشاء_بواسطة")}
                    placeholder={t(
                      "components_home_employees.تم_إنشائة_بواسطة"
                    )}
                    type="selectbox"
                    valuesOption={uniqueAddedBy}
                    handleChange={handleFilterChange}
                    value={filterData?.addedBy}
                    name="addedBy"
                    customStyle={{ width: "100%" }}
                  />
                </Box>
                {hasRole("get providers") &&
                  profile?.data?.type === "admin" && (
                    <Box>
                      <Input
                        label={t("components_home_employees.تابع_لشركة")}
                        placeholder={t("components_home_employees.تابع_لشركة")}
                        type="selectbox"
                        valuesOption={approvedProviders?.data}
                        handleChange={handleFilterChange}
                        value={filterData?.provider}
                        name="provider"
                        customStyle={{ width: "100%" }}
                      />
                    </Box>
                  )}
                <Box>
                  <Input
                    label={t("components_home_employees.الحالة")}
                    placeholder={t("components_home_employees.الحالة")}
                    type="selectbox"
                    valuesOption={[
                      { name: t("components_home_employees.نشط"), _id: false },
                      { name: t("components_home_employees.محظور"), _id: true },
                    ]}
                    handleChange={handleFilterChange}
                    value={filterData?.blocked}
                    name="blocked"
                    customStyle={{ width: "100%" }}
                  />
                </Box>
              </Box>
            </FilterMenu>
            {/*  */}
          </Box>
        </Box>
      </Box>

      {hasRole("get employees") && (
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
                  {t("components_home_employees.تم_انشاء_بواسطة")}
                </TableCell>
                <TableCell align="right">
                  {t("components_home_employees.اسم_الموظف")}
                </TableCell>
                <TableCell align="right">
                  {t("components_home_employees.المسمي_الوظيفي")}
                </TableCell>
                <TableCell align="right">
                  {t("components_home_employees.القسم")}
                </TableCell>
                {profile?.data?.type === "admin" && (
                  <TableCell align="right">
                    {t("components_home_employees.تابع_لشركة")}
                  </TableCell>
                )}
                <TableCell align="right">
                  {t("components_home_employees.الحالة")}
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees?.data?.length > 0 ? (
                employees.data.map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item?.addedBy?.name}
                    </TableCell>
                    <TableCell align="right">{item?.name}</TableCell>
                    <TableCell align="right">{item?.role?.name}</TableCell>
                    <TableCell align="right">
                      {item?.department?.name}
                    </TableCell>
                    {profile?.data?.type === "admin" && (
                      <TableCell align="right">
                        {item?.provider?.name}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <Typography
                        sx={{
                          ...setStatusStyle(
                            item?.blocked?.value
                              ? t("components_home_employees.محظور")
                              : t("components_home_employees.نشط")
                          ),
                        }}
                      >
                        {item?.blocked?.value
                          ? t("components_home_employees.محظور")
                          : t("components_home_employees.نشط")}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          gap: "24px",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          onClick={() => handleOpenEmPopup("em-details", item)}
                          sx={{
                            ...styles.detailsBtnTable,
                            borderColor: "#D6D9E1",
                            color: "#2E353F",
                          }}
                        >
                          {t("components_home_employees.التفاصيل")}
                        </Typography>
                        {hasRole("update employee") && (
                          <img
                            onClick={() =>
                              handleOpenEmPopup("em-modification", item)
                            }
                            src="/images/icons/edit-table.svg"
                            style={{ cursor: "pointer" }}
                          />
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
                      desc="لا يوجد موظفين"
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

      {employees?.data?.length > 0 && hasRole("get employees") && (
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
              {t("components_home_employees.من")}
            </Typography>
            <Typography
              sx={{ color: "#000000", fontWeight: 700, fontSize: "1rem" }}
            >
              {employees?.pagination?.resultCount}
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
        // handleClose={() => (type === "em-details" ? null : handleClose())}
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
                md: "65%",
                lg: "55%",
                xl: "50%",
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
