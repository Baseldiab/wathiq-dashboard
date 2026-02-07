import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { appendToFormData, getUserType } from "@/services/utils";

export const createSlider = createAsyncThunk(
  "slider/createSlider",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const formData = new FormData();

      appendToFormData(formData, data);

      const response = await api.post(`/${userType}/sliders`, formData);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const updateSlider = createAsyncThunk(
  "slider/updateSlider",
  async ({ data, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.patch(`/${userType}/sliders/${id}`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getSlider = createAsyncThunk(
  "slider/getSlider",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/sliders/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSliders = createAsyncThunk(
  "slider/getSliders",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/sliders?limit=1000`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getAllSliders = createAsyncThunk(
  "slider/getAllSliders",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(
        `/${userType}/sliders?limit=1000${params ? `&${params}` : ""}`
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const deleteSlider = createAsyncThunk(
  "slider/deleteSlider",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.delete(`/${userType}/sliders/${id}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const sliderSlice = createSlice({
  name: "slider",
  initialState: {
    sliders: null,
    allSliders: null,
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
      .addCase(getSliders.pending, (state, action) => {
        state.sliders = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getSliders.fulfilled, (state, action) => {
        state.sliders = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getSliders.rejected, (state, action) => {
        state.sliders = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });
    //
    builder
      .addCase(getAllSliders.pending, (state, action) => {
        state.allSliders = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getAllSliders.fulfilled, (state, action) => {
        state.allSliders = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getAllSliders.rejected, (state, action) => {
        state.allSliders = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });

    //
    builder
      .addCase(createSlider.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(createSlider.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(createSlider.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder
      .addCase(updateSlider.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(updateSlider.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(updateSlider.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
  },
});

export const { handleReload } = sliderSlice.actions;
export default sliderSlice.reducer;
