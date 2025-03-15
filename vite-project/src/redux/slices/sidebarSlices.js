import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSideOpen: (state) => {
      state.isSidebarOpen = true;
    },
    setSidebarClose: (state) => {
      state.isSidebarOpen = false;
    },
  },
});

export const { setSidebarClose, setSidebarOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
