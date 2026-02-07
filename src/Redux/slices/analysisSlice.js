import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
export const getWallet = createAsyncThunk(
  "contact/getWallet",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get(`/admin/analysis/payment`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getAgency = createAsyncThunk(
  "contact/getAgency",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get(`admin/analysis/agency`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getUser = createAsyncThunk(
  "contact/getUser",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get(`admin/analysis/user`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getAuctions = createAsyncThunk(
  "contact/getAuctions",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get(`admin/analysis/auction`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    walletdata: null,
    walletloading: false,
    walleterror: null,
    agencydata: null,
    agencyloading: false,
    agencyerror: null,
    userdata: null,
    userloading: false,
    usererror: null,
    auctiondata: null,
    auctionloading: false,
    auctionerror: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWallet.pending, (state, action) => {
        state.walletloading = true;
        state.walleterror = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.walletloading = false;
        state.walletdata = action.payload;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.walletloading = false;
        state.walleterror = action.payload;
      })
      .addCase(getAgency.pending, (state, action) => {
        state.agencyloading = true;
        state.agencyerror = null;
      })
      .addCase(getAgency.fulfilled, (state, action) => {
        state.agencyloading = false;
        state.agencydata = action.payload;
      })
      .addCase(getAgency.rejected, (state, action) => {
        state.agencyloading = false;
        state.agencyerror = action.payload;
      })
      .addCase(getUser.pending, (state, action) => {
        state.userloading = true;
        state.usererror = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userloading = false;
        state.userdata = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.userloading = false;
        state.usererror = action.payload;
      })
      .addCase(getAuctions.pending, (state, action) => {
        state.auctionloading = true;
        state.auctionerror = null;
      })
      .addCase(getAuctions.fulfilled, (state, action) => {
        state.auctionloading = false;
        state.auctiondata = action.payload;
      })
      .addCase(getAuctions.rejected, (state, action) => {
        state.auctionloading = false;
        state.auctionerror = action.payload;
      });
  },
});

export default analysisSlice.reducer;
