import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { getUserType } from "@/services/utils";

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.post(`/${userType}/employees`, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.message
        ? error.response?.data?.errors?.[0]?.message
        : "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async ({ data, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.patch(`/${userType}/employees/${id}`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getEmployee = createAsyncThunk(
  "employee/getEmployee",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/employees/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAvailableDepartmentForEmployee = createAsyncThunk(
  "employee/getAvailableDepartmentForEmployee",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(
        `/${userType}/employees/${id}/available-departments`
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

// export const deleteEmployee = createAsyncThunk(
//   "employee/deleteEmployee",
//   async ({ type, id }, thunkAPI) => {
//     const { rejectWithValue } = thunkAPI;
//     try {
//       const response = await api.delete(`/${type}/employees/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const getEmployees = createAsyncThunk(
  "employee/getEmployees",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/employees?${params}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getAllEmployees = createAsyncThunk(
  "employee/getAllEmployees",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/employees?limit=1000`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getRolesFordeoartment = createAsyncThunk(
  "employee/getRolesFordeoartment",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(
        `/${userType}/employees/available-roles${
          id ? `?departmentId=${id}` : ""
        }`
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: null,
    allEmployees: null,
    availableDepartments: null,
    availableRoles: null,
    error: null,
    loading: false,
    reload: false,
    updateLoading: false,
    createEmError: null,
  },
  reducers: {
    resetAvailableDepartments: (state, action) => {
      state.availableDepartments = null;
    },
    handleReload: (state, action) => {
      state.reload = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state, action) => {
        state.employees = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.employees = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });
    //
    builder.addCase(getAllEmployees.fulfilled, (state, action) => {
      state.allEmployees = action.payload;
    });
    //
    builder
      .addCase(createEmployee.pending, (state, action) => {
        state.updateLoading = true;
        state.createEmError = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.createEmError = action.payload;
        state.updateLoading = false;
        console.log("state.createEmError", state.createEmError);
      });
    //
    builder
      .addCase(updateEmployee.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder.addCase(
      getAvailableDepartmentForEmployee.fulfilled,
      (state, action) => {
        state.availableDepartments = action.payload;
      }
    );

    //
    builder.addCase(getRolesFordeoartment.fulfilled, (state, action) => {
      state.availableRoles = action.payload;
    });

    // builder
    //   .addCase(deleteEmployee.pending, (state, action) => {
    //     state.updateLoading = true;
    //   })
    //   .addCase(deleteEmployee.fulfilled, (state, action) => {
    //     state.reload = true;
    //     state.updateLoading = false;
    //   })
    //   .addCase(deleteEmployee.rejected, (state, action) => {
    //     state.error = action.payload;
    //     state.updateLoading = false;
    //   });
  },
});

export const { resetAvailableDepartments, handleReload } =
  employeeSlice.actions;
export default employeeSlice.reducer;
