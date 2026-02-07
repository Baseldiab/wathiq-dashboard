import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Redux/axios-config";
import { store } from "@/Redux/store/store.js";
import { getUserType } from "@/services/utils";

export const blockUser = createAsyncThunk(
  "user/blockUser",
  async ({ data, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.post(`/users/crm/block/${id}`, data);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const unBlockUser = createAsyncThunk(
  "user/unBlockUser",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.delete(`/users/crm/block/${id}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const getAllusers = createAsyncThunk(
  "user/getAllusers",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/users?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const FiltergetAllusers = createAsyncThunk(
  "user/FiltergetAllusers",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/users?limit=1000`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getUser = createAsyncThunk(
  "user/getUser",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.get(`/${userType}/users/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const blockSelectedUser = createAsyncThunk(
  "user/blockSelectedUser",
  async ({ data, id }, thunkAPI) => {
    console.log(data);

    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();

      const response = await api.post(`/${userType}/users/block/${id}`, data);
      return response;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);

export const unBlockSelectedUser = createAsyncThunk(
  "user/unBlockSelectedUser",
  async (id, thunkAPI) => {
    console.log("ID", id);

    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();

      const response = await api.delete(`/${userType}/users/block/${id}`);
      return response;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const notifyAllusers = createAsyncThunk(
  "user/notifyAllusers",
  async ({ data = {}, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.post(
        `/${userType}/notifications/notify-all-users`,
        data
      );

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const notifySpacificusers = createAsyncThunk(
  "user/notifySpacificusers",
  async ({ data = {}, id }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const userType = getUserType();
      const response = await api.post(
        `/${userType}/notifications/notify-user`,
        data
      );

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || "حدث خطأ غير متوقع";
      return rejectWithValue(errorMessage);
    }
  }
);
export const getUserAuctions = createAsyncThunk(
  "user/getUserAuctions",
  async ({ userId, result }, thunkAPI) => {
    console.log("USerID", userId);
    const { rejectWithValue } = thunkAPI;
    try {
      const profileData = store.getState()?.profile?.data?.data;

      const userType =
        profileData?.type ||
        (profileData?.employeeType?.includes("admin")
          ? "admin"
          : profileData?.employeeType?.includes("provider")
          ? "providers"
          : null);

      if (!userType) {
        throw new Error("User type not found");
      }

      const response = await api.get(
        `/${userType}/auctions/user/${userId}?${result}=true`,
        {}
      );

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
export const getAllRealEstate = createAsyncThunk(
  "contact/getAllRealEstate",
  async (params, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const profileData = store.getState()?.profile?.data?.data;
      const userType =
        profileData?.type ||
        (profileData?.employeeType?.includes("admin")
          ? "admin"
          : profileData?.employeeType?.includes("provider")
          ? "providers"
          : null);
      const response = await api.get(`/${userType}/real-estate?${params}`);
      return response.data;
    } catch ({ response }) {
      return rejectWithValue(response.data.errors[0].message);
    }
  }
);
export const userSlice = createSlice({
  name: "user",
  initialState: {
    usersData: null,
    selectedUser: null,
    selectedUserAuctions: null,
    error: null,
    All_loading: false,
    selected_loading: false,
    selected_Auctions_loading: false,
    /**notify All users */
    notifyAllusersFlag: false,
    notifyAllusersError: null,
    notifyAllusersLoading: false,
    //notifi spacificUSer
    notifySpacificusersFlag: false,
    notifySpacificusersError: null,
    notifySpacificusersLoading: false,
    //get Data for Filter
    usersFilterData: null,
    usersFilterLoading: false,
    usersFilterError: false,
    //block & unblock
    blockSelectedUserData: null,
    blockSelectedUserError: false,
    blockSelectedUserLoading: false,
    //getAllRealEstate
    allRealEstateData: null,
    allRealEstateLoading: false,
    allRealEstateError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //all users
    builder
      .addCase(getAllusers.pending, (state, action) => {
        state.usersData = null;
        state.error = null;
        state.All_loading = true;
      })
      .addCase(getAllusers.fulfilled, (state, action) => {
        state.usersData = action.payload;
        state.error = null;
        state.All_loading = false;
        state.reload = false;
      })
      .addCase(getAllusers.rejected, (state, action) => {
        state.usersData = null;
        state.error = action.payload;
        state.All_loading = false;
        state.reload = false;
      })
      //spacigic user
      .addCase(getUser.pending, (state, action) => {
        state.selectedUser = null;
        state.error = null;
        state.selected_loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
        state.error = null;
        state.selected_loading = false;
        state.reload = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.selectedUser = null;
        state.error = action.payload;
        state.selected_loading = false;
        state.reload = false;
      })
      //notify all users
      .addCase(notifyAllusers.pending, (state) => {
        state.notifyAllusersFlag = false;
        state.notifyAllusersError = null;
        state.notifyAllusersLoading = true;
      })
      .addCase(notifyAllusers.fulfilled, (state) => {
        state.notifyAllusersFlag = true;
        state.notifyAllusersError = null;
        state.notifyAllusersLoading = false;
      })
      .addCase(notifyAllusers.rejected, (state, action) => {
        state.notifyAllusersFlag = false;
        state.notifyAllusersError = action.payload || "حدث خطأ";
        state.notifyAllusersLoading = false;
      })
      //Notify spacific user   .addCase(notifyAllusers.pending, (state) => {
      .addCase(notifySpacificusers.pending, (state, action) => {
        state.notifySpacificusersFlag = false;
        state.notifySpacificusersError = null;
        state.notifySpacificusersLoading = true;
      })
      .addCase(notifySpacificusers.fulfilled, (state) => {
        state.notifySpacificusersFlag = true;
        state.notifySpacificusersError = null;
        state.notifySpacificusersLoading = false;
      })
      .addCase(notifySpacificusers.rejected, (state, action) => {
        state.notifySpacificusersFlag = false;
        state.notifySpacificusersError = action.payload || "حدث خطأ";
        state.notifySpacificusersLoading = false;
      })
      //Filter Data
      .addCase(FiltergetAllusers.pending, (state, action) => {
        state.usersFilterData = null;
        state.usersFilterError = null;
        state.usersFilterLoading = true;
      })
      .addCase(FiltergetAllusers.fulfilled, (state, action) => {
        state.usersFilterData = action.payload;
        state.usersFilterError = null;
        state.usersFilterLoading = false;
        state.reload = false;
      })
      .addCase(FiltergetAllusers.rejected, (state, action) => {
        state.usersFilterData = null;
        state.usersFilterError = action.payload;
        state.usersFilterLoading = false;
        state.reload = false;
      })
      /**block unblock */
      .addCase(blockSelectedUser.pending, (state) => {
        state.blockSelectedUserData = false;
        state.blockSelectedUserError = null;
        state.blockSelectedUserLoading = true;
      })
      .addCase(blockSelectedUser.fulfilled, (state) => {
        state.blockSelectedUserData = true;
        state.blockSelectedUserError = null;
        state.blockSelectedUserLoading = false;
      })
      .addCase(blockSelectedUser.rejected, (state, action) => {
        state.blockSelectedUserData = false;
        state.blockSelectedUserError = action.payload || "حدث خطأ";
        state.blockSelectedUserLoading = false;
      })
      .addCase(unBlockSelectedUser.pending, (state) => {
        state.blockSelectedUserData = false;
        state.blockSelectedUserError = null;
        state.blockSelectedUserLoading = true;
      })
      .addCase(unBlockSelectedUser.fulfilled, (state) => {
        state.blockSelectedUserData = true;
        state.blockSelectedUserError = null;
        state.blockSelectedUserLoading = false;
      })
      .addCase(unBlockSelectedUser.rejected, (state, action) => {
        state.blockSelectedUserData = false;
        state.blockSelectedUserError = action.payload || "حدث خطأ";
        state.blockSelectedUserLoading = false;
      })
      //spacigic user Auctions
      .addCase(getUserAuctions.pending, (state, action) => {
        state.selectedUserAuctions = null;
        state.error = null;
        state.selected_Auctions_loading = true;
      })
      .addCase(getUserAuctions.fulfilled, (state, action) => {
        state.selectedUserAuctions = action.payload;
        state.error = null;
        state.selected_Auctions_loading = false;
        state.reload = false;
      })
      .addCase(getUserAuctions.rejected, (state, action) => {
        state.selectedUserAuctions = null;
        state.error = action.payload;
        state.selected_Auctions_loading = false;
        state.reload = false;
      })
      // allRealEstateData
      .addCase(getAllRealEstate.pending, (state, action) => {
        state.allRealEstateData = null;
        state.allRealEstateError = null;
        state.allRealEstateLoading = true;
      })
      .addCase(getAllRealEstate.fulfilled, (state, action) => {
        state.allRealEstateData = action.payload;
        state.allRealEstateError = null;
        state.allRealEstateLoading = false;
      })
      .addCase(getAllRealEstate.rejected, (state, action) => {
        state.allRealEstateData = null;
        state.allRealEstateError = action.payload;
        state.allRealEstateLoading = false;
      });
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
