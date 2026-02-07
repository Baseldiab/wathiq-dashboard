import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";

export const getAllAuctions = createAsyncThunk(
  "auctions/getAllAuctions",
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
      const response = await api.get(`/${userType}/auctions?${params}`);
      return response.data;
    } catch (error) {
      console.log("error", error);
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const createAuction = createAsyncThunk(
  "auctions/createAuction",
  async (data = {}, thunkAPI) => {
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
      const response = await api.post(`/${userType}/auctions`, data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const getAuction = createAsyncThunk(
  "auctions/getAuction",
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
      const response = await api.get(`/${userType}/auctions/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateAuction = createAsyncThunk(
  "auction/updateAuction",
  async ({ data, id }, thunkAPI) => {
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
      const response = await api.patch(`/${userType}/auctions/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const askForReviewAuction = createAsyncThunk(
  "auctions/askForReviewAuction",
  async ({ data, id }, thunkAPI) => {
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
      const response = await api.post(`/${userType}/auctions/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const reviewAuction = createAsyncThunk(
  "auctions/reviewAuction",
  async ({ data, id }, thunkAPI) => {
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
        `/${userType}/auctions/${id}/review`,
        data
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const publishAuction = createAsyncThunk(
  "auctions/publishAuction",
  async ({ data, id }, thunkAPI) => {
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
        `/${userType}/auctions/${id}/status`,
        data
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteAuction = createAsyncThunk(
  "provider/deleteAuction",
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
      const response = await api.delete(`/${userType}/auctions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const addExtraTime = createAsyncThunk(
  "auctions/addExtraTime",
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
      const response = await api.patch(
        `/${userType}/auctions/${id}/extra-time`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const auctionSlice = createSlice({
  name: "auctions",
  initialState: {
    /**My AUCTIONS */
    auctions: {
      /**status auction >> انفاد/خاص >> review status */

      pending: {
        true: { approved: {}, rejected: {}, pending: {}, need_to_review: {} },
        false: { approved: {}, rejected: {}, pending: {}, need_to_review: {} },
      },
      in_progress: {
        true: { approved: {}, rejected: {}, pending: {} },
        false: { approved: {}, rejected: {}, pending: {} },
      },
      on_going: {
        true: { approved: {}, rejected: {}, pending: {} },
        false: { approved: {}, rejected: {}, pending: {} },
      },
      completed: {
        true: { approved: {}, rejected: {}, pending: {} },
        false: { approved: {}, rejected: {}, pending: {} },
      },
      canceled: {
        true: { approved: {}, rejected: {}, pending: {} },
        false: { approved: {}, rejected: {}, pending: {} },
      },
    },
    loading: {
      pending: { true: false, false: false },
      in_progress: { true: false, false: false },
      on_going: { true: false, false: false },
      completed: { true: false, false: false },
      canceled: { true: false, false: false },
    },
    errors: {
      pending: { true: null, false: null },
      in_progress: { true: null, false: null },
      on_going: { true: null, false: null },
      completed: { true: null, false: null },
      canceled: { true: null, false: null },
    },
    /**AUCTIONS REQUESTS */
    auctions_requests: {
      pending: {
        true: { pending: {}, need_to_review: {}, rejected: {}, approved: {} },
        false: { pending: {}, need_to_review: {}, rejected: {}, approved: {} },
      },
      in_progress: {
        true: { pending: {}, need_to_review: {}, rejected: {}, approved: {} },
        false: { pending: {}, need_to_review: {}, rejected: {}, approved: {} },
      },
    },
    loading_requests: {
      pending: { true: false, false: false },
      in_progress: { true: false, false: false },
    },
    errors_requests: {
      pending: { true: null, false: null },
      in_progress: { true: null, false: null },
    },
    /**create auction */
    createdAuctionData: null,
    createdAuctionLoading: false,
    createdAuctionError: null,

    /** one auction */
    auction: null,
    loadingAuction: false,
    errorAuction: null,

    /** update auction */
    updatedAuctionFlag: false,
    updateAuctionLoading: false,
    updateAuctionError: null,

    /** ask for review auction */
    askReviewFlag: false,
    loadingAskReview: false,
    errorAskReview: null,

    /** review auction */
    reviewFlag: false,
    loadingReview: false,
    errorReview: null,

    /** publish auction */
    publishFlag: false,
    loadingPublish: false,
    errorPublish: null,

    /** delete auction */
    deleteFlag: false,
    loadingDelete: false,
    errorDelete: null,
    /** extra time auction */
    extraTimeFlag: false,
    loadingExtraTime: false,
    errorExtraTime: null,
  },
  reducers: {
    setAuctionData: (state, action) => {
      const { createdByAdmin, status, reviewStatus, auctionData } =
        action.payload;

      // Update state based on createdByAdmin
      if (createdByAdmin) {
        state.auctions_requests.pending[status][reviewStatus] = auctionData;
      } else {
        state.auctions.pending[status][reviewStatus] = auctionData;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling getAllAuctions for auctions or auctions_requests
      .addCase(getAllAuctions.pending, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status") || "pending";
        const specialToSupportAuthority =
          params.get("specialToSupportAuthority") === "true" ? "true" : "false";
        const reviewStatus = params.get("reviewStatus") || "pending";
        const createdByAdmin = params.get("createdByAdmin");
        if (createdByAdmin == "false") {
          state.loading_requests[status][specialToSupportAuthority] = true;
          state.errors_requests[status][specialToSupportAuthority] = null;
        } else {
          state.loading[status][specialToSupportAuthority] = true;
          state.errors[status][specialToSupportAuthority] = null;
        }
      })
      .addCase(getAllAuctions.fulfilled, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status") || "pending";
        const specialToSupportAuthority =
          params.get("specialToSupportAuthority") === "true" ? "true" : "false";
        const reviewStatus = params.get("reviewStatus") || "pending";
        const createdByAdmin = params.get("createdByAdmin");

        if (createdByAdmin == "false") {
          if (!state.auctions_requests[status]) {
            state.auctions_requests[status] = { true: {}, false: {} };
          }
          if (!state.auctions_requests[status][specialToSupportAuthority]) {
            state.auctions_requests[status][specialToSupportAuthority] = {
              need_to_review: {},
              rejected: {},
              approved: {},
            };
          }
          if (
            !state.auctions_requests[status][specialToSupportAuthority][
              reviewStatus
            ]
          ) {
            state.auctions_requests[status][specialToSupportAuthority][
              reviewStatus
            ] = {
              data: [],
              pagination: {},
            };
          }
          // Save the data
          state.auctions_requests[status][specialToSupportAuthority][
            reviewStatus
          ] = {
            data: action.payload.data || [],
            pagination: action.payload.pagination || {},
          };
        } else {
          if (!state.auctions[status]) {
            state.auctions[status] = { true: {}, false: {} };
          }
          if (!state.auctions[status][specialToSupportAuthority]) {
            state.auctions[status][specialToSupportAuthority] = {
              approved: {},
              rejected: {},
              pending: {},
            };
          }
          if (
            !state.auctions[status][specialToSupportAuthority][reviewStatus]
          ) {
            state.auctions[status][specialToSupportAuthority][reviewStatus] = {
              data: [],
              pagination: {},
            };
          }
          // Save the data
          state.auctions[status][specialToSupportAuthority][reviewStatus] = {
            data: action.payload.data || [],
            pagination: action.payload.pagination || {},
          };
        }

        if (createdByAdmin == "false") {
          state.loading_requests[status][specialToSupportAuthority] = false;
        } else {
          state.loading[status][specialToSupportAuthority] = false;
        }
        state.errors[status][specialToSupportAuthority] = null;
      })

      .addCase(getAllAuctions.rejected, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status") || "pending";
        const specialToSupportAuthority =
          params.get("specialToSupportAuthority") === "true" ? "true" : "false";

        const createdByAdmin = params.get("createdByAdmin");

        if (createdByAdmin == "false") {
          // Ensure the nested state is initialized
          if (!state.loading_requests[status]) {
            state.loading_requests[status] = { true: false, false: false };
          }
          if (!state.errors_requests[status]) {
            state.errors_requests[status] = { true: null, false: null };
          }
          state.loading_requests[status][specialToSupportAuthority] = false;
          state.errors_requests[status][specialToSupportAuthority] =
            action.payload;
        } else {
          // Ensure the nested state is initialized
          if (!state.loading[status]) {
            state.loading[status] = { true: false, false: false };
          }
          if (!state.errors[status]) {
            state.errors[status] = { true: null, false: null };
          }
          state.loading[status][specialToSupportAuthority] = false;
          state.errors[status][specialToSupportAuthority] = action.payload;
        }
      })

      /**create auction */
      .addCase(createAuction.pending, (state) => {
        state.createdAuctionData = false;
        state.createdAuctionError = null;
        state.createdAuctionLoading = true;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        state.createdAuctionData = action.payload;
        state.createdAuctionError = false;
        state.createdAuctionLoading = false;
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.createdAuctionData = null;
        state.createdAuctionError = action.payload || "حدث خطأ";
        state.createdAuctionLoading = false;
      })
      /**one auction */
      .addCase(getAuction.pending, (state, action) => {
        state.auction = null;
        state.errorAuction = null;
        state.loadingAuction = true;
      })
      .addCase(getAuction.fulfilled, (state, action) => {
        state.auction = action.payload;
        state.errorAuction = null;
        state.loadingAuction = false;
      })
      .addCase(getAuction.rejected, (state, action) => {
        state.auction = null;
        state.errorAuction = action.payload;
        state.loadingAuction = false;
      })
      /**askForReviewAuction Auction  */
      .addCase(askForReviewAuction.pending, (state, action) => {
        state.askReviewFlag = false;
        state.errorAskReview = null;
        state.loadingAskReview = true;
      })
      .addCase(askForReviewAuction.fulfilled, (state, action) => {
        state.askReviewFlag = true;
        state.errorAskReview = null;
        state.loadingAskReview = false;
      })
      .addCase(askForReviewAuction.rejected, (state, action) => {
        state.askReviewFlag = false;
        state.errorAskReview = action.payload;
        state.loadingAskReview = false;
      })
      /**review Auction  */
      .addCase(reviewAuction.pending, (state, action) => {
        state.reviewFlag = false;
        state.errorReview = null;
        state.loadingReview = true;
      })
      .addCase(reviewAuction.fulfilled, (state, action) => {
        state.reviewFlag = true;
        state.errorReview = null;
        state.loadingReview = false;
      })
      .addCase(reviewAuction.rejected, (state, action) => {
        state.reviewFlag = false;
        state.errorReview = action.payload;
        state.loadingReview = false;
      })
      /**update Auction  */
      .addCase(updateAuction.pending, (state, action) => {
        state.updatedAuctionFlag = false;
        state.updateAuctionError = null;
        state.updateAuctionLoading = true;
      })
      .addCase(updateAuction.fulfilled, (state, action) => {
        state.updatedAuctionFlag = true;
        state.updateAuctionError = null;
        state.updateAuctionLoading = false;
      })
      .addCase(updateAuction.rejected, (state, action) => {
        state.updatedAuctionFlag = false;
        state.updateAuctionError = action.payload;
        state.updateAuctionLoading = false;
      })
      /**publish Auction  */
      .addCase(publishAuction.pending, (state, action) => {
        state.publishFlag = false;
        state.errorPublish = null;
        state.loadingPublish = true;
      })
      .addCase(publishAuction.fulfilled, (state, action) => {
        state.publishFlag = true;
        state.errorPublish = null;
        state.loadingPublish = false;
      })
      .addCase(publishAuction.rejected, (state, action) => {
        state.publishFlag = false;
        state.errorPublish = action.payload;
        state.loadingPublish = false;
      })
      /**delete Auction  */
      .addCase(deleteAuction.pending, (state, action) => {
        state.deleteFlag = false;
        state.errorDelete = null;
        state.loadingDelete = true;
      })
      .addCase(deleteAuction.fulfilled, (state, action) => {
        state.deleteFlag = true;
        state.errorDelete = null;
        state.loadingDelete = false;
      })
      .addCase(deleteAuction.rejected, (state, action) => {
        state.deleteFlag = false;
        state.errorDelete = action.payload;
        state.loadingDelete = false;
      })
      /**extra time Auction  */
      .addCase(addExtraTime.pending, (state, action) => {
        state.extraTimeFlag = false;
        state.errorExtraTime = null;
        state.loadingExtraTime = true;
      })
      .addCase(addExtraTime.fulfilled, (state, action) => {
        state.extraTimeFlag = true;
        state.errorExtraTime = null;
        state.loadingExtraTime = false;
      })
      .addCase(addExtraTime.rejected, (state, action) => {
        state.extraTimeFlag = false;
        state.errorExtraTime = action.payload;
        state.loadingExtraTime = false;
      });
  },
});
export const { setAuctionData } = auctionSlice.actions;

export default auctionSlice.reducer;
