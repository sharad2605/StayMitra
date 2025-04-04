// store/bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    allBookings: [],
  },
  reducers: {
    setBookings(state, action) {
      state.allBookings = action.payload;
    },
    updateBookingStatus: (state, action) => {
        const { id, newStatus } = action.payload;
        const booking = state.allBookings.find((b) => b.id === id);
        if (booking) {
          booking.status = newStatus;
        }
      },
      
  },
});

export const { setBookings, updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
