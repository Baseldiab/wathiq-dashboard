import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";
import storageSession from "redux-persist/lib/storage/session";
import { authSlice } from "../slices/authSlice";
import { profileSlice } from "../slices/profileSlice";
import { globalSlice } from "../slices/globalSlice";
import { employeeSlice } from "../slices/employeeSlice";
import { departmentSlice } from "../slices/departmentSlice";
import { providerSlice } from "../slices/providerSlice";
import { userSlice } from "../slices/userSlice";
import { roleSlice } from "../slices/roleSlice";
import { questionSlice } from "../slices/questionSlice";
import { questionCategorySlice } from "../slices/questionCategorySlice";
import { policySlice } from "../slices/policySlice";
import { partnerSlice } from "../slices/partnerSlice";
import { sliderSlice } from "../slices/sliderSlice";
import { settingSlice } from "../slices/settingSlice";
import { socialSlice } from "../slices/socialSlice";
import { supportSlice } from "../slices/supportSlice";
import { agenciesSlice } from "../slices/agenciesSlice";
import { auctionSlice } from "../slices/auctionsSlice";
import { originSlice } from "../slices/originsSlice";
import { logoSlice } from "../slices/logosSlice";
import { enrollmentSlice } from "../slices/enrollmentSlice";
import { notificationsSlice } from "../slices/notificationsSlice";
import { WalletSlice } from "../slices/walletSlice";
import { analysisSlice } from "../slices/analysisSlice";
import { PropertySlice } from "../slices/property-management";
const persistConfig = {
  key: "root",
  storage: storageSession,
};

const rootReducers = combineReducers({
  auth: authSlice.reducer,
  global: globalSlice.reducer,
  profile: profileSlice.reducer,
  employee: employeeSlice.reducer,
  department: departmentSlice.reducer,
  provider: providerSlice.reducer,
  user: userSlice.reducer,
  agencies: agenciesSlice.reducer,
  role: roleSlice.reducer,
  question: questionSlice.reducer,
  questionCategory: questionCategorySlice.reducer,
  policy: policySlice.reducer,
  partner: partnerSlice.reducer,
  slider: sliderSlice.reducer,
  social: socialSlice.reducer,
  setting: settingSlice.reducer,
  support: supportSlice.reducer,
  auctions: auctionSlice.reducer,
  origins: originSlice.reducer,
  logos: logoSlice.reducer,
  enrollment: enrollmentSlice.reducer,
  notifications: notificationsSlice.reducer,
  wallet: WalletSlice.reducer,
  analysis: analysisSlice.reducer,
  property:PropertySlice.reducer
});
const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ["some.nested.path.to.ignore"],
      },
    }),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
