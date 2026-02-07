import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { getUserType } from "@/services/utils";

export const getAllProperty = createAsyncThunk(
  "contact/getAllProperty",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const profileData = store.getState()?.profile?.data?.data;
      const userType =
        profileData?.type ||
        (profileData?.employeeType?.includes("admin")
          ? "admin"
          : profileData?.employeeType?.includes("provider")
          ? "providers"
          : null);
      const response = await api.get(`/${userType}/property-management?${params}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const PropertySlice = createSlice({
  name: "property",
  initialState: {
    //getAllProperty
    allPropertyData: null,
    allPropertyLoading: false,
    allPropertyError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //all users
    builder

      // allPropertyData
      .addCase(getAllProperty.pending, (state, action) => {
        state.allPropertyData = null;
        state.allPropertyError = null;
        state.allPropertyLoading = true;
      })
      .addCase(getAllProperty.fulfilled, (state, action) => {
        state.allPropertyData = action.payload;
        state.allPropertyError = null;
        state.allPropertyLoading = false;
      })
      .addCase(getAllProperty.rejected, (state, action) => {
        state.allPropertyData = null;
        state.allPropertyError = action.payload;
        state.allPropertyLoading = false;
      });
  },
});

export default PropertySlice.reducer;
