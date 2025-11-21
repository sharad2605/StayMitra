  import { Nav, Navbar, Container,Dropdown,NavLink } from "react-bootstrap";
  import { Link } from "react-router-dom";
  import { useDispatch } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { useSelector } from "react-redux";
  import { authActions } from "../../Store/authSlice";
  import './Header.css'; // For custom styling if needed

  const Header = () => {
    // const token = useSelector((state) => state.auth.token);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const email = useSelector((state) => state.auth.email);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const handleLogout  =() =>{
      dispatch(authActions.logout());
      localStorage.removeItem("token");
  localStorage.removeItem("email");
   localStorage.removeItem("isLoggedIn");
      navigate("/");
    }
    return (
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand href="/">StayMitra</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <form>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search Place"
                  className="search-bar"
                />
              </form>
            </Nav>
            <Nav>
              {/* <Nav.Link href="#cart">
                <i className="bi bi-cart4"></i>{/* Cart Icon */}
              {/* </Nav.Link> */} 

            {isAuthenticated  && <Link to="/my-orders" className="nav-link">My Orders</Link>}

              <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-basic" className="text-white d-flex align-items-center ">
                  <i className="bi bi-person-circle" style={{ fontSize: "24px" }}></i>
                  {isAuthenticated  && <span className="ms-2">User</span>}  {/* Avatar ke side me "User" */}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  {!isAuthenticated  ? (
                    <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
                  ) : (
                    <>
                      <Dropdown.Item>👤 Welcome,User</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </>
                  )}
                  </Dropdown.Menu >
                  </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };

  export default Header;
