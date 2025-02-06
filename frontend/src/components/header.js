import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-light">
      <div>
        <h4>Chat App</h4><span>by Conor Le - 101411302</span>
      </div>
      {!isAuthPage && (
        <button onClick={handleLogout} className="btn btn-danger">
          Log Out
        </button>
      )}
    </header>
  );
};

export default Header;
