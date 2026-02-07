import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import Button from "@/components/button";
import Pagination from "@/components/pagination";
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
import JobRemove from "@/components/home/job-popup/job-remove.js";
import JobModification from "@/components/home/job-popup/job-modification.js";
import { getAllRoles, getRoles, handleReload } from "@/Redux/slices/roleSlice";
import { useSelector, useDispatch } from "react-redux";
import Loader from "@/components/loader";
import { getAllProviders } from "@/Redux/slices/providerSlice";
import { buildQueryParams, hasRole } from "@/services/utils";
import { useRouter } from "next/router";
import { styles } from "../globalStyle";
import FilterMenu from "../filter-menu";
import constants from "@/services/constants";
import PopupTitle from "../popup-title";
import NoData from "../no-data";
export default function JobTitle() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [selectedJob, setSelectedJob] = useState({});
  const [source, setSource] = useState("");
  const [filterData, setFilterData] = useState({});
  //
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const { permissions } = useSelector((state) => state.global);

  const router = useRouter();

  const dispatch = useDispatch();
  const { roles, loading, reload, allRoles } = useSelector(
    (state) => state.role
  );
  const { approvedProviders } = useSelector((state) => state.provider);
  const { data: profile } = useSelector((state) => state.profile);
  console.log(
    "rolllle",
    allRoles?.data?.map((item, index) => item.name)
  );

  useEffect(() => {
    if (!roles || reload) {
      dispatch(getRoles(buildQueryParams({ ...filterData, page })));
    }
  }, [dispatch, page, reload]);

  useEffect(() => {
    if (roles) {
      setPage(roles?.pagination?.currentPage);
      setTotalCount(roles?.pagination?.totalPages);
    }
  }, [roles]);

  useEffect(() => {
    if (!approvedProviders && profile?.data?.type === "admin")
      dispatch(getAllProviders(buildQueryParams({ status: "approved" })));
    if (!allRoles && hasRole("get roles")) dispatch(getAllRoles());
  }, []);
  const transformPermissions = (data) => {
    const transformed = { ...data };
    if (Array.isArray(data.permissions)) {
      data.permissions.forEach((perm, index) => {
        transformed[`permissions[${index}]`] = perm;
      });
      delete transformed.permissions; // Remove the original array key
    }

    return transformed;
  };

  const handleFilterChange = (value, name) => {
    setFilterData({ ...filterData, [name]: value });
  };

  const handleSubmitFilter = () => {
    handleCloseMenu();
    // dispatch(getRoles(buildQueryParams({ ...filterData, page })));
    dispatch(
      getRoles(buildQueryParams(transformPermissions({ ...filterData, page })))
    );
  };

  const handleOpenMenu = (event) => {
    dispatch(getAllRoles());
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
    setSelectedJob({});
  };
  console.log("selectedJob", selectedJob);
  console.log("selectedJob?.permissions", selectedJob?.permissions != []);
  const showBackDropContent = () => {
    switch (type) {
      case "job-remove":
        return <JobRemove job={selectedJob} handleClose={handleClose} />;
      case "job-modification":
        return (
          <JobModification
            job={selectedJob}
            source={source}
            handleClose={handleClose}
          />
        );
      case "show-roles":
        return (
          <Box
            sx={{
              border: "1px solid #EBEEF3",
              borderRadius: "12px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              background: "#fff",
              width: "100%",
            }}
          >
            {" "}
            <PopupTitle
              title={t("components_home_jobTitle.الصلاحيات")}
              handleClose={handleClose}
            />
            <Box
              align="right"
              sx={{
                display: "flex",
                justifyContent: "start",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {selectedJob?.permissions?.length > 0 ? (
                selectedJob.permissions.map((permission, index) => (
                  <Typography
                    key={index}
                    sx={{
                      borderRadius: "12px",
                      padding: "10px 14px",
                      background: "#F8FAFA",
                      color: "#656565",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                    }}
                  >
                    {permission}
                  </Typography>
                ))
              ) : (
                <>
                  <Typography
                    sx={{
                      color: "#656565",
                      fontSize: "1rem",
                      textAlign: "center",
                      fontWeight: "600",
                      width: "100%",
                    }}
                  >
                    {t("components_home_jobTitle.جميع_الصلاحيات")}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        );

      default:
        break;
      // show-roles
    }
  };

  const handleOpenJobPopup = (type, job = {}) => {
    if (Object.keys(job).length > 0) {
      setSelectedJob(job);
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
          الصلاحيات{" "}
        </Typography>
        <Box
          sx={{
            flex: 1,
            flex: "none",
            display: "flex",
            gap: "12px",
          }}
        >
          {hasRole("create role") && (
            <Button
              handleClick={() => handleOpenJobPopup("job-modification")}
              text={t("components_home_jobTitle.إضافة_صلاحية")}
              // type="add"
              // customeStyle={{ p: "16px", height: "2.5rem" }}
            />
          )}
          {roles?.data.length > 0 && hasRole("get roles") && (
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
                text={t("components_home_jobTitle.تصفية")}
                type="filter"
              />
              {/*  */}
              <FilterMenu
                anchorEl={anchorEl}
                menuOpen={menuOpen}
                handleCloseMenu={handleCloseMenu}
                title={t("components_home_jobTitle.تصفية")}
                onCloseIconClick={handleCloseMenu}
                handleSubmitFilter={handleSubmitFilter}
                handleResetData={handleResetData}
              >
                {/* custom dynamic content */}
                {/* {profile?.data?.type === "admin" && (
                  <Box>
                    <Input
                      label={t("components_home_jobTitle.الشركة")}
                      placeholder={t("components_home_jobTitle.حدد_الشركة")}
                      type="selectbox"
                      valuesOption={approvedProviders?.data}
                      handleChange={handleFilterChange}
                      value={filterData?.provider}
                      name="provider"
                      customStyle={{ width: "100%", mb: 2 }}
                    />
                  </Box>
                )} */}
                {hasRole("get roles") && (
                  <Input
                    label={t("components_home_jobTitle.الصلاحيات")}
                    placeholder={t("components_home_jobTitle.حدد_الصلاحيات")}
                    type="selectbox"
                    valuesOption={permissions?.data}
                    handleChange={(value) =>
                      handleFilterChange(value, "permissions")
                    }
                    value={filterData?.permissions || []}
                    name="permissions"
                    customStyle={{ width: "100%", mb: 2 }}
                    multiple={true}
                  />
                )}
              </FilterMenu>
              {/*  */}
            </Box>
          )}
        </Box>
      </Box>
      {hasRole("get roles") && (
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
                  {t("components_home_jobTitle.المسمي_الوظيفي")}
                </TableCell>
                {/* {profile?.data?.type === "admin" && (
                  <TableCell align="right">{t("components_home_jobTitle.الشركة")}</TableCell>
                )} */}
                <TableCell align="right">
                  {t("components_home_jobTitle.الصلاحيات")}
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles?.data?.length > 0 ? (
                roles?.data?.map((item) => {
                  const isOwner =
                    profile?.data?.type == "admin" ||
                    profile?.data?.type == "providers" ||
                    item?.createdBy?.employee?.employeeId ===
                      profile?.data?._id;

                  const canEdit = isOwner && hasRole("update role");
                  const canDelete = isOwner && hasRole("delete role");
                  return (
                    <TableRow
                      key={item._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      {/* {profile?.data?.type === "admin" && (
                      <TableCell align="right">
                        {item?.provider?.name ? item?.provider?.name : "N/A"}
                      </TableCell>
                    )} */}
                      <TableCell align="right">
                        <Typography
                          sx={{
                            textDecoration: "underline",
                            color: constants.colors.main,
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenJobPopup("show-roles", item)}
                        >
                          عرض الصلاحيات{" "}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            gap: "24px",
                            alignItems: "end",
                            justifyContent: "center",
                            ml: 2,
                          }}
                        >
                          {canEdit && (
                            <Box sx={{ cursor: "pointer" }}>
                              <img
                                onClick={() =>
                                  handleOpenJobPopup("job-modification", item)
                                }
                                src="/images/edit.svg"
                                alt="edit"
                              />
                            </Box>
                          )}

                          {canDelete && (
                            <Box sx={{ cursor: "pointer" }}>
                              <img
                                onClick={() =>
                                  handleOpenJobPopup("job-remove", item)
                                }
                                src="/images/icons/trash.svg"
                                alt="delete"
                              />
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <NoData
                      // img="icons/no-employee.svg"
                      desc="لا يوجد صلاحيات"
                      // btnTitle={"إضافة مسمي وظيفي"}
                      // onClick={() => handleOpenJobPopup("job-modification")}
                      // role={hasRole("create role")}
                      // add
                    />
                  </TableCell>
                </TableRow>
              )}{" "}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {roles?.data.length > 0 && hasRole("get roles") && (
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
              {t("components_home_jobTitle.من")}
            </Typography>
            <Typography
              sx={{ color: "#000000", fontWeight: 700, fontSize: "1rem" }}
            >
              {roles?.pagination?.resultCount}
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
