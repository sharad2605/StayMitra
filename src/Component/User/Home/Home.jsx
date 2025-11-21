import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../../Store/addCategorySlice";
import Slider from "react-slick";
import { Link } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css"; // optional custom CSS

const Home = () => {
  // 🔹 Local image list for matching
  const categoryImages = [
    {
      name: "Villa",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "Bunglow",
      imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "BoatHouse",
      imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=60",
    },
    {
      name: "Apartment",
      imageUrl: "https://shreebalajiconstruction.com/wp-content/uploads/2023/12/Why-Apartments-Are-Better-than-Houses.png",
    },
    {
      name: "Resort",
      imageUrl: "https://www.cvent.com/sites/default/files/styles/focus_scale_and_crop_800x450/public/image/2024-10/Hyatt-Regency-Grand-Reserve.jpg.webp?itok=j4pqHnns",
    },
    {
      name: "cottage",
      imageUrl: "https://summerstyle.summerwood.com/wp-content/uploads/2022/12/french-g1b451d33d_1280-1200x758.png",
    },
    {
      name: "treehouse",
      imageUrl: "https://www.arch2o.com/wp-content/uploads/2023/09/Arch2O-tree-house-marvels-expert-tips-for-your-dream-hideaway-3.jpg",
    },
  ];

  // 🔹 Redux data
  const categories = useSelector((state) => state.categories.categories);
  const dispatch = useDispatch();

  // 🔹 Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        "https://staymitra-c6ae4-default-rtdb.firebaseio.com/categories.json"
      );
      const data = await response.json();

      const loaded = Object.keys(data).map((key) => ({
        id: key,
        name: data[key].name,
      }));

      dispatch(setCategories(loaded));
    };

    fetchCategories();
  }, [dispatch]);

  // 🔹 Slider config
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };

  // ✅ JSX return
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Explore Categories</h2>

      {categories.length > 0 ? (
        <Slider {...settings}>
          {categories.map((category) => {
            // 🔍 Find image matching this category name
            const matched = categoryImages.find(
              (img) => img.name.toLowerCase() === category.name.toLowerCase()
            );

            return (
              <div key={category.id} className="p-3">
                <Link to={`/category/${category.name}`} className="text-decoration-none">
                  <div
                    className="shadow-sm rounded"
                    style={{
                      height: "280px",
                      background: "#f9f9f9",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    {/* 🖼 Image */}
                    {matched ? (
                      <img
                        src={matched.imageUrl}
                        alt={category.name}
                        style={{
                          width: "100%",
                          height: "70%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "70%",
                          background: "#ccc",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <p className="text-muted">No Image</p>
                      </div>
                    )}

                    {/* 📄 Name */}
                    <div
                      style={{
                        height: "30%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <h5 className="fw-bold text-dark mb-0">{category.name}</h5>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </Slider>
      ) : (
        <p className="text-center">Loading categories...</p>
      )}
    </div>
  );
};

export default Home;
