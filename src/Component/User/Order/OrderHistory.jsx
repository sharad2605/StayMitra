import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OrderHistory = () => {
  const userEmail = useSelector((state) => state.auth.userEmail);
  console.log("User Email:", userEmail); // ✅ Debugging ke liye
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Boolean rakho

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userEmail) {
        console.error("No user email found!");
        setLoading(false);
        return;
      }

      try {
        const sanitizedEmail = userEmail.replace(/[@.]/g, ""); // ✅ Email sanitize
        const response = await fetch(
          `https://staymitra-c6ae4-default-rtdb.firebaseio.com/bookings/${sanitizedEmail}.json`
        );

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        console.log("Bookings Data from Firebase:", data); // ✅ Debugging ke liye

        if (data) {
          const loadedOrders = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setOrders(loadedOrders);
        } else {
          setOrders([]); // ✅ Agar koi booking nahi hai
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Bookings</h2>

      {loading ? (
        <p className="text-center">Loading...</p> // ✅ Loader
      ) : (
        <div className="row">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="col-md-4 mb-4">
                <div className="card p-3 shadow-sm">
                  {/* ✅ Image Show Karega Agar Available Hai */}
                  {order.images && order.images.length > 0 ? (
                    <img
                      src={order.images[0]}
                      alt={order.placeName}
                      className="img-fluid rounded"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <p className="text-muted">No Image Available</p>
                  )}

                  <h4 className="fw-bold mt-3">{order.placeName}</h4>
                  <p className="text-muted">{order.address}, {order.city} - {order.pincode}</p>
                  <p className="fw-bold">Price: ₹{order.price} / night</p>
                  <p className={`badge bg-${order.status === "pending" ? "warning" : "success"}`}>
                    {order.status.toUpperCase()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">You have no bookings yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
