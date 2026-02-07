import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { getUserType } from "@/services/utils";

export const updatePolicy = createAsyncThunk(
  "policy/updatePolicy",
  async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.patch(`/${userType}/privacy-policy`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getPolicy = createAsyncThunk(
  "policy/getPolicy",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/privacy-policy`);
      return response.data;
    } catch (error) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const policySlice = createSlice({
  name: "role",
  initialState: {
    policy: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPolicy.pending, (state, action) => {
        state.policy = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getPolicy.fulfilled, (state, action) => {
        state.policy = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getPolicy.rejected, (state, action) => {
        state.policy = null;
        state.error = action.payload;
        state.loading = false;
      });

    builder
      .addCase(updatePolicy.pending, (state, action) => {
        state.policy = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(updatePolicy.fulfilled, (state, action) => {
        state.policy = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(updatePolicy.rejected, (state, action) => {
        state.policy = null;
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const {} = policySlice.actions;
export default policySlice.reducer;
