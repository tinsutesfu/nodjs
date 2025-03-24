import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../styles/shared/layout.css";
import { FaShoppingBag } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import Footer from "./footer";
import useAuth from "../hooks/authuse";
import useLogout from "../hooks/uselogout";

const Layout = ({ search, setSearch }) => {
  const [menu, setmenu] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const searchRef = useRef(null);
  const [searchInput, setSearchInput] = useState(null);
  const { auth, setAuth, updatequantity, cartQuantity } = useAuth();
  const navigate = useNavigate();
  const signout = useLogout();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setSearchInput(searchRef.current);
  }, []);

  const clearSearchInput = () => {
    if (searchInput) {
      searchInput.value = "";
    }
  };

  updatequantity();
  const logout = async () => {
    await signout();
    navigate("/");
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setmenu("home");
    } else if (path === "/amazon") {
      setmenu("menu");
    } else if (location.hash === "#footer") {
      setmenu("contact us");
    }
  }, [location]);

  return (
    <>
      <div className="amazon-header">
        <div className="amazon-header-left-section">
          <Link to="amazon" className="header-link header-logo">
            <img className="amazon-logo" src="images/t-zon.jpg" alt="Amazon Logo" />
          </Link>
          <ul className="navbar-menu desktop-menu">
            <li>
              <Link to="/" className={menu === "home" ? "active" : ""}>
                home
              </Link>
            </li>
            <li>
              <Link to="amazon" className={menu === "menu" ? "active" : ""}>
                menu
              </Link>
            </li>
            <li>
              <a href="#footer" className={menu === "contact us" ? "active" : ""}>
                contact us
              </a>
            </li>
          </ul>
        </div>

        <form
          className="amazon-header-middle-section"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="search-bar"
            id="search"
            type="text"
            placeholder="filter product by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={searchRef}
          />
          <button className="search-button" onClick={clearSearchInput}>
            <img className="search-icon" src="images/icons/search-icon.png" />
          </button>
        </form>

        <div className="amazon-header-right-section">
          <button className="hamburger" onClick={toggleMenu}>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>

          {/* Mobile menu */}
          <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
            <ul className="navbar-menu mobile-navbar-menu">
              <li>
                <Link
                  to="/"
                  className={menu === "home" ? "active" : ""}
                  onClick={() => setIsMenuOpen(false)}
                >
                  home
                </Link>
              </li>
              <li>
                <Link
                  to="amazon"
                  className={menu === "menu" ? "active" : ""}
                  onClick={() => setIsMenuOpen(false)}
                >
                  menu
                </Link>
              </li>
              <li>
                <a
                  href="#footer"
                  className={menu === "contact us" ? "active" : ""}
                  onClick={() => setIsMenuOpen(false)}
                >
                  contact us
                </a>
              </li>
            </ul>

            <div className="mobile-right-section">
              <Link
                className="cart-link header-link"
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
              >
                <img className="cart-icon" src="images/icons/cart-icon.png" />
                <div className="cart-quantity">{cartQuantity}</div>
                <div className="cart-text">Cart</div>
              </Link>

              {!auth?.accessToken ? (
                <Link to="login" onClick={() => setIsMenuOpen(false)}>
                  <span className="sign-text">signin</span>
                </Link>
              ) : (
                <div className="navbar-profile-mobile">
                  <ul className="profile-dropdown-mobile">
                    <li onClick={() => { navigate("/tracking"); setIsMenuOpen(false); }}>
                      <FaShoppingBag className="log" />
                      <p>myorders</p>
                    </li>
                    <li onClick={() => { logout(); setIsMenuOpen(false); }}>
                      <IoLogOutOutline className="log" />
                      <p>logout</p>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Desktop right section */}
          <Link className="cart-link header-link" to="/cart">
            <img className="cart-icon" src="images/icons/cart-icon.png" />
            <div className="cart-quantity">{cartQuantity}</div>
            <div className="cart-text">Cart</div>
          </Link>
          {!auth?.accessToken ? (
            <Link to="login" className="signin-link">
              <span className="sign-text">signin</span>
            </Link>
          ) : (
            <div className="navbar-profile">
              <span className="profile">
              {auth?.user[0].toUpperCase()}
              </span>
              <ul className="profile-dropdown">
                <li onClick={() => navigate("/tracking")}>
                  <FaShoppingBag className="log" />
                  <p>myorders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  <IoLogOutOutline className="log" />
                  <p>logout</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;