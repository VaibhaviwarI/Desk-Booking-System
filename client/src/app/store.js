import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingsReducer from "../features/bookings/bookingsSlice";
import waitlistReducer from "../features/waitlist/waitlistSlice";
import floorsReducer from "../features/floors/floorsSlice";
import adminReducer from "../features/admin/adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingsReducer,
    waitlist: waitlistReducer,
    floors: floorsReducer,
    admin: adminReducer,
  },
});

export default store;
