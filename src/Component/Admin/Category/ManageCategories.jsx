import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, deleteCategory, setCategories } from "../../Store/addCategorySlice"; // ✅ Fix Import
import { Card } from "react-bootstrap";
import './ManageCategories.css';

const ManageCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);

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
        dispatch(setCategories(loadedCategories));  // ✅ Correct Dispatch
      }
    } catch (error) {
      console.error("🔥 Error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategoryHandler = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const url = "https://staymitra-c6ae4-default-rtdb.firebaseio.com/categories.json";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      if (response.ok) {
        const resData = await response.json();
        dispatch(addCategory({ id: resData.name, name: categoryName })); // ✅ Correct Dispatch
        setCategoryName("");
      } else {
        console.error("❌ Failed to add category.");
      }
    } catch (error) {
      console.error("🔥 Error:", error);
    }
  };

  return (
    <Card className="manage-categories">
      <Card.Header className="custom-header">Manage Categories</Card.Header>
      <Card.Body>
        <form onSubmit={addCategoryHandler}>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
          <button type="submit">Add Category</button>
        </form>

        <ul className="categories-list">
          {categories.map((cat) => (
            <li key={cat.id}>
              {cat.name}  
              <button  onClick={() => dispatch(deleteCategory(cat.id))} >Delete</button>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

export default ManageCategories;
