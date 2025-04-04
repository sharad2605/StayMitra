import React, { useState } from "react";
import { Button } from "react-bootstrap"; 
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Authform = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const reset = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const API_KEY = import.meta.env.VITE_API_KEY;
    const url = isLogin
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      console.log(isLogin ? "User logged in!" : "User signed up!");

      dispatch(authActions.login({ 
        token: data.idToken, 
        email: data.email
      }));
      

      localStorage.setItem("isLoggedIn", "true"); // Fixing refresh logout issue

      if (!isLogin) {
        alert("Account created successfully, Now Login to continue");
      }

      reset();
      if (isLogin) navigate("/");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h2 className="text-center">{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleAuth}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" variant="primary" className="w-100">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <br />
        {/* {isLogin && (
          <button className="btn btn-link text-danger" onClick={() => navigate("/forget-password")}>
            Forget Password?
          </button>
        )} */}

        <p className="text-center mt-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="btn btn-link" onClick={() => setIsLogin((prev) => !prev)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Authform;
