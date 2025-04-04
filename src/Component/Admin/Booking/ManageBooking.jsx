import { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setBookings, updateBookingStatus } from "../../Store/bookingSlice";

const ManageBooking = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.allBookings);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("https://staymitra-c6ae4-default-rtdb.firebaseio.com/bookings.json");
        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        const loaded = [];

        Object.keys(data).forEach((userKey) => {
          const userBookings = data[userKey];
          if (userBookings) {
            Object.keys(userBookings).forEach((bookingId) => {
              const booking = userBookings[bookingId];
              if (booking && booking.placeName && booking.email) {
                loaded.push({
                  id: bookingId,
                  emailKey: userKey,
                  ...booking,
                });
              }
            });
          }
        });

        dispatch(setBookings(loaded));
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [dispatch]);

  const handleApproveBooking = async (bookingId, email) => {
    const sanitizedEmail = email.replace(/[@.]/g, "");
    try {
      await fetch(`https://staymitra-c6ae4-default-rtdb.firebaseio.com/bookings/${sanitizedEmail}/${bookingId}.json`, {
        method: "PATCH",
        body: JSON.stringify({ status: "success" }),
      });

      dispatch(updateBookingStatus({ id: bookingId, newStatus: "success" }));
    } catch (err) {
      console.error("❌ Approval failed:", err);
    }
  };

  const handleRejectBooking = async (bookingId, email) => {
    const sanitizedEmail = email.replace(/[@.]/g, "");
    try {
      await fetch(`https://staymitra-c6ae4-default-rtdb.firebaseio.com/bookings/${sanitizedEmail}/${bookingId}.json`, {
        method: "PATCH",
        body: JSON.stringify({ status: "pending" }),
      });

      dispatch(updateBookingStatus({ id: bookingId, newStatus: "pending" }));
    } catch (err) {
      console.error("❌ Rejection failed:", err);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4 text-center">Manage Bookings</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User Email</th>
            <th>Place</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Guests</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.email}</td>
              <td>{booking.placeName}</td>
              <td>{booking.checkIn}</td>
              <td>{booking.checkOut}</td>
              <td>{booking.guests}</td>
              <td>₹{booking.totalPrice || 0}</td>
              <td>
                <span
                  className={`badge ${
                    booking.status === "success" ? "bg-success" : "bg-warning text-dark"
                  }`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </td>
              <td>
                <Button
                  variant="success"
                  className="me-2"
                  onClick={() => handleApproveBooking(booking.id, booking.email)}
                  disabled={booking.status === "success"}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleRejectBooking(booking.id, booking.email)}
                  disabled={booking.status === "pending"}
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageBooking;
