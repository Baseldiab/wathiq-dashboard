import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get("/admin/auth/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, data[key]);
      }

      const response = await api.patch("/admin/auth/profile", formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    error: null,
    loading: false,
    reload: false,
    updateProfileFlag: false,
  },
  reducers: {
    updateUserProfile: (state, action) => {
      state.reload = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.data = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });
    builder
      .addCase(updateProfile.pending, (state, action) => {
        state.updateProfileFlag = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfileFlag = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfileFlag = false;
      });
  },
});

export const { updateUserProfile } = profileSlice.actions;
export default profileSlice.reducer;
