import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/bookings/my-bookings");
      return data.bookings;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch bookings");
    }
  }
);

export const bookDesk = createAsyncThunk(
  "bookings/book",
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/bookings/book", bookingData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Booking failed");
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (bookingId, { rejectWithValue }) => {
    try {
      await API.patch(`/bookings/${bookingId}/cancel`);
      return bookingId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Cancel failed");
    }
  }
);

export const checkInBooking = createAsyncThunk(
  "bookings/checkIn",
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/bookings/${bookingId}/check-in`);
      return data.booking;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Check-in failed");
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    myBookings: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearBookingMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMyBookings.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Book
      .addCase(bookDesk.pending, (state) => { state.isLoading = true; state.error = null; state.successMessage = null; })
      .addCase(bookDesk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.waitlisted
          ? "No desks available. You have been added to the waitlist."
          : `Desk booked! Assigned: ${action.payload.assignedDesk?.deskNumber} (Zone ${action.payload.assignedDesk?.zone})`;
      })
      .addCase(bookDesk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const booking = state.myBookings.find((b) => b._id === action.payload);
        if (booking) booking.status = "CANCELLED";
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Check-In
      .addCase(checkInBooking.fulfilled, (state, action) => {
        const idx = state.myBookings.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.myBookings[idx] = action.payload;
      })
      .addCase(checkInBooking.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearBookingMessages } = bookingsSlice.actions;
export default bookingsSlice.reducer;
