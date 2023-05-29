import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import './NavBar.css'

const NavBar = () => {
  const navigate = useNavigate();

  function handleClickHome() {
    if (window.location.pathname.split('/')[0] === 'home') {
      navigate.goBack();
      return;
    }
    navigate("/home");
    // window.location.reload();
}
  return (
    <div className="bg-primary grid md:grid-cols-10">
      <div className="md:col-span-10 py-2">
        <button onClick={handleClickHome}>
          <div className="big-title">
            PRIME BOOK SHOP
          </div>
        </button>
      </div>
    </div>
  );
};

export default NavBar;