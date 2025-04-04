import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [], // Yeh array categories ko store karega
  },
  reducers: {
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(
        (cat) => cat.id !== action.payload
      );
    },
    setCategories: (state, action) => {
      state.categories = action.payload; // Firebase se fetch kiye hue categories yahan set honge
    },
  },
});

export const { addCategory, deleteCategory, setCategories } = categorySlice.actions; // ✅ Correct Export
export default categorySlice.reducer;
