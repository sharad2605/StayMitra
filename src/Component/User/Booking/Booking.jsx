import React, { useState } from "react";
import { useSelector } from "react-redux"; // ✅ Redux se email le rahe hai
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Booking = ({ listing, onClose }) => {
  const userEmail = useSelector((state) => state.auth.email); // ✅ Redux se email
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [userAddress, setUserAddress] = useState("");
const token = useSelector((state) => state.auth.token);
const navigate = useNavigate();

const calculateTotalPrice = (checkIn, checkOut, pricePerNight, guests) => {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffTime = outDate - inDate;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return days * pricePerNight * guests;
};


  const handleBooking = async () => {
    if (!token) {
        alert("You need to login first!");
        navigate("/login"); // 🚀 Redirect to login page if not logged in
        return;
      }
      if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
        alert("Please enter valid check-in and check-out dates.");
        return;
      }
      console.log("Check-In:", checkIn);
console.log("Check-Out:", checkOut);
    const sanitizedEmail = userEmail.replace(/[@.]/g, ""); // ✅ Email sanitize
  
    const bookingData = {
      placeName: listing.placeName,
      category: listing.category,
      price: listing.price,
      address: listing.address,
      city: listing.city,
      pincode: listing.pincode,
      checkIn,
      checkOut,
      guests,
      userAddress,
      status: "pending",
      images: listing.images || [],
      createdAt: new Date().toISOString(),
      email: userEmail,
      totalPrice: calculateTotalPrice(checkIn, checkOut, listing.price, guests),
    };
    
    
    onClose();
  
    try {
      const response = await fetch(
        `https://staymitra-c6ae4-default-rtdb.firebaseio.com/bookings/${sanitizedEmail}.json`,
        {
          method: "POST", // ✅ Ensure POST method
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData), // ✅ Store as Object
        }
      );
  
      if (!response.ok) throw new Error("Booking failed!");
  
      console.log("Booking Successful!");
    } catch (error) {
      console.error("Error booking:", error);
    }
  };
  

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Book {listing.placeName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Check-in Date:</Form.Label>
            <Form.Control type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Check-out Date:</Form.Label>
            <Form.Control type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Guests:</Form.Label>
            <Form.Control type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Address:</Form.Label>
            <Form.Control as="textarea" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleBooking}>
          Confirm Booking
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Booking;
