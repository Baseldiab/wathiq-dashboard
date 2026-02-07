import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { appendToFormData } from "@/services/utils";

export const getSetting = createAsyncThunk(
  "setting/getSetting",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get("/admin/setting");
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const updateSetting = createAsyncThunk(
  "setting/updateSetting",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const formData = new FormData();

      appendToFormData(formData, data);

      const response = await api.patch("/admin/setting", formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const settingSlice = createSlice({
  name: "setting",
  initialState: {
    setting: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSetting.pending, (state, action) => {
        state.setting = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getSetting.fulfilled, (state, action) => {
        state.setting = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getSetting.rejected, (state, action) => {
        state.setting = null;
        state.error = action.payload;
        state.loading = false;
      });
    builder
      .addCase(updateSetting.pending, (state, action) => {
        state.setting = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.setting = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(updateSetting.rejected, (state, action) => {
        state.setting = null;
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const {} = settingSlice.actions;
export default settingSlice.reducer;
