import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { appendToFormData } from "@/services/utils";

export const createProvider = createAsyncThunk(
  "provider/createProvider",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const formData = new FormData();
      appendToFormData(formData, data);
      const profileData = store.getState()?.profile?.data?.data;
      const userType =
        profileData?.type ||
        (profileData?.employeeType?.includes("admin")
          ? "admin"
          : profileData?.employeeType?.includes("provider")
          ? "providers"
          : null);
      const response = await api.post(`/${userType}/providers`, formData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getProvider = createAsyncThunk(
  "provider/getProvider",
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
      const response = await api.get(`/${userType}/providers/${id}`);
      return response.data;
    } catch (error) {
       const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ ";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProvider = createAsyncThunk(
  "provider/updateProvider",
  async ({ data = {}, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const formData = new FormData();
      appendToFormData(formData, data);
      const profileData = store.getState()?.profile?.data?.data;
      const userType =
        profileData?.type ||
        (profileData?.employeeType?.includes("admin")
          ? "admin"
          : profileData?.employeeType?.includes("provider")
          ? "providers"
          : null);
      const response = await api.patch(
        `/${userType}/providers/${id}`,
        formData
      );

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getProviders = createAsyncThunk(
  "provider/getProviders",
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
      const response = await api.get(
        `/${userType}/providers?${params}&limit=100000`
      );
      return response.data;
    } catch (error) {
       const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ ";
      return rejectWithValue(errorMessage);
    }
  }
);
export const getAllProviders = createAsyncThunk(
  "provider/getAllProviders",
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
      const response = await api.get(`/${userType}/providers?${params}`);
      return response.data;
    } catch (error) {
       const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ ";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProvider = createAsyncThunk(
  "provider/deleteProvider",
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
      const response = await api.delete(`/${userType}/providers/${id}`);
      return response.data;
    } catch (error) {
       const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ ";
      return rejectWithValue(errorMessage);
    }
  }
);
export const getAnalysisProvider = createAsyncThunk(
  "provider/getAnalysisProvider",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get(`/providers/analysis/${id}`);
      return response.data;
    } catch (error) {
       const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ ";
      return rejectWithValue(errorMessage);
    }
  }
);
/**request providers */
export const getAllProvidersRequests = createAsyncThunk(
  "provider/getAllProvidersRequests",
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
      const response = await api.get(
        `/${userType}/provider-requests?${params}`
      );
      return response.data;
    } catch (error) {
       const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ ";
      return rejectWithValue(errorMessage);
    }
  }
);
export const getProviderRequest = createAsyncThunk(
  "provider/getProviderRequest",
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
      const response = await api.get(`/${userType}/provider-requests/${id}`);
      return response.data;
    } catch (error) {
       const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ ";
      return rejectWithValue(errorMessage);
    }
  }
);
export const updateProviderRequest = createAsyncThunk(
  "provider/updateProviderRequest",
  async ({ data = {}, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
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
        `/${userType}/provider-requests/${id}`,
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
export const syncCreateProvider = createAsyncThunk(
  "provider/syncCreateProvider",
  async ({ data = {}, id }, thunkAPI) => {
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
        `/${userType}/provider-requests/${id}`,
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

export const notifyProvider = createAsyncThunk(
  "provider/notifyProvider",
  async ({ data = {}, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
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
      const response = await api.post(
        `/${userType}/notifications/notify-user`,
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

export const providerSlice = createSlice({
  name: "provider",
  initialState: {
    /**create provider */
    createProviderFlag: false,
    createProviderLoading: false,
    createProviderError: null,

    providers: null,
    error: null,
    loading: false,

    approvedProviders: null,
    blockedProviders: null,
    loadingApproved: false,
    loadingBlocked: false,
    errorApproved: null,
    errorBlocked: null,

    provider: null,
    loadingProvider: false,
    errorProvider: null,

    analysisProvider: null,
    analysisProviderLoading: false,
    errorAnalysisProvider: null,

    updatedProviderFlag: false,
    updatedProviderError: null,
    updatedProviderLoading: false,

    reload: false,

    /**provider request all */
    pendingProviders: null,
    rejectedProviders: null,
    loadingPending: false,
    loadingRejected: false,
    errorPending: null,
    errorRejected: null,

    /**provider request details single */
    requestProvider: null,
    loadingRequestProvider: false,
    errorRequestProvider: null,

    updatedProviderRequestFlag: false,
    updatedProviderRequestError: null,
    updatedProviderRequestloading: false,

    /**provider request accept */
    syncCreateProviderFlag: false,
    syncCreateProviderError: null,
    syncCreateProviderloading: false,

    providerStatus: false,

    /**notify provider */
    notifyProviderFlag: false,
    notifyProviderError: null,
    notifyProviderLoading: false,
  },
  reducers: {
    handleReload: (state, action) => {
      state.reload = true;
    },
    handleAccepted: (state, action) => {
      state.providerStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /**create provider */
      .addCase(createProvider.pending, (state) => {
        state.createProviderFlag = false;
        state.createProviderError = null;
        state.createProviderLoading = true;
      })
      .addCase(createProvider.fulfilled, (state) => {
        state.createProviderFlag = true;
        state.createProviderError = null;
        state.createProviderLoading = false;
      })
      .addCase(createProvider.rejected, (state, action) => {
        state.createProviderFlag = false;
        state.createProviderError = action.payload || "حدث خطأ";
        state.createProviderLoading = false;
      })
      /** */
      .addCase(getProviders.pending, (state, action) => {
        state.providers = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getProviders.fulfilled, (state, action) => {
        state.providers = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getProviders.rejected, (state, action) => {
        state.providers = null;
        state.error = action.payload;
        state.loading = false;
      })
      /**one provider */
      .addCase(getProvider.pending, (state, action) => {
        state.provider = null;
        state.errorProvider = null;
        state.loadingProvider = true;
      })
      .addCase(getProvider.fulfilled, (state, action) => {
        state.provider = action.payload;
        state.errorProvider = null;
        state.loadingProvider = false;
      })
      .addCase(getProvider.rejected, (state, action) => {
        state.provider = null;
        state.errorProvider = action.payload;
        state.loadingProvider = false;
      })
      /** all provider approved&blocked */
      .addCase(getAllProviders.pending, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status");

        if (status === "approved") {
          state.loadingApproved = true;
          state.errorApproved = null;
        } else if (status === "blocked") {
          state.loadingBlocked = true;
          state.errorBlocked = null;
        }
      })
      .addCase(getAllProviders.fulfilled, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status");
        if (status === "approved") {
          state.approvedProviders = action.payload;
          state.loadingApproved = false;
        } else if (status === "blocked") {
          state.blockedProviders = action.payload;
          state.loadingBlocked = false;
        }
      })
      .addCase(getAllProviders.rejected, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status");
        if (status === "approved") {
          state.errorApproved = action.payload;
          state.loadingApproved = false;
        } else if (status === "blocked") {
          state.errorBlocked = action.payload;
          state.loadingBlocked = false;
        }
      })
      /** all requests provider pending&rejected */
      .addCase(getAllProvidersRequests.pending, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status");

        if (status === "pending") {
          state.loadingPending = true;
          state.errorPending = null;
        } else if (status === "rejected") {
          state.loadingRejected = true;
          state.errorRejected = null;
        }
      })
      .addCase(getAllProvidersRequests.fulfilled, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status");
        if (status === "pending") {
          state.pendingProviders = action.payload;
          state.loadingPending = false;
        } else if (status === "rejected") {
          state.rejectedProviders = action.payload;
          state.loadingRejected = false;
        }
      })
      .addCase(getAllProvidersRequests.rejected, (state, action) => {
        const params = new URLSearchParams(action.meta.arg);
        const status = params.get("status");
        if (status === "pending") {
          state.errorPending = action.payload;
          state.loadingPending = false;
        } else if (status === "rejected") {
          state.errorRejected = action.payload;
          state.loadingRejected = false;
        }
      })
      /**one provider request */
      .addCase(getProviderRequest.pending, (state, action) => {
        state.requestProvider = null;
        state.errorRequestProvider = null;
        state.loadingRequestProvider = true;
      })
      .addCase(getProviderRequest.fulfilled, (state, action) => {
        state.requestProvider = action.payload;
        state.errorRequestProvider = null;
        state.loadingRequestProvider = false;
      })
      .addCase(getProviderRequest.rejected, (state, action) => {
        state.requestProvider = null;
        state.errorRequestProvider = action.payload;
        state.loadingRequestProvider = false;
      })
      /**analysis */
      .addCase(getAnalysisProvider.pending, (state, action) => {
        state.analysisProvider = null;
        state.errorAnalysisProvider = null;
        state.analysisProviderLoading = true;
      })
      .addCase(getAnalysisProvider.fulfilled, (state, action) => {
        state.analysisProvider = action.payload;
        state.errorAnalysisProvider = null;
        state.analysisProviderLoading = false;
      })
      .addCase(getAnalysisProvider.rejected, (state, action) => {
        state.analysisProvider = null;
        state.errorAnalysisProvider = action.payload;
        state.analysisProviderLoading = false;
      })
      /**update provider */
      .addCase(updateProvider.pending, (state, action) => {
        state.updatedProviderFlag = false;
        state.updatedProviderLoading = true;
        state.updatedProviderError = null;
      })
      .addCase(updateProvider.fulfilled, (state, action) => {
        state.updatedProviderFlag = true;
        state.updatedProviderLoading = false;
        state.updatedProviderError = null;
      })
      .addCase(updateProvider.rejected, (state, action) => {
        state.updatedProviderFlag = false;
        state.updatedProviderLoading = false;
        state.updatedProviderError = action.payload;
      })
      /**update provider request */
      .addCase(updateProviderRequest.pending, (state, action) => {
        state.updatedProviderRequestFlag = false;
        state.updatedProviderRequestError = null;
        state.updatedProviderRequestloading = true;
      })
      .addCase(updateProviderRequest.fulfilled, (state, action) => {
        state.updatedProviderRequestFlag = true;
        state.updatedProviderRequestloading = false;
        state.updatedProviderRequestError = null;
      })
      .addCase(updateProviderRequest.rejected, (state, action) => {
        state.updatedProviderRequestFlag = false;
        state.updatedProviderRequestError = action.payload;
        state.updatedProviderRequestloading = false;
      })
      /**syncCreateProvider */
      .addCase(syncCreateProvider.pending, (state) => {
        state.syncCreateProviderFlag = false;
        state.syncCreateProviderError = null;
        state.syncCreateProviderloading = true;
      })
      .addCase(syncCreateProvider.fulfilled, (state) => {
        state.syncCreateProviderFlag = true;
        state.syncCreateProviderError = null;
        state.syncCreateProviderloading = false;
      })
      .addCase(syncCreateProvider.rejected, (state, action) => {
        state.syncCreateProviderFlag = false;
        state.syncCreateProviderError = action.payload || "حدث خطأ";
        state.syncCreateProviderloading = false;
      })
      /**notify provider */
      .addCase(notifyProvider.pending, (state) => {
        state.notifyProviderFlag = false;
        state.notifyProviderError = null;
        state.notifyProviderLoading = true;
      })
      .addCase(notifyProvider.fulfilled, (state) => {
        state.notifyProviderFlag = true;
        state.notifyProviderError = null;
        state.notifyProviderLoading = false;
      })
      .addCase(notifyProvider.rejected, (state, action) => {
        state.notifyProviderFlag = false;
        state.notifyProviderError = action.payload || "حدث خطأ";
        state.notifyProviderLoading = false;
      });
  },
});
export const { updatingProvider, handleReload, handleAccepted } =
  providerSlice.actions;
export default providerSlice.reducer;
