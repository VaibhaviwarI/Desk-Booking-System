import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

export const fetchMyWaitlist = createAsyncThunk(
  "waitlist/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/waitlist/my-waitlist");
      return data.waitlists;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch waitlist");
    }
  }
);

export const cancelWaitlist = createAsyncThunk(
  "waitlist/cancel",
  async (waitlistId, { rejectWithValue }) => {
    try {
      await API.patch(`/waitlist/${waitlistId}/cancel`);
      return waitlistId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Cancel failed");
    }
  }
);

const waitlistSlice = createSlice({
  name: "waitlist",
  initialState: {
    myWaitlist: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyWaitlist.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMyWaitlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myWaitlist = action.payload;
      })
      .addCase(fetchMyWaitlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(cancelWaitlist.fulfilled, (state, action) => {
        const entry = state.myWaitlist.find((w) => w._id === action.payload);
        if (entry) entry.status = "CANCELLED";
      });
  },
});

export default waitlistSlice.reducer;
