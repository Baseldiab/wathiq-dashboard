import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";

export const addBalance = createAsyncThunk(
  "contact/addBalance",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.post(`/users/wallet/add-balance`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getWallet = createAsyncThunk(
  "contact/getWallet",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await api.get(`/users/wallet`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getAllInvoices = createAsyncThunk(
  "contact/getAllInvoices",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await api.get(`/users/wallet/invoices?${params}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getSpacificInvoice = createAsyncThunk(
  "contact/spacificInvoice",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get(`users/wallet/invoice/${id}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getUserWallet = createAsyncThunk(
  "user/getUserWallet",
  async ({ userId }, thunkAPI) => {
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

      if (!userType) {
        throw new Error("User type not found");
      }

      const response = await api.get(`/${userType}/users/${userId}/wallet`, {});

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
export const getUserInvoices = createAsyncThunk(
  "user/getUserInvoices",
  async ({ userId, page, limit }, thunkAPI) => {
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

      if (!userType) {
        throw new Error("User type not found");
      }

      const response = await api.get(
        `/${userType}/users/${userId}/invoices?page=${page}&limit=${limit}`,
        {}
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
export const getUserHeldAmount = createAsyncThunk(
  "user/getUserHeldAmount",
  async ({ userId, page, limit }, thunkAPI) => {
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

      if (!userType) {
        throw new Error("User type not found");
      }

      const response = await api.get(
        `/${userType}/users/${userId}/held-amount?page=${page}&limit=${limit}`,
        {}
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
export const getOriginPayments = createAsyncThunk(
  "contact/getOriginPayments",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await api.get(
        `/admin/auctions/origin-payment?${params}`
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
//all withDraw
export const getWithDraw = createAsyncThunk(
  "contact/getWithDraw",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await api.get(`/admin/withdraw/?${params}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
//one withDraw
export const getOneWithDraw = createAsyncThunk(
  "wallet/getOneWithDraw",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/admin/withdraw/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
//update WithDraw Status
export const updateOneWithDraw = createAsyncThunk(
  "wallet/updateOneWithDraw",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.patch(`/admin/withdraw/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//winner enroll
export const getEnrollments = createAsyncThunk(
  "enrollments/getEnrollments",
  async (params, { rejectWithValue }) => {
    try {
      const userType = store.getState()?.profile?.data?.data?.type;
      const response = await api.get(
        `/${userType}/auction-enrollments/deposit?${params}`
      );

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

//
// استدعاء بيانات هيئة إنفاذ
export const fetchAuthorityDeposits = createAsyncThunk(
  "enrollments/fetchAuthorityDeposits",
  async (params, { rejectWithValue }) => {
    try {
      const userType = store.getState()?.profile?.data?.data?.type;
      const response = await api.get(
        `/${userType}/auction-enrollments/authority-deposit?${params}`
      );
      return response.data;
    } catch (error) {
      console.log(error);

      const errorMessage =
        error?.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const updateAuthDeposite = createAsyncThunk(
  "wallet/updateAuthDeposite",
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await api.patch(
        `/admin/auction-enrollments/authority-deposit/${id}?status=${status}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const WalletSlice = createSlice({
  name: "wallet",
  initialState: {
    data: null,
    loading: false,
    error: null,
    walletBalance: null,
    loadingBalance: false,
    errorBalance: false,
    allInvoices: null,
    loadingallInvoices: false,
    errorallInvoices: false,
    SpacificInvoice: null,
    loadingSpacificInvoice: false,
    errorSpacificInvoice: false,
    userWallet: null,
    loadinguserWallet: false,
    erroruserWallet: false,
    userInvoices: null,
    loadinguserInvoices: false,
    erroruserInvoices: false,
    userHeldAmount: null,
    loadinguserHeldAmount: false,
    erroruserHeldAmount: false,
    originPayments: null,
    loadingOriginPayments: false,
    errorOriginPayments: false,
    WithDrawData: null,
    loadingWithDrawData: false,
    errorWithDrawData: false,
    OneWithDrawData: null,
    OneloadingWithDrawData: false,
    OneerrorWithDrawData: false,
    updateWithDrawData: null,
    updateloadingWithDrawData: false,
    updateerrorWithDrawData: false,
    WinnerEnroll: null,
    WinnerEnroll_loading: false,
    WinnerEnroll_err: false,
    authorityDeposits: null,
    authorityDepositsLoading: false,
    authorityDepositsError: null,
    authorityDepositsPagination: {},
    updateauthorityDeposits: null,
    updateauthorityDepositsLoading: false,
    updateauthorityDepositsError: null,
    updateauthorityDepositsPagination: {},
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBalance.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWallet.pending, (state, action) => {
        state.loadingBalance = true;
        state.errorBalance = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.loadingBalance = false;
        state.walletBalance = action.payload;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loadingBalance = false;
        state.errorBalance = action.payload;
      })
      .addCase(getAllInvoices.pending, (state, action) => {
        state.loadingallInvoices = true;
        state.errorallInvoices = null;
      })
      .addCase(getAllInvoices.fulfilled, (state, action) => {
        state.loadingallInvoices = false;
        state.allInvoices = action.payload;
      })
      .addCase(getAllInvoices.rejected, (state, action) => {
        state.loadingallInvoices = false;
        state.errorallInvoices = action.payload;
      })
      .addCase(getSpacificInvoice.pending, (state, action) => {
        state.loadingSpacificInvoice = true;
        state.errorSpacificInvoice = null;
      })
      .addCase(getSpacificInvoice.fulfilled, (state, action) => {
        state.loadingSpacificInvoice = false;
        state.SpacificInvoice = action.payload;
      })
      .addCase(getSpacificInvoice.rejected, (state, action) => {
        state.loadingSpacificInvoice = false;
        state.errorSpacificInvoice = action.payload;
      })
      .addCase(getUserWallet.pending, (state, action) => {
        state.loadinguserWallet = true;
        state.erroruserWallet = null;
      })
      .addCase(getUserWallet.fulfilled, (state, action) => {
        state.loadinguserWallet = false;
        state.userWallet = action.payload;
      })
      .addCase(getUserWallet.rejected, (state, action) => {
        state.loadinguserWallet = false;
        state.erroruserWallet = action.payload;
      })
      .addCase(getUserInvoices.pending, (state, action) => {
        state.loadinguserInvoices = true;
        state.erroruserInvoices = null;
      })
      .addCase(getUserInvoices.fulfilled, (state, action) => {
        state.loadinguserInvoices = false;
        state.userInvoices = action.payload;
      })
      .addCase(getUserInvoices.rejected, (state, action) => {
        state.loadinguserInvoices = false;
        state.erroruserInvoices = action.payload;
      })
      .addCase(getUserHeldAmount.pending, (state, action) => {
        state.loadinguserHeldAmount = true;
        state.erroruserHeldAmount = null;
      })
      .addCase(getUserHeldAmount.fulfilled, (state, action) => {
        state.loadinguserHeldAmount = false;
        state.userHeldAmount = action.payload;
      })
      .addCase(getUserHeldAmount.rejected, (state, action) => {
        state.loadinguserHeldAmount = false;
        state.erroruserHeldAmount = action.payload;
      })
      .addCase(getOriginPayments.pending, (state) => {
        state.loadingOriginPayments = true;
        state.errorOriginPayments = null;
      })
      .addCase(getOriginPayments.fulfilled, (state, action) => {
        state.loadingOriginPayments = false;
        state.originPayments = action.payload;
      })
      .addCase(getOriginPayments.rejected, (state, action) => {
        state.loadingWithDrawData = false;
        state.errorWithDrawData = action.payload;
      })
      .addCase(getWithDraw.pending, (state) => {
        state.loadingWithDrawData = true;
        state.errorWithDrawData = null;
      })
      .addCase(getWithDraw.fulfilled, (state, action) => {
        state.loadingWithDrawData = false;
        state.WithDrawData = action.payload;
      })
      .addCase(getWithDraw.rejected, (state, action) => {
        state.loadingWithDrawData = false;
        state.errorWithDrawData = action.payload;
      })
      .addCase(getOneWithDraw.pending, (state) => {
        state.OneloadingWithDrawData = true;
        state.OneerrorWithDrawData = null;
      })
      .addCase(getOneWithDraw.fulfilled, (state, action) => {
        state.OneloadingWithDrawData = false;
        state.OneWithDrawData = action.payload;
      })
      .addCase(getOneWithDraw.rejected, (state, action) => {
        state.OneloadingWithDrawData = false;
        state.OneerrorWithDrawData = action.payload;
      })
      .addCase(updateOneWithDraw.pending, (state) => {
        state.updateloadingWithDrawData = true;
        state.updateerrorWithDrawData = null;
      })
      .addCase(updateOneWithDraw.fulfilled, (state, action) => {
        state.updateloadingWithDrawData = false;
        state.updateWithDrawData = action.payload;
      })
      .addCase(updateOneWithDraw.rejected, (state, action) => {
        state.updateloadingWithDrawData = false;
        state.updateerrorWithDrawData = action.payload;
      })

      .addCase(getEnrollments.pending, (state) => {
        state.WinnerEnroll_loading = true;
        state.WinnerEnroll_err = null;
      })
      .addCase(getEnrollments.fulfilled, (state, action) => {
        state.WinnerEnroll_loading = false;
        state.WinnerEnroll = action.payload;
      })
      .addCase(getEnrollments.rejected, (state, action) => {
        state.WinnerEnroll_loading = false;
        state.updateerrorWithDrawData = action.payload;
      })
      .addCase(fetchAuthorityDeposits.pending, (state) => {
        state.authorityDepositsLoading = true;
        state.authorityDepositsError = null;
      })
      .addCase(fetchAuthorityDeposits.fulfilled, (state, action) => {
        state.authorityDeposits = action.payload?.data || [];
        state.authorityDepositsPagination = action.payload?.pagination || {};
        state.authorityDepositsLoading = false;
      })
      .addCase(fetchAuthorityDeposits.rejected, (state, action) => {
        state.authorityDepositsLoading = false;
        state.authorityDepositsError = action.payload;
      })
      .addCase(updateAuthDeposite.pending, (state) => {
        state.updateauthorityDepositsLoading = true;
        state.updateauthorityDepositsError = null;
      })
      .addCase(updateAuthDeposite.fulfilled, (state, action) => {
        state.updateauthorityDeposits = action.payload?.data || [];
        state.updateauthorityDepositsPagination =
          action.payload?.pagination || {};
        state.updateauthorityDepositsLoading = false;
      })
      .addCase(updateAuthDeposite.rejected, (state, action) => {
        state.updateauthorityDepositsLoading = false;
        state.updateauthorityDepositsError = action.payload;
      });
  },
});

export default WalletSlice.reducer;
