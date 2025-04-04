import Header from "../../User/Header/Header";
import Footer from "../../User/Footer/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <Header />
      <Outlet /> {/* Yahan User ka content dynamically render hoga */}
      <Footer />
    </>
  );
};

export default UserLayout;
