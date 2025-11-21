import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListings, updateListing,deleteListing } from "../../Store/listingSlice";
import { setCategories  } from "../../Store/addCategorySlice";
import { Table, Button, Modal, Form } from "react-bootstrap";

import "./ManageListing.css";

const ManageListings = () => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.listings);
  const categories = useSelector((state) => state.categories.categories);
  console.log("Categories from Redux:", categories);
  console.log(useSelector((state) => state.listings.listings));
  console.log("🔥 Redux Store Listings:", listings);

  const [showModal, setShowModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedAvailability, setUpdatedAvailability] = useState(true);

  const [formData, setFormData] = useState({
    placeName: "",
    price: "",
    category: "",
    address: "",
    description: "",
    availability: true,
    images: [],
  });

  useEffect(() => {
    if (selectedListing) {
        const updatedData = {
            placeName: selectedListing.placeName || "",
            price: selectedListing.price || "",
            category: selectedListing.category || "Villa", // ✅ Fix default value
            address: selectedListing.address || "",
            description: selectedListing.description ?? "No description available", // ✅ Fix default value
            availability: selectedListing.availability ?? true,
            images: Array.isArray(selectedListing.images) ? selectedListing.images : [],
          };
      setFormData(updatedData);  
      console.log("🔥 Updated Form Data inside useEffect:", {
        placeName: selectedListing.placeName,
        price: selectedListing.price,
        category: selectedListing.category,
        address: selectedListing.address,
        description:  selectedListing.description,
        availability:selectedListing.availability ?? true,
        images: selectedListing.images,
      });
    }
  }, [selectedListing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
  
    // Convert images to base64
    const base64Images = await Promise.all(files.map((file) => convertToBase64(file)));
  
    // Merge old and new images
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...base64Images], // ✅ Keep old + new images
    }));
  };
  
  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    const fetchListings = async () => {
      const url = "https://staymitra-c6ae4-default-rtdb.firebaseio.com/listings.json";
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch listings");

        const data = await response.json();
        if (data) {
          const loadedListings = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          console.log("✅ Processed Listings Data:", loadedListings);
          dispatch(setListings(loadedListings));
          
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchListings();
  }, [dispatch]);

  const handleEditClick = (listing) => {
    setSelectedListing(listing);
    setUpdatedDescription(listing.description);
    setUpdatedAvailability(listing.availability);
    console.log("Editing Listing:", listing);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const url = "https://staymitra-c6ae4-default-rtdb.firebaseio.com/categories.json";
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("❌ Failed to fetch categories");
  
        const data = await response.json();
        console.log("🔥 Categories from API:", data); // ✅ Check API response
  
        if (data) {
          const loadedCategories = Object.keys(data).map((key) => ({
            id: key,
            name: data[key].name,
          }));
          console.log("✅ Processed Categories:", loadedCategories); // ✅ Check processed data
          dispatch(setCategories(loadedCategories));
        }
      } catch (error) {
        console.error("🔥 Error:", error);
      }
    };
  
    fetchCategories();
  }, [dispatch]); // ✅ Redux update hone par dobara fetch hoga
  
  const handleImageDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const deleteHandler = async (id) => {
    const url = `https://staymitra-c6ae4-default-rtdb.firebaseio.com/listings/${id}.json`;
    try {
      const response = await fetch(url, { method: "DELETE" });
      if (response.ok) {
        dispatch(deleteListing(id));
      } else {
        console.error("❌ Failed to delete listing");
      }
    } catch (error) {
      console.error("🔥 Error:", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedListing) return;
  
    const updatedData = {
      placeName: formData.placeName,
      price: formData.price,
      category: formData.category,
      address: formData.address,
      description: formData.description,
      availability: formData.availability,
      images:formData.images, // Ensure images are correctly updated
      createdAt: new Date().toISOString()
    };
  
    const url = `https://staymitra-c6ae4-default-rtdb.firebaseio.com/listings/${selectedListing.id}.json`;
  
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) throw new Error("Failed to update listing.");
  
      const updatedResponse = await fetch(url); // Fetch latest data from Firebase
      const updatedListing = await updatedResponse.json();
  
      console.log("🔥 Firebase Updated Data:", updatedListing);
  
      // Ensure Redux updates the store with the latest data
      dispatch(updateListing({ id: selectedListing.id, ...updatedListing }));
  
      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  
  

  return (
    <div className="container">
      <h2>Manage Listings</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Place Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Availability</th>
            <th>Total Price</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id}>
              <td>{listing.placeName}</td>
              <td>₹{listing.price}</td>
              <td>{listing.category}</td>
              <td>{listing.availability ? "Available" : "Not Available"}</td>
              <td>₹{listing.price * (listing.totalNights || 1)}</td> {/* ✅ Total Price Calculation */}
              <td>{new Date(listing.createdAt).toLocaleDateString()}</td> 
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEditClick(listing)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => deleteHandler(listing.id)}>
                      Delete
                    </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      {selectedListing && (
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Place Name</Form.Label>
              <Form.Control
                type="text"
                name="placeName"
                value={formData.placeName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Select 
  name="category" 
  value={formData.category || ""}
  onChange={handleInputChange}
>
        <option value="" disabled>Select Category</option> {/* Default Placeholder */}
            {categories.map((cat) => (
    <option key={cat.id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mt-3">
  <Form.Label>Availability</Form.Label>
  <Form.Select
    name="availability"
    value={formData.availability ? "true" : "false"}  // Boolean ko string me convert karega
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        availability: e.target.value === "true", // String se boolean me convert karega
      }))
    }
  >
    <option value="true">Available</option>
    <option value="false">Not Available</option>
  </Form.Select>
</Form.Group>


            <Form.Group className="mt-3">
  <Form.Label>Existing Images</Form.Label>
  <div className="image-preview-container">
    {formData.images.map((img, index) => (
      <div key={index} className="image-wrapper">
        <img src={img} alt={`Preview ${index}`} className="preview-image" />
        <button
          type="button"
          className="delete-btn"
          onClick={() => handleImageDelete(index)}
        >
          ❌
        </button>
      </div>
    ))}
  </div>
</Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Upload New Images (Optional)</Form.Label>
              <Form.Control type="file" multiple onChange={handleImageChange} />
            </Form.Group>

            <Button variant="primary" className="mt-3 w-100" onClick={handleUpdate}>
              Update Listing
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      )}
    </div>
  );
};

export default ManageListings;
