import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";

export const getPermissions = createAsyncThunk(
  "global/getPermissions",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.get("/permissions");
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const logout = createAsyncThunk("global/logout", async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  try {
    const response = await api.post("/users/logout");
    return response.data;
  } catch ({ response }) {
    return rejectWithValue(response.data.errors[0].message);
  }
});

export const askForUpdatephoneNumber = createAsyncThunk(
  "global/askForUpdatephoneNumber",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.post("/users/phone-number");
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const updatePhone = createAsyncThunk(
  "global/updatePhone",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.patch("/users/phone-number", data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const askForUpdateEmail = createAsyncThunk(
  "global/askForUpdateEmail",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.post("/users/email");
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const updateEmail = createAsyncThunk(
  "global/updateEmail",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.patch("/users/email", data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "global/updatePassword",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.patch("/users/change-password", data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const askForResetPassword = createAsyncThunk(
  "global/askForResetPassword",
  async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.post("/users/forget-password", data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const ResetPassword = createAsyncThunk(
  "global/ResetPassword",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.patch("/users/forget-password", data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const verifyCode = createAsyncThunk(
  "global/verifyCode",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.post("/users/verify-code", data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const ResendCode = createAsyncThunk(
  "global/resendCode",
  async (data = {}, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.post("/users/resend-code", data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    permissions: null,
    updateData: {},
  },
  reducers: {
    updateUserData: (state, action) => {
      let data = { ...state.updateData };
      data[action.payload.key] = action.payload.value;
      state.updateData = data;
    },
    resetUserData: (state, action) => {
      state.updateData = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPermissions.fulfilled, (state, action) => {
      state.permissions = action.payload;
    });
  },
});

export const { updateUserData, resetUserData } = globalSlice.actions;
export default globalSlice.reducer;
