import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { appendToFormData } from "@/services/utils";
function mapParamsToStatusKey(queryString = "") {
  const qs = new URLSearchParams(queryString);

  // If "type" is present, store under "online" or "offline"
  const typeParam = qs.get("type");
  if (typeParam === "online") {
    return "online";
  }
  if (typeParam === "offline") {
    return "offline";
  }

  // If we get here, there was no "type" param – use your original logic:
  const ninArray = [];
  for (let i = 0; ; i++) {
    const value = qs.get(`nin[${i}]`);
    if (!value) break;
    ninArray.push(value);
  }

  // Check if nin includes "canceled" AND "rejected"
  const hasCanceled = ninArray.includes("canceled");
  const hasRejected = ninArray.includes("rejected");
  if (hasCanceled && hasRejected) {
    return "subscribed";
  }

  // If not nin => see if status=canceled or status=rejected
  const status = qs.get("status");
  if (status === "canceled") {
    return "departure";
  }
  if (status === "rejected") {
    return "excluded";
  }

  // Default
  return "subscribed";
}

export const getAllEnrollments = createAsyncThunk(
  "enrollments/getAllEnrollments",
  async (params, { rejectWithValue }) => {
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
        `/${userType}/auction-enrollments?${params}`
      );

      const statusKey = mapParamsToStatusKey(params);
      return response.data;

      // return {
      //   data: response.data,
      //   statusKey,
      // };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      const statusKey = mapParamsToStatusKey(params);

      return rejectWithValue({ statusKey, error: errorMessage });
    }
  }
);
export const updateEnrollmentStatus = createAsyncThunk(
  "enrollments/updateEnrollmentStatus",
  async (
    { data = {}, auctionId, originId, enrollmentId },
    { rejectWithValue }
  ) => {
    try {
      // const formData = new FormData();
      // appendToFormData(formData, data);
       const profileData = store.getState()?.profile?.data?.data;
      const userType =
        profileData?.type ||
        (profileData?.employeeType?.includes("admin")
          ? "admin"
          : profileData?.employeeType?.includes("provider")
          ? "providers"
          : null);
      const response = await api.patch(
        `/${userType}/auction-enrollments/${auctionId}/origins/${originId}/enrollments/${enrollmentId}`,
        data
      );

      console.log("response", response);
      return response.data;
    } catch (error) {
      console.log("error", error);
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const getBiddingBoard = createAsyncThunk(
  "enrollments/getBiddingBoard",
  async ({ auctionId, originId }, { rejectWithValue }) => {
    try {
      // const formData = new FormData();
      // appendToFormData(formData, data);
       const profileData = store.getState()?.profile?.data?.data;
      const userType =
        profileData?.type ||
        (profileData?.employeeType?.includes("admin")
          ? "admin"
          : profileData?.employeeType?.includes("provider")
          ? "providers"
          : null);
      const response = await api.get(
        `/${userType}/auction-enrollments/${auctionId}/origins/${originId}/bidding-board?limit=1000`
      );
      return response.data;
    } catch (error) {
      console.log("error", error);
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const addUserBid = createAsyncThunk(
  "enrollments/addUserBid",
  async (
    { data = {}, auctionId, originId, enrollmentId },
    { rejectWithValue }
  ) => {
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
        `/${userType}/auction-enrollments/${auctionId}/origins/${originId}/enrollments/${enrollmentId}/bids`,
        data
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const awardAuction = createAsyncThunk(
  "enrollments/awardAuction",
  async ({ data = {}, auctionId, originId }, { rejectWithValue }) => {
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
        `/${userType}/auction-enrollments/${auctionId}/origins/${originId}/award`,
        data
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
const initialState = {
  departure: {
    data: [],
    loading: false,
    error: null,
  },
  excluded: {
    data: [],
    loading: false,
    error: null,
  },
  subscribed: {
    data: [],
    loading: false,
    error: null,
  },
  online: { data: [], loading: false, error: null },
  offline: { data: [], loading: false, error: null },

  updateStatusFlag: false,
  updateStatusLoading: false,
  updateStatusError: null,

  biddingBoard: null,
  loadingBiddingBoard: false,
  errorBiddingBoard: null,

  userBidFlag: false,
  loadingUserBid: false,
  errorUserBid: null,

  awardFlag: false,
  loadingAward: false,
  errorAward: null,
};

export const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // PENDING
      .addCase(getAllEnrollments.pending, (state, action) => {
        const statusKey = mapParamsToStatusKey(action.meta.arg);
        state[statusKey].loading = true;
        state[statusKey].error = null;
      })
      // FULFILLED
      .addCase(getAllEnrollments.fulfilled, (state, action) => {
        const statusKey = mapParamsToStatusKey(action.meta.arg);
        state[statusKey].loading = false;
        state[statusKey].data = action.payload;
        state[statusKey].error = null;
      })
      // REJECTED
      .addCase(getAllEnrollments.rejected, (state, action) => {
        const statusKey = mapParamsToStatusKey(action.meta.arg);
        console.log("statusKey =>", statusKey); // <--- Inspect this in the console
        if (!state[statusKey]) {
          return; // or handle gracefully
        }
        // If "statusKey" is something you haven't defined in initialState,
        // then "state[statusKey]" is undefined.
        state[statusKey].loading = false;
        state[statusKey].error = action.payload;
      })

      // Update Enrollment Status
      .addCase(updateEnrollmentStatus.pending, (state) => {
        state.updateStatusFlag = false;
        state.updateStatusError = null;
        state.updateStatusLoading = true;
      })
      .addCase(updateEnrollmentStatus.fulfilled, (state) => {
        state.updateStatusFlag = true;
        state.updateStatusError = null;
        state.updateStatusLoading = false;
      })
      .addCase(updateEnrollmentStatus.rejected, (state, action) => {
        state.updateStatusFlag = false;
        state.updateStatusError = action.payload || "حدث خطأ";
        state.updateStatusLoading = false;
      })
      //bidding board
      .addCase(getBiddingBoard.pending, (state) => {
        state.biddingBoard = null;
        state.errorBiddingBoard = null;
        state.loadingBiddingBoard = true;
      })
      .addCase(getBiddingBoard.fulfilled, (state, action) => {
        state.biddingBoard = action.payload;
        state.errorBiddingBoard = null;
        state.loadingBiddingBoard = false;
      })
      .addCase(getBiddingBoard.rejected, (state, action) => {
        state.biddingBoard = null;
        state.errorBiddingBoard = action.payload || "حدث خطأ";
        state.loadingBiddingBoard = false;
      })
      // Update Enrollment Status
      .addCase(addUserBid.pending, (state) => {
        state.userBidFlag = false;
        state.errorUserBid = null;
        state.loadingUserBid = true;
      })
      .addCase(addUserBid.fulfilled, (state) => {
        state.userBidFlag = true;
        state.errorUserBid = null;
        state.loadingUserBid = false;
      })
      .addCase(addUserBid.rejected, (state, action) => {
        state.userBidFlag = false;
        state.errorUserBid = action.payload || "حدث خطأ";
        state.loadingUserBid = false;
      })
      // award
      .addCase(awardAuction.pending, (state) => {
        state.awardFlag = false;
        state.errorAward = null;
        state.loadingAward = true;
      })
      .addCase(awardAuction.fulfilled, (state) => {
        state.awardFlag = true;
        state.errorAward = null;
        state.loadingAward = false;
      })
      .addCase(awardAuction.rejected, (state, action) => {
        state.awardFlag = false;
        state.errorAward = action.payload || "حدث خطأ";
        state.loadingAward = false;
      });
  },
});

export const enrollmentReducer = enrollmentSlice.reducer;
