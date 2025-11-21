import Header from '../Header/Header';
import Sidebar from '../Sidebar/sidebar';
import { Outlet, Navigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from 'react-redux';

const AdminLayout = () => {
  const isAdminAuthenticated = useSelector(state => state.adminAuth.isAuthenticated);

  // ✅ Redirect to login if admin is not authenticated
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <>
      <Header />
      <Container fluid>
        <Row>
          <Col md={3}>
            <Sidebar />
          </Col>
          <Col md={9}>
            <Outlet /> {/* Yahan Admin ka content dynamically render hoga */}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminLayout;
