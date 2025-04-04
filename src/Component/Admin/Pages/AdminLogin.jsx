import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { adminAuthActions } from "../../Store/adminAuthSlice";
import { Container, Form, Button, Card } from "react-bootstrap";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdminAuthenticated = useSelector(state => state.AdminAuth.isAuthenticated); // ✅ Fix: "adminAuth" ka sahi naam

  // ✅ Fix: Agar already logged in hai to dashboard pe bhej do
  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${import.meta.env.VITE_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        }),
      });
      const data = await response.json();

      if (response.ok) {
        dispatch(adminAuthActions.login(data.idToken)); // ✅ Save token in Redux
        navigate("/admin/dashboard");
        console.log("token:-", data.idToken);
      } else {
        alert("Invalid credentials: " + data.error.message);
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login request failed!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Admin Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminLogin;
