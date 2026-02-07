import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { getUserType } from "@/services/utils";

export const createRole = createAsyncThunk(
  "role/createRole",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.post(`/${userType}/roles`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const updateRole = createAsyncThunk(
  "role/updateRole",
  async ({ data, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.patch(`/${userType}/roles/${id}`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getRole = createAsyncThunk(
  "role/getRole",
  async ({ type, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/roles/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getRoles = createAsyncThunk(
  "role/getRoles",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(
        `/${userType}/roles${
          userType === "admin" ? `?adminRole=true&${params}` : `?${params}`
        }${``}`
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getAllRoles = createAsyncThunk(
  "role/getAllRoles",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(
        `/${userType}/roles?limit=1000${
          userType === "admin" ? "&adminRole=true" : ""
        }`
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.delete(`/${userType}/roles/${id}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const roleSlice = createSlice({
  name: "role",
  initialState: {
    roles: null,
    allRoles: null,
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
      .addCase(getRoles.pending, (state, action) => {
        state.roles = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.roles = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });
    //
    builder.addCase(getAllRoles.fulfilled, (state, action) => {
      state.allRoles = action.payload;
    });

    //
    builder
      .addCase(createRole.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder
      .addCase(updateRole.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder
      .addCase(deleteRole.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
  },
});

export const { handleReload } = roleSlice.actions;
export default roleSlice.reducer;
