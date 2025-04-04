import { useState } from "react";
import { NavLink } from "react-router-dom";
import './sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>☰</button>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/add/categories" className={({ isActive }) => isActive ? "active-link" : ""}>
          Manage Categories
        </NavLink>
        <NavLink to="/admin/add/listings" className={({ isActive }) => isActive ? "active-link" : ""}>
        Add Listings
        </NavLink>
        <NavLink to="/admin/manage/listings" className={({ isActive }) => isActive ? "active-link" : ""}>
        Manage Listings
        </NavLink>
        <NavLink to="/admin/manage/booking" className={({ isActive }) => isActive ? "active-link" : ""}>
          Manage Booking
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;
