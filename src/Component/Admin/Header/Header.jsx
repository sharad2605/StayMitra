import { Navbar, Container, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminAuthActions } from "../../Store/adminAuthSlice";

const Header = () => {
  const dispatch =useDispatch();
  const navigate =useNavigate();
  
  const handleLogout = () => {
    dispatch(adminAuthActions.logout()); // 🔹 Redux se logout
    localStorage.removeItem("adminToken"); // Specific key delete karein
    localStorage.clear();
    navigate("/admin/login"); // 🔹 Redirect to Login Page
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/admin/dashboard">Admin Panel</Navbar.Brand>
        <Nav className="ms-auto">
          {/* <Nav.Link href="/admin/settings">Settings</Nav.Link> */}
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
