import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { getUserType } from "@/services/utils";
export const getAllContactUs = createAsyncThunk(
  "contact/getAllContactUs",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/contact-us?${params}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const supportSlice = createSlice({
  name: "support",
  initialState: {
    entities: {
      question: { data: null, loading: false, error: null },
      suggestion: { data: null, loading: false, error: null },
      complaint: { data: null, loading: false, error: null },
      other: { data: null, loading: false, error: null },
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder;
    builder
      .addCase(getAllContactUs.pending, (state, action) => {
        // Extract `type` from the query string. e.g. "type=question&page=1"
        const type = new URLSearchParams(action.meta.arg).get("type");
        if (!type) return;
        state.entities[type].loading = true;
        state.entities[type].error = null;
      })
      .addCase(getAllContactUs.fulfilled, (state, action) => {
        const type = new URLSearchParams(action.meta.arg).get("type");
        if (!type) return;
        state.entities[type].loading = false;
        state.entities[type].data = action.payload;
      })
      .addCase(getAllContactUs.rejected, (state, action) => {
        const type = new URLSearchParams(action.meta.arg).get("type");
        if (!type) return;
        state.entities[type].loading = false;
        state.entities[type].error = action.payload;
      });
  },
});

export default supportSlice.reducer;
