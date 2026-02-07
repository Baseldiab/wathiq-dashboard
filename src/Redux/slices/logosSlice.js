import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { appendToFormData, getUserType } from "@/services/utils";

export const createLogo = createAsyncThunk(
  "logos/createLogo",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const formData = new FormData();

      appendToFormData(formData, data);

      const response = await api.post(`/${userType}/auction-logos`, formData);
      return response.data;
    } catch (error) {
      const errorLogoMessage = error.response?.data?.errors?.[0]?.message;
      return rejectWithValue(errorLogoMessage);
    }
  }
);

export const updateLogo = createAsyncThunk(
  "logos/updateLogo",
  async ({ data, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.patch(
        `/${userType}/auction-logos/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      const errorLogoMessage = error.response?.data?.errors?.[0]?.message;
      return rejectWithValue(errorLogoMessage);
    }
  }
);

export const getLogo = createAsyncThunk(
  "logos/getLogo",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/auction-logos/${id}`);
      return response.data;
    } catch (error) {
      const errorLogoMessage = error.response?.data?.errors?.[0]?.message;
      return rejectWithValue(errorLogoMessage);
    }
  }
);

export const getLogos = createAsyncThunk(
  "logos/getLogos",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/auction-logos?limit=1000`);
      return response.data;
    } catch (error) {
      const errorLogoMessage = error.response?.data?.errors?.[0]?.message;
      return rejectWithValue(errorLogoMessage);
    }
  }
);
export const getAllLogos = createAsyncThunk(
  "logos/getAllLogos",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(
        `/${userType}/auction-logos?limit=1000${params ? `&${params}` : ""}`
      );
      return response.data;
    } catch (error) {
      const errorLogoMessage = error.response?.data?.errors?.[0]?.message;
      return rejectWithValue(errorLogoMessage);
    }
  }
);

export const deleteLogo = createAsyncThunk(
  "logos/deleteLogo",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.delete(`/${userType}/auction-logos/${id}`);
      return response.data;
    } catch (error) {
      const errorLogoMessage = error.response?.data?.errors?.[0]?.message;
      return rejectWithValue(errorLogoMessage);
    }
  }
);

export const logoSlice = createSlice({
  name: "logo",
  initialState: {
    logos: null,
    allLogos: null,
    errorLogo: null,
    loading: false,
    updateLoading: false,
    reload: false,
  },
  reducers: {
    handleReload: (state, action) => {
      state.reload = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLogos.pending, (state, action) => {
        state.logos = null;
        state.errorLogo = null;
        state.loading = true;
      })
      .addCase(getLogos.fulfilled, (state, action) => {
        state.logos = action.payload;
        state.errorLogo = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getLogos.rejected, (state, action) => {
        state.logos = null;
        state.errorLogo = action.payload;
        state.loading = false;
        state.reload = false;
      })
      //
      .addCase(getAllLogos.pending, (state, action) => {
        state.allLogos = null;
        state.errorLogo = null;
        state.loading = true;
      })
      .addCase(getAllLogos.fulfilled, (state, action) => {
        state.allLogos = action.payload;
        state.errorLogo = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getAllLogos.rejected, (state, action) => {
        state.allLogos = null;
        state.errorLogo = action.payload;
        state.loading = false;
        state.reload = false;
      })

      //createLogo
      .addCase(createLogo.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createLogo.fulfilled, (state, action) => {
        state.reload = true;
        state.loading = false;
      })
      .addCase(createLogo.rejected, (state, action) => {
        state.errorLogo = action.payload;
        state.loading = false;
      })
      //updateLogo
      .addCase(updateLogo.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(updateLogo.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(updateLogo.rejected, (state, action) => {
        state.errorLogo = action.payload;
        state.updateLoading = false;
      })
      //delete
      .addCase(deleteLogo.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteLogo.fulfilled, (state, action) => {
        state.reload = true;
        state.loading = false;
      })
      .addCase(deleteLogo.rejected, (state, action) => {
        state.errorLogo = action.payload;
        state.loading = false;
      });
  },
});

export const { handleReload } = logoSlice.actions;
export default logoSlice.reducer;
