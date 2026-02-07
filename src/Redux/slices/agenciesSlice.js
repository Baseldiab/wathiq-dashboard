import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
export const getAllagencies = createAsyncThunk(
  "agencies/getAllagencies",
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
      const response = await api.get(`/${userType}/agencies?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateAgenciesStatues = createAsyncThunk(
  "agencies/updateAgenciesStatues",
  async ({ id, status, reason, expireAt }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const payload = {
        status: { value: status },
      };

      if (status === "rejected") {
        payload.status.reason = reason;
      } else if (status === "approved") {
        payload.expireAt = expireAt;
      }
      console.log(payload);

      const profileData = store.getState()?.profile?.data?.data;
      const userType =
        profileData?.type ||
        (profileData?.employeeType?.includes("admin")
          ? "admin"
          : profileData?.employeeType?.includes("provider")
          ? "providers"
          : null);
      const response = await api.patch(`/${userType}/agencies/${id}`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const agenciesSlice = createSlice({
  name: "agencies",
  initialState: {
    agencies_PendingData: null,
    agencies_PendingLoading: false,
    agencies_PendingError: null,
    agencies_PendingData_spacific_user: null,
    agencies_PendingLoading_spacific_user: false,
    agencies_PendingError_spacific_user: null,
    agencies_rejectedData: null,
    agencies_rejectedLoading: false,
    agencies_rejectedError: null,
    agencies_rejectedData_spacific_user: null,
    agencies_rejectedLoading_spacific_user: false,
    agencies_rejectedError_spacific_user: null,
    agencies_ApprovedData: null,
    agencies_ApprovedLoading: false,
    agencies_ApprovedError: null,
    agencies_ApprovedData_spacific_user: null,
    agencies_ApprovedLoading_spacific_user: false,
    agencies_ApprovedError_spacific_user: null,
    agencies_ExpiredData: null,
    agencies_ExpiredLoading: false,
    agencies_ExpiredError: null,
    agencies_ExpiredData_spacific_user: null,
    agencies_ExpiredLoading_spacific_user: false,
    agencies_ExpiredError_spacific_user: null,
    agencies_blockedData: null,
    agencies_blockedLoading: false,
    agencies_blockedError: null,
    agencies_blockedData_spacific_user: null,
    agencies_blockedLoading_spacific_user: false,
    agencies_blockedError_spacific_user: null,
    updateErr: null,
    updateLoad: false,
    updateRes: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllagencies.pending, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status");
        const expire = params.get("expired");
        const user = params.get("user");

        if (user) {
          if (status === "pending") {
            state.agencies_PendingLoading_spacific_user = true;
            state.agencies_PendingError_spacific_user = null;
          } else if (status === "rejected") {
            state.agencies_rejectedLoading_spacific_user = true;
            state.agencies_rejectedError_spacific_user = null;
          }
          else if (status === "blocked") {
            state.agencies_blockedLoading_spacific_user = true;
            state.agencies_blockedError_spacific_user = null;
          } else if (status === "approved") {
            state.agencies_ApprovedLoading_spacific_user = true;
            state.agencies_ApprovedError_spacific_user = null;
          } else if (expire) {
            state.agencies_ExpiredLoading_spacific_user = true;
            state.agencies_ExpiredError_spacific_user = null;
          }
        } else {
          if (status === "pending") {
            state.agencies_PendingLoading = true;
            state.agencies_PendingError = null;
          } else if (status === "rejected") {
            state.agencies_rejectedLoading = true;
            state.agencies_rejectedError = null;
          } else if (status === "blocked") {
            state.agencies_blockedLoading = true;
            state.agencies_blockedError = null;
          } else if (status === "approved") {
            state.agencies_ApprovedLoading = true;
            state.agencies_ApprovedError = null;
          } else if (expire) {
            state.agencies_ExpiredLoading = true;
            state.agencies_ExpiredError = null;
          }
        }
      })
      .addCase(getAllagencies.fulfilled, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status");
        const expire = params.get("expired");
        const user = params.get("user");

        if (user) {
          if (status === "pending") {
            state.agencies_PendingData_spacific_user = action.payload;
            state.agencies_PendingLoading_spacific_user = false;
            state.agencies_PendingError_spacific_user = null;
          } else if (status === "rejected") {
            state.agencies_rejectedData_spacific_user = action.payload;
            state.agencies_rejectedLoading_spacific_user = false;
            state.agencies_rejectedError_spacific_user = null;
          } else if (status === "blocked") {
            state.agencies_blockedData_spacific_user = action.payload;
            state.agencies_blockedLoading_spacific_user = false;
            state.agencies_blockedError_spacific_user = null;
          } else if (status === "approved") {
            state.agencies_ApprovedData_spacific_user = action.payload;
            state.agencies_ApprovedLoading_spacific_user = false;
            state.agencies_ApprovedError_spacific_user = null;
          } else if (expire) {
            state.agencies_ExpiredData_spacific_user = action.payload;
            state.agencies_ExpiredLoading_spacific_user = false;
            state.agencies_ExpiredError_spacific_user = null;
          }
        } else {
          if (status === "pending") {
            state.agencies_PendingData = action.payload;
            state.agencies_PendingLoading = false;
            state.agencies_PendingError = null;
          } else if (status === "rejected") {
            state.agencies_rejectedData = action.payload;
            state.agencies_rejectedLoading = false;
            state.agencies_rejectedError = null;
          } else if (status === "blocked") {
            state.agencies_blockedData = action.payload;
            state.agencies_blockedLoading = false;
            state.agencies_blockedError = null;
          } else if (status === "approved") {
            state.agencies_ApprovedData = action.payload;
            state.agencies_ApprovedLoading = false;
            state.agencies_ApprovedError = null;
          } else if (expire) {
            state.agencies_ExpiredData = action.payload;
            state.agencies_ExpiredLoading = false;
            state.agencies_ExpiredError = null;
          }
        }
      })
      .addCase(getAllagencies.rejected, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status");
        const expire = params.get("expired");
        const user = params.get("user");

        if (user) {
          if (status === "pending") {
            state.agencies_PendingData_spacific_user = null;
            state.agencies_PendingLoading_spacific_user = false;
            state.agencies_PendingError_spacific_user = action.payload;
          } else if (status === "rejected") {
            state.agencies_rejectedData_spacific_user = null;
            state.agencies_rejectedLoading_spacific_user = false;
            state.agencies_rejectedError_spacific_user = action.payload;
          } else if (status === "blocked") {
            state.agencies_blockedData_spacific_user = null;
            state.agencies_blockedLoading_spacific_user = false;
            state.agencies_blockedError_spacific_user = action.payload;
          } else if (status === "approved") {
            state.agencies_ApprovedData_spacific_user = null;
            state.agencies_ApprovedLoading_spacific_user = false;
            state.agencies_ApprovedError_spacific_user = action.payload;
          } else if (expire) {
            state.agencies_ExpiredData_spacific_user = null;
            state.agencies_ExpiredLoading_spacific_user = false;
            state.agencies_ExpiredError_spacific_user = action.payload;
          }
        } else {
          if (status === "pending") {
            state.agencies_PendingData = null;
            state.agencies_PendingLoading = false;
            state.agencies_PendingError = action.payload;
          } else if (status === "rejected") {
            state.agencies_rejectedData = null;
            state.agencies_rejectedLoading = false;
            state.agencies_rejectedError = action.payload;
          } else if (status === "blocked") {
            state.agencies_blockedData = null;
            state.agencies_blockedLoading = false;
            state.agencies_blockedError = action.payload;
          } else if (status === "approved") {
            state.agencies_ApprovedData = null;
            state.agencies_ApprovedLoading = false;
            state.agencies_ApprovedError = action.payload;
          } else if (expire) {
            state.agencies_ExpiredData = null;
            state.agencies_ExpiredLoading = false;
            state.agencies_ExpiredError = action.payload;
          }
        }
      })
      //updae agency
      .addCase(updateAgenciesStatues.pending, (state, action) => {
        state.updateRes = null;
        state.updateErr = null;
        state.updateLoad = true;
      })
      .addCase(updateAgenciesStatues.fulfilled, (state, action) => {
        state.updateRes = action.payload;
        state.updateErr = null;
        state.updateLoad = false;
        state.reload = false;
      })
      .addCase(updateAgenciesStatues.rejected, (state, action) => {
        state.updateRes = null;
        state.updateErr = action.payload;
        state.updateLoad = false;
        state.reload = false;
      });
    //
  },
});

export const {} = agenciesSlice.actions;
export default agenciesSlice.reducer;
