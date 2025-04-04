import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { setCategories } from "../../Store/addCategorySlice"; 
import { Link } from "react-router-dom";
import "./Home.css"

const Home = () => {
  const categories = useSelector((state) => state.categories.categories);
  const dispatch = useDispatch();

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
  }, [dispatch]);

  // **Slider Settings**
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Ek baar me kitne dikhane hain
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="container mt-5 custom-css">
      <h2 className="text-center mb-4">Explore Categories</h2>

      {categories.length > 0 ? (
        <Slider {...settings}>
          {categories.map((category) => (
            <div key={category.id} className="p-5">
              <Link
                to={`/category/${category.name}`} // ✅ Category Click karne pe naye page pe le jane ke liye
                className="text-decoration-none"
              >
                <div className="category-card text-center p-3 shadow-sm rounded custom-css">
                  <h5 className="fw-bold">{category.name}</h5>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center">Loading categories...</p>
      )}
    </div>
  );
};

export default Home;
