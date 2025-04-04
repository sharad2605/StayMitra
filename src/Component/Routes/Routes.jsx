import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "../User/Layout/UserLayout";
import AdminLayout from '../Admin/Layout/AdminLayout';
import { useSelector } from "react-redux";


// User Page


// Admin Pages
import AdminLogin from "../Admin/Pages/AdminLogin";
import Dashboard from "../Admin/Dashboard/Dashboard";
import ManageCategories from "../Admin/Category/ManageCategories";
import AddListing from "../Admin/Listings/AddListing";
import ManageListing from "../Admin/Listings/ManageListing";
import Authform from "../User/Login/Authform";
import Home from "../User/Home/Home";
import CategoryListings from "../User/Category/CategoryListings";
import OrderHistory from "../User/Order/OrderHistory";
import ManageBooking from "../Admin/Booking/ManageBooking";


const AppRoutes = () => {
  const loggedInUserEmail = useSelector((state) => state.auth.email); 
  console.log(loggedInUserEmail)
  return (
   
      <Routes>
        {/* ✅ User Routes */}
        <Route path="/" element={<UserLayout />}>
        <Route path="login" element={<Authform />} />
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryName" element={<CategoryListings />} /> 
        <Route path="/my-orders" element={<OrderHistory />} /> 
        </Route>
     {/* ✅ My Orders Route ko bahar rakho */}
        

        {/* ✅ Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add/categories" element={<ManageCategories />} />
        <Route path="add/listings" element={<AddListing />} />
        <Route path="manage/listings" element={<ManageListing />} />
        <Route path="manage/booking" element={<ManageBooking />} />
        
        
        </Route>
      </Routes>
  
  );
};

export default AppRoutes;
