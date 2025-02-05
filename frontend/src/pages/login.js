import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/joinchat");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Handle successful login
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/joinchat", { state: { username } });
    } else {
      // Handle login error
      const errorMessage = await response.json();
      setError(errorMessage.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Login
        </button>
        <p className="text-center mt-2">
          Or <Link to="/signup">Signup here</Link>
        </p>
      </form>
      {error && <p className="text-danger mt-2 text-center">{error}</p>}
    </div>
  );
};

export default Login;