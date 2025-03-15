import { combineReducers, configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./slices/sidebarSlices";

const store = configureStore({
  reducer: combineReducers({
    sidebar: sidebarReducer,
  }),
});

export default store;
