import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { getUserType } from "@/services/utils";

export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.post(`/${userType}/departments`, data);
      return response.data;
    } catch (error) {
      console.log("errrrrrrrrror", error);
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async ({ data, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.patch(`/${userType}/departments/${id}`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getDepartment = createAsyncThunk(
  "department/getDepartment",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/departments/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAvailableDepartment = createAsyncThunk(
  "department/getAvailableDepartment",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/departments/${id}/managers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.delete(`/${userType}/departments/${id}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getDepartments = createAsyncThunk(
  "role/getDepartments",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/departments?${params}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getAllDepartments = createAsyncThunk(
  "role/getAllDepartments",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/departments?limit=1000`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const departmentSlice = createSlice({
  name: "department",
  initialState: {
    departments: null,
    allDepartments: null,
    error: null,
    loading: false,
    updateLoading: false,
    reload: false,
  },
  reducers: {
    handleReload: (state, action) => {
      state.reload = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDepartments.pending, (state, action) => {
        state.departments = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.departments = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });
    builder.addCase(getAllDepartments.fulfilled, (state, action) => {
      state.allDepartments = action.payload;
    });
    //
    builder
      .addCase(createDepartment.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder
      .addCase(updateDepartment.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder
      .addCase(deleteDepartment.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
  },
});

export const { handleReload } = departmentSlice.actions;
export default departmentSlice.reducer;
