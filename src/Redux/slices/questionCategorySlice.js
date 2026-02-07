import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { getUserType } from "@/services/utils";

export const createQuestionCategory = createAsyncThunk(
  "question-category/createQuestionCategory",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.post(`/${userType}/question-categories`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const updateQuestionCategory = createAsyncThunk(
  "question-category/updateQuestionCategory",
  async ({ data, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.patch(
        `/${userType}/question-categories/${id}`,
        data
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getQuestionCategory = createAsyncThunk(
  "question-category/getQuestionCategory",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/question-categories/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuestionCategories = createAsyncThunk(
  "question-category/getQuestionCategories",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/question-categories`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getAllQuestionCategories = createAsyncThunk(
  "question-category/getAllQuestionCategories",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(
        `/${userType}/question-categories?limit=1000`
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const deleteQuestionCategory = createAsyncThunk(
  "question-category/deleteQuestionCategory",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.delete(
        `/${userType}/question-categories/${id}`
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const questionCategorySlice = createSlice({
  name: "question-category",
  initialState: {
    questionCategories: null,
    allQuestionCategories: null,
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
      .addCase(getQuestionCategories.pending, (state, action) => {
        state.questionCategories = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getQuestionCategories.fulfilled, (state, action) => {
        state.questionCategories = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getQuestionCategories.rejected, (state, action) => {
        state.questionCategories = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });
    //
    builder
      .addCase(getAllQuestionCategories.pending, (state, action) => {
        state.allQuestionCategories = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getAllQuestionCategories.fulfilled, (state, action) => {
        state.allQuestionCategories = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getAllQuestionCategories.rejected, (state, action) => {
        state.allQuestionCategories = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });

    //
    builder
      .addCase(createQuestionCategory.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(createQuestionCategory.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(createQuestionCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder
      .addCase(updateQuestionCategory.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(updateQuestionCategory.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(updateQuestionCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder
      .addCase(deleteQuestionCategory.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(deleteQuestionCategory.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(deleteQuestionCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
  },
});

export const { handleReload } = questionCategorySlice.actions;
export default questionCategorySlice.reducer;
