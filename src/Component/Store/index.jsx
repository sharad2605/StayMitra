import { configureStore } from "@reduxjs/toolkit";
import AdminAuthReducer  from "./adminAuthSlice";
import  categoryReducer from "./addCategorySlice";
import addListingReducer from "./listingSlice";
import authReducer from "./authSlice"
import bookingReducer from './bookingSlice';

const store = configureStore({
  reducer: {
    AdminAuth: AdminAuthReducer,
    categories:categoryReducer,
    listings: addListingReducer,
    auth:authReducer,
    bookings: bookingReducer,
  },
});

export default store;
