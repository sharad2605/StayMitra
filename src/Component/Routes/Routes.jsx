import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// ✅ Layouts
import UserLayout from "../User/Layout/UserLayout";
import AdminLayout from "../Admin/Layout/AdminLayout";

// ✅ User Pages
import Authform from "../User/Login/Authform";
import Home from "../User/Home/Home";
import CategoryListings from "../User/Category/CategoryListings";
import OrderHistory from "../User/Order/OrderHistory";

// ✅ Admin Pages
import AdminLogin from "../Admin/Pages/AdminLogin";
import Dashboard from "../Admin/Dashboard/Dashboard";
import ManageCategories from "../Admin/Category/ManageCategories";
import AddListing from "../Admin/Listings/AddListing";
import ManageListing from "../Admin/Listings/ManageListing";
import ManageBooking from "../Admin/Booking/ManageBooking";

const AppRoutes = () => {
   const isUserLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const isAdminLoggedIn = useSelector((state) => state.adminAuth.isAuthenticated); //

  return (
    <Routes>

      {/* ✅ USER ROUTES */}
      <Route path="/" element={<UserLayout />}>
        <Route
          path="login"
          element={
            isUserLoggedIn ? <Navigate to="/" /> : <Authform />
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryName" element={<CategoryListings />} />
        <Route
          path="/my-orders"
          element={
            isUserLoggedIn ? <OrderHistory /> : <Navigate to="/login" />
          }
        />
      </Route>

      {/* ✅ ADMIN ROUTES */}
      <Route
        path="/admin/login"
        element={
          isAdminLoggedIn ? <Navigate to="/admin/dashboard" /> : <AdminLogin />
        }
      />
      <Route
        path="/admin"
        element={
          isAdminLoggedIn ? <AdminLayout /> : <Navigate to="/admin/login" />
        }
      >
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
