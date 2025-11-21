import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  login,
  logout,
  setIdToken,
  setUserEmail,
} from "./Component/Store/authSlice"; // 
import AppRoutes from "./Component/Routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    const email = localStorage.getItem("email");

    const validateUser = async () => {
      if (token) {
        try {
          const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${import.meta.env.VITE_API_KEY}`,
            { idToken: token }
          );

          const user = response.data.users[0];
           dispatch(
            login({
              token: token,
              email: email,
            })
           )
          dispatch(setIdToken(token));
          dispatch(setUserEmail(user.email));
        } catch (err) {
          console.error("Invalid token", err);
          localStorage.removeItem("token");
          localStorage.removeItem("email");
        }
      }
      setLoader(false);
    };

    validateUser();
  }, [dispatch]);

  return loader ? (
    <p>Please wait...</p>
  ) : (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
