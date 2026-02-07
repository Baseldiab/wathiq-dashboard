import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { getUserType } from "@/services/utils";

export const createQuestion = createAsyncThunk(
  "question/createQuestion",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.post(`/${userType}/questions`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "question/updateQuestion",
  async ({ data, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.patch(`/${userType}/questions/${id}`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getQuestion = createAsyncThunk(
  "question/getQuestion",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/questions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuestions = createAsyncThunk(
  "question/getQuestions",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(`/${userType}/questions`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const getAllQuestions = createAsyncThunk(
  "question/getAllQuestions",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.get(
        `/${userType}/questions?limit=1000${params ? `&${params}` : ""}`
      );
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "question/deleteQuestion",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
          const userType = getUserType();
      const response = await api.delete(`/${userType}/questions/${id}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const questionSlice = createSlice({
  name: "question",
  initialState: {
    questions: null,
    allQuestions: null,
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
      .addCase(getQuestions.pending, (state, action) => {
        state.questions = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.questions = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });
    //
    builder
      .addCase(getAllQuestions.pending, (state, action) => {
        state.allQuestions = null;
        state.error = null;
        state.loading = true;
      })
      .addCase(getAllQuestions.fulfilled, (state, action) => {
        state.allQuestions = action.payload;
        state.error = null;
        state.loading = false;
        state.reload = false;
      })
      .addCase(getAllQuestions.rejected, (state, action) => {
        state.allQuestions = null;
        state.error = action.payload;
        state.loading = false;
        state.reload = false;
      });

    //
    builder
      .addCase(createQuestion.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder
      .addCase(updateQuestion.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
    //
    builder
      .addCase(deleteQuestion.pending, (state, action) => {
        state.updateLoading = true;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.reload = true;
        state.updateLoading = false;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.error = action.payload;
        state.updateLoading = false;
      });
  },
});

export const { handleReload } = questionSlice.actions;
export default questionSlice.reducer;
