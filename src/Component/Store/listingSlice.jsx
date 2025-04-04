import { createSlice } from "@reduxjs/toolkit";

const addListingSlice = createSlice({
  name: "listings",
  initialState: { listings: [] },
  reducers: {
    setListings(state, action) {
      state.listings = action.payload; // ✅ Firebase se fetch kiya hua data store karega
    },
    addListing(state, action) {
      state.listings.push(action.payload); // ✅ Naya listing Redux store me add karega
    },
    deleteListing: (state, action) => {
        state.listings = state.listings.filter((listing) => listing.id !== action.payload);
      },
      updateListing: (state, action) => {
        const index = state.listings.findIndex((listing) => listing.id === action.payload.id);
        if (index !== -1) {
          state.listings[index] = { ...action.payload }; // ✅ Ensure purana object properly replace ho
        }
      },
      
  },
});

export const { setListings, addListing,deleteListing,updateListing } = addListingSlice.actions;
export default addListingSlice.reducer;
