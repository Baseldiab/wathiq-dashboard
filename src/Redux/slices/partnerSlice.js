import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { appendToFormData, getUserType } from "@/services/utils";

export const createPartner = createAsyncThunk(
  "partner/createPartner",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const formData = new FormData();

      appendToFormData(formData, data);

      const response = await api.post(`/${userType}/partners`, formData);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const updatePartner = createAsyncThunk(
  "partner/updatePartner",
  async ({ data, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.patch(`/${userType}/partners/${id}`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getPartner = createAsyncThunk(
  "partner/getPartner",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/partners/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPartners = createAsyncThunk(
  "partner/getPartners",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/partners?limit=1000`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getAllPartners = createAsyncThunk(
  "partner/getAllPartners",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(
        `/${userType}/partners?limit=1000${params ? `&${params}` : ""}`
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const deletePartner = createAsyncThunk(
  "partner/deletePartner",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.delete(`/${userType}/partners/${id}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const partnerSlice = createSlice({
  name: "partner",
  initialState: {
    partners: null,
    allPartners: null,
    error: null,
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
      .addCase(getPartners.pending, (state, action) => {
        state.partners = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getPartners.fulfilled, (state, action) => {
        state.partners = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getPartners.rejected, (state, action) => {
        state.partners = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });
    //
    builder
      .addCase(getAllPartners.pending, (state, action) => {
        state.allPartners = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getAllPartners.fulfilled, (state, action) => {
        state.allPartners = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getAllPartners.rejected, (state, action) => {
        state.allPartners = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });

    //
    builder
      .addCase(createPartner.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(createPartner.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(createPartner.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder
      .addCase(updatePartner.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(updatePartner.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(updatePartner.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
  },
});

export const { handleReload } = partnerSlice.actions;
export default partnerSlice.reducer;
