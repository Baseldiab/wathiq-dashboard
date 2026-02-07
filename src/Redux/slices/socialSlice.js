import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";

export const fetchSocialData = createAsyncThunk(
  "contact/fetchSocialData",
  async (_, { rejectWithValue }) => {
    try {
      console.log("apiiiii"); 
      const profileData = store.getState()?.profile?.data?.data;
      const userType =
        profileData?.type ||
        (profileData?.employeeType?.includes("admin")
          ? "admin"
          : profileData?.employeeType?.includes("provider")
          ? "providers"
          : null);

      const response = await api.get(`/${userType}/social`);
      console.log("API Response:", response.data);

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(
        error?.response?.data?.errors?.[0]?.message || "Unknown Error"
      );
    }
  }
);

export const updateSocialData = createAsyncThunk(
  "contact/updateSocialData ",
  async (data, thunkAPI) => {
    console.log("data,data",data);

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
      const response = await api.patch(`/${userType}/social`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const socialSlice = createSlice({
  name: "social",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialData.pending, (state) => {
        console.log("pindinng");

        state.loading = true;
      })
      .addCase(fetchSocialData.fulfilled, (state, action) => {
        console.log("full");

        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSocialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSocialData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSocialData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateSocialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default socialSlice.reducer;
