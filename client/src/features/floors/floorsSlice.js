import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

export const fetchFloors = createAsyncThunk(
  "floors/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/floors");
      return data.floors;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch floors");
    }
  }
);

export const createFloor = createAsyncThunk(
  "floors/create",
  async (floorData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/floors", floorData);
      return data.floor;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create floor");
    }
  }
);

const floorsSlice = createSlice({
  name: "floors",
  initialState: {
    floors: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFloors.pending, (state) => { state.isLoading = true; })
      .addCase(fetchFloors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.floors = action.payload;
      })
      .addCase(fetchFloors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createFloor.fulfilled, (state, action) => {
        state.floors.push(action.payload);
      })
      .addCase(createFloor.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default floorsSlice.reducer;
