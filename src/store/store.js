import { configureStore } from "@reduxjs/toolkit";

// slice import
import menuReducer from "./slices/menuSlice.js";
import statsReducer from "./slices/statsSlice.js";
import authReducer from "./slices/authSlice.js";
import reservationReducer from "./slices/reservationSlice.js";

export default configureStore({
  reducer: {
    menu: menuReducer,
    stats: statsReducer,
    auth: authReducer,
    reservation: reservationReducer,
  }
});