import React, { useEffect, useState } from 'react';
import './Header.css'
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import TabBar from '../TabBar/TabBar';


const Header = () => {
    const navigate = useNavigate();
    const [isLoginPage, setIsLoginPage] = useState(false)
    const location = useLocation();

    function handleClickLogout() {
        localStorage.setItem("access", "");
        localStorage.setItem("username", "");
        localStorage.setItem("user_id", "");
        navigate("/home");
        // window.location.reload();
    }

    useEffect(() => {
        setIsLoginPage(location.pathname === '/login');
      }, [location]);

    return (
    <header className="relative text-center py-4 text-white text-sm">
      {!isLoginPage && (localStorage.getItem('user_id') !== "") && <TabBar />}
        {!isLoginPage
        && <div className="absolute right-0 top-0 pb-8">
          {localStorage.getItem("access") === "" ? (
            <>
              <Link to="/login">
                <button 
                  className="nav-login-logout"
                >
                  Login
                </button>
              </Link>
              <Link to="/login?register=true">
                <button 
                  className="nav-login-logout"
                >
                  Register
                </button>
              </Link>
            </>
          ) : (
            <div>
              <div className="inline mr-2">Hello, {localStorage.getItem("username")}</div>
              <button className="nav-login-logout" onClick={handleClickLogout}>
                LogOut
              </button>
            </div>
          )}
      </div>}
    </header>
  );
};

export default Header;
