import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";

export const createOrigin = createAsyncThunk(
  "auctions/createOrigin",
  async (payload = {}, thunkAPI) => {
    console.log(payload);

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
      const response = await api.post(
        `/${userType}/auctions/${
          store.getState()?.auctions?.auction?.data?._id
        }/origins`,
        payload
      );
      return response.data;
    } catch (error) {
      console.log("error", error);
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const EditOrigin = createAsyncThunk(
  "auctions/EditOrigin",
  async ({ id, formData }, thunkAPI) => {
    console.log("Payload:", id, formData);

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
      const response = await api.patch(
        `/${userType}/auctions/${
          store.getState()?.auctions?.auction?.data?._id
        }/origins/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const deleteOrigin = createAsyncThunk(
  "auctions/deleteOrigin",
  async (id, thunkAPI) => {
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
      const response = await api.delete(
        `/${userType}/auctions/${
          store.getState()?.auctions?.auction?.data?._id
        }/origins/${id}`
      );
      return response.data;
    } catch (error) {
      console.log("Error:", error);
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getOrigin = createAsyncThunk(
  "auctions/getOrigin",
  async (id, thunkAPI) => {
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
      const response = await api.get(
        `/${userType}/auctions/${
          store.getState()?.auctions?.auction?.data?._id
        }/origins/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const stopWorkAuction = createAsyncThunk(
  "auctions/stopWorkAuction",
  async ({ auctionId, originId }, thunkAPI) => {
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
      const response = await api.patch(
        `/${userType}/auctions/${auctionId}/stopped/${originId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const originSlice = createSlice({
  name: "origins",
  initialState: {
    /**create origin */
    createdOriginsData: null,
    createdOriginsLoading: false,
    createdOriginsError: null,
    /** one origin */
    origin: null,
    loadingOrigin: false,
    errorOrigin: null,
    originsList: [],
    /**Edit origin */
    editOriginsData: null,
    editOriginsLoading: false,
    editOriginsError: null,
    /**delete origin */
    deleteOriginsData: null,
    deleteOriginsLoading: false,
    deleteOriginsError: null,
    /** toggle work auction */
    stopWorkAuctionFlag: false,
    loadingStopWorkAuction: false,
    errorStopWorkAuction: null,
  },
  reducers: {
    setOrigins: (state, action) => {
      state.originsList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /**create origin */
      .addCase(createOrigin.pending, (state) => {
        state.createdOriginsData = false;
        state.createdOriginsError = null;
        state.createdOriginsLoading = true;
      })
      .addCase(createOrigin.fulfilled, (state, action) => {
        state.createdOriginsData = action.payload;
        state.createdOriginsError = false;
        state.createdOriginsLoading = false;
      })
      .addCase(createOrigin.rejected, (state, action) => {
        state.createdOriginsData = null;
        state.createdOriginsError = action.payload || "حدث خطأ";
        state.createdOriginsLoading = false;
      })
      /**edit origin */
      .addCase(EditOrigin.pending, (state) => {
        state.editOriginsData = false;
        state.editOriginsError = null;
        state.editOriginsLoading = true;
      })
      .addCase(EditOrigin.fulfilled, (state, action) => {
        state.editOriginsData = action.payload;
        state.editOriginsError = false;
        state.editOriginsLoading = false;
      })
      .addCase(EditOrigin.rejected, (state, action) => {
        state.editOriginsData = null;
        state.editOriginsError = action.payload || "حدث خطأ";
        state.editOriginsLoading = false;
      })
      /**delete origin */
      .addCase(deleteOrigin.pending, (state) => {
        state.deleteOriginsData = false;
        state.deleteOriginsError = null;
        state.deleteOriginsLoading = true;
      })
      .addCase(deleteOrigin.fulfilled, (state, action) => {
        state.deleteOriginsData = action.payload;
        state.deleteOriginsError = false;
        state.deleteOriginsLoading = false;
      })
      .addCase(deleteOrigin.rejected, (state, action) => {
        state.deleteOriginsData = null;
        state.deleteOriginsError = action.payload || "حدث خطأ";
        state.deleteOriginsLoading = false;
      })
      /**one Origin */
      .addCase(getOrigin.pending, (state, action) => {
        state.origin = null;
        state.errorOrigin = null;
        state.loadingOrigin = true;
      })
      .addCase(getOrigin.fulfilled, (state, action) => {
        state.origin = action.payload;
        state.originsList = action.payload;
        state.errorOrigin = null;
        state.loadingOrigin = false;
      })
      .addCase(getOrigin.rejected, (state, action) => {
        state.origin = null;
        state.errorOrigin = action.payload;
        state.loadingOrigin = false;
      })
      /** toggle work auction */
      .addCase(stopWorkAuction.pending, (state, action) => {
        state.stopWorkAuctionFlag = false;
        state.errorStopWorkAuction = null;
        state.loadingStopWorkAuction = true;
      })
      .addCase(stopWorkAuction.fulfilled, (state, action) => {
        state.stopWorkAuctionFlag = true;
        state.errorStopWorkAuction = null;
        state.loadingStopWorkAuction = false;
      })
      .addCase(stopWorkAuction.rejected, (state, action) => {
        state.stopWorkAuctionFlag = false;
        state.errorStopWorkAuction = action.payload;
        state.loadingStopWorkAuction = false;
      });
  },
});
export const { setOrigins } = originSlice.actions;
export default originSlice.reducer;
