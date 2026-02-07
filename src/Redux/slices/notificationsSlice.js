import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";

export const getAllnotifications = createAsyncThunk(
  "/allnotifications",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get("/users/notifications/?limit=6");
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getnotificationsPerPage = createAsyncThunk(
  "/notifications",
  async (params = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get(`/users/notifications?${params}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: null,
    error: null,
    loading: false,
  },
  reducers: {
    update(state, action) {
      Object.assign(state, action.payload);
    },

    extendOrUpdateExisting(state, action) {
      const { key, payload } = action?.payload;

      // Check if the item with the same _id exists
      const existingItemIndex = state[key]?.findIndex(
        (item) => item?._id === payload?._id
      );
      if (existingItemIndex !== -1) {
        // Item exists, update it
        state[key][existingItemIndex] = payload;
      } else {
        // Item doesn't exist, add it to the start of the array
        state[key] = [payload, ...state?.[key]];
      }
    },

    updateAll(state, action) {
      const { mainKey, key, value } = action.payload; // Extract mainKey, key, and value from action payload

      // Ensure we're updating the right part of the state (mainKey)
      if (state[mainKey]) {
        state[mainKey] = state[mainKey]?.map((item) => ({
          ...item,
          [key]: value, // Update the key (e.g., "status") to the new value
        }));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllnotifications.pending, (state, action) => {
        state.notifications = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getAllnotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getAllnotifications.rejected, (state, action) => {
        state.notifications = null;
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getnotificationsPerPage.pending, (state, action) => {
        state.notifications = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getnotificationsPerPage.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getnotificationsPerPage.rejected, (state, action) => {
        state.notifications = null;
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { update, extendOrUpdateExisting, updateAll } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
