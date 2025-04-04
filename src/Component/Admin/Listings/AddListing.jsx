import { useState,useEffect } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCategories  } from "../../Store/addCategorySlice";
import { addListing } from "../../Store/listingSlice";
import "./AddListing.css";
import { format } from "date-fns";

const AddListing = () => {
  const [placeName, setPlaceName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([]);
  const [pincode, setPinCode] =useState("");
  const [city ,setCity] = useState("");

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  console.log("Categories from Redux:", categories);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const reset =() =>{
        setPlaceName("");
        setPrice("");
        setCategory("");
        setAddress("");
        setCity("");
        setPinCode("");
        setImages([]);
  }

  const date = new Date();
const formattedDate = format(date, "dd/MM/yyyy");
  const submitHandler = async (e) => {
    e.preventDefault();
  
    if (!placeName || !price || !category || !address || !city|| !pincode || images.length === 0) {
      alert("Please fill all fields and upload at least one image.");
      return;
    }
  
    try {
      // ✅ Convert all images to Base64
      const base64Images = await Promise.all(
        images.map(async (file) => await convertToBase64(file))
      );
  
      const newListing = {
        placeName,
        price,
        category,
        address,
        city,
        pincode,
        images: base64Images, 
        createdAt: formattedDate,// ✅ Store Base64 images
      };
  
      const url = "https://staymitra-c6ae4-default-rtdb.firebaseio.com/listings.json";
  
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newListing),
      });
  
      if (response.ok) {
        const resData = await response.json();
        dispatch(addListing({ id: resData.name, ...newListing }));
        e.target.reset();
        // ✅ Clear form after successful submission
        reset();
      } else {
        console.error("❌ Failed to add listing.");
      }
    } catch (error) {
      console.error("🔥 Error:", error);
    }
  };
  
  

  useEffect(() => {
    const fetchCategories = async () => {
      const url = "https://staymitra-c6ae4-default-rtdb.firebaseio.com/categories.json";
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("❌ Failed to fetch categories");

        const data = await response.json();
        if (data) {
          const loadedCategories = Object.keys(data).map((key) => ({
            id: key,
            name: data[key].name,
          }));
          dispatch(setCategories(loadedCategories)); // ✅ Redux me set
        }
      } catch (error) {
        console.error("🔥 Error:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Container className="add-listing">
      <Card>
        <Card.Header className="custom-css">Add New Listing</Card.Header>
        <Card.Body>
          <Form onSubmit={submitHandler} className="listing-form">
            {/* Place Name */}
            <Form.Group className="mb-3">
              <Form.Label>Place Name</Form.Label>
              <Form.Control
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Enter place name"
                required
              />
            </Form.Group>

            {/* Price Per Night */}
            <Form.Group className="mb-3">
              <Form.Label>Price per Night</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                required
              />
            </Form.Group>

            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Address */}
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pin Code</Form.Label>
              <Form.Control
                type="number"
                value={pincode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Enter PinCode"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Upload Images</Form.Label>
  
  {/* Preview Uploaded Images */}
  <div className="image-preview-container">
    {images.map((img, index) => (
      <div key={index} className="image-preview">
        <img src={URL.createObjectURL(img)} alt={`Preview ${index}`} />
        <button type="button" className="remove-btn" onClick={() => handleRemoveImage(index)}>
          ❌
        </button>
      </div>
    ))}
  </div>

  {/* Hidden File Input */}
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => setImages((prev) => [...prev, ...Array.from(e.target.files)])}
    style={{ display: "none" }}
    id="fileInput"
  />
  {/* Add New Image Button */}
  <button type="button" className="btn btn-secondary mt-2" onClick={() => document.getElementById("fileInput").click()}>
    Add New Image
  </button>
</Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="w-100">
              Add Listing
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddListing;
