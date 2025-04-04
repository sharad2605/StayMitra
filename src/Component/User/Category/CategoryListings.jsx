import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ Category URL se get karne ke liye
import "./CategoryListings.css";
import Booking from "../Booking/Booking"
import { useSelector } from "react-redux";

const CategoryListings = () => {
  const { categoryName } = useParams(); // ✅ URL se category lo
  const [listings, setListings] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userEmail = useSelector((state) => state.auth.email);
  

  useEffect(() => {
    console.log("Listings Data:", listings);
    const fetchListings = async () => {
      try {
        const response = await fetch(
          "https://staymitra-c6ae4-default-rtdb.firebaseio.com/listings.json"
        );
        if (!response.ok) throw new Error("Failed to fetch listings");

        const data = await response.json();
        console.log("Fetched Data:", data); // 🔥 Debugging ke liye print

        if (data) {
          const loadedListings = Object.keys(data).map((key) => ({
            id: key,
            placeName: data[key].placeName || "Unknown Place",
            category: data[key].category, // ✅ Yeh check karo ki sahi category aa rahi hai ya nahi
            price: data[key].price,
            address: data[key].address,
            city: data[key].city,
            pincode: data[key].pincode,
            images: data[key].images || [],
            availability: data[key].availability ?? true,
          }));
          setListings(loadedListings);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchListings();
  }, []);

  const openBookingModal = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  const closeBookingModal = () => {
    setSelectedListing(null);
    setShowModal(false);
  };
  
  // const handleConfirmBooking = async (bookingData) => {
  //   try {
  //     const response = await fetch(
  //       "https://staymitra-c6ae4-default-rtdb.firebaseio.com/bookings.json",
  //       {
  //         method: "POST",
  //         body: JSON.stringify(bookingData),
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );

  //     if (!response.ok) throw new Error("Booking Failed");

  //     alert("Booking placed successfully! Pending approval from admin.");
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  // const onConfirmBooking = async (sanitizedEmail, bookingData) => {
  //   try {
  //     const response = await fetch(
  //       `https://staymitra-c6ae4-default-rtdb.firebaseio.com/bookings/${sanitizedEmail}.json`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(bookingData),
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to book!");

  //     console.log("Booking Confirmed!", bookingData);
  //   } catch (error) {
  //     console.error("Booking Error:", error);
  //   }
  // };

  // ✅ **Filter listings based on category**
  const filteredListings = listings.filter(
    (listing) => listing.category === categoryName && listing.availability !== false
  );
  

  // 🔀 Sorting Function
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortOrder === "lowToHigh") return a.price - b.price;
    if (sortOrder === "highToLow") return b.price - a.price;
    return 0;
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{categoryName} Listings</h2>

      {/* Sorting Dropdown */}
      <div className="mb-4">
        <label className="fw-bold">Sort by Price:</label>
        <select
          className="form-select w-25"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>

      {/* Listings Display */}
      <div className="row">
        {sortedListings.length > 0 ? (
          sortedListings.map((listing) => (
            <div key={listing.id} className="col-md-4 mb-4">
              <div className="card p-3 shadow-sm">
                {/* 🖼 Image */}
                
                {listing.images.length > 0 && (
                  <img
                    src={listing.images[0]} 
                    alt={listing.name}
                    className="listing-image"
                  />
                )}

                {/* 📌 Details */}
                <h4 className="fw-bold mt-3">{listing.placeName}</h4>
                <p className="text-muted">
                  {listing.address}, {listing.city} - {listing.pincode}
                </p>
                
                <p className="price-tag">Price: ₹{listing.price} / night</p>

                {/* ✅ Book Now Button */}
                <button
                  className="book-now-btn"
                  onClick={() => openBookingModal(listing)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No listings found for {categoryName}.</p>
        )}
      </div>
      {selectedListing && (
        <Booking
          listing={selectedListing}
          show={showModal}
          onClose={closeBookingModal}
        />
      )}
    </div>
  );
};

export default CategoryListings;
