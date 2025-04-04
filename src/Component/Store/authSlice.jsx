import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token") || null;
const email = localStorage.getItem("email") || null;
const name = localStorage.getItem("name") || null;
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; 

const initialAuthState = {    
    token: token,
    isLoggedIn: isLoggedIn,
    email: email,
    name: name,
};

const authSlice = createSlice({
    name: "authentication",
    initialState: initialAuthState,    
    reducers: {
        login(state, action) {
            const { token, email } = action.payload;
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            localStorage.setItem("name", name);
            localStorage.setItem("isLoggedIn", "true"); // Fix refresh logout issue

            state.token = token;
            state.isLoggedIn = true;
            state.email = email; 
            state.name = name; 
        },
        logout(state) {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("name");

            state.token = null;
            state.isLoggedIn = false;
            state.email = null;
            state.name = null;
        },
    },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
