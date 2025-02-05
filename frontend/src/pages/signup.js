import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/styles.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const response = await fetch("http://localhost:5000/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, firstname, lastname, password }),
    });

    if (response.ok) {
      setSuccess("Signup successful!");
    } else {
      const errorMessage = await response.text();
      setError(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Signup</h1>
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
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstname"
            name="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastname"
            name="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
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
          Signup
        </button>
        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
      {error && <p className="text-danger mt-2 text-center">{error}</p>}
      {success && <p className="text-success mt-2 text-center">{success}</p>}
    </div>
  );
};

export default Signup;