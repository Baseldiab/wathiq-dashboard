import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";

export const login = createAsyncThunk(
  "auth/login",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      console.log(data);

      const response = await api.post("/admin/auth/signin", data);
      return response.data;
    } catch ({ response }) {
      console.log("RES", response.data.errors[0]);

      return rejectWithValue(response.data.errors[0]);
    }
  }
);
// 1234565895
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: null,
    error: null,
    loading: false,
    isLoggedIn: false,
  },
  reducers: {
    updateAuth: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.data = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
        state.loading = false;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.data = null;
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { updateAuth } = authSlice.actions;
export default authSlice.reducer;
