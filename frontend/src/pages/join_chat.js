import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const JoinChat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const rooms = ["devops", "cloud computing", "covid19", "sports", "nodeJS"];

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            // Token is expired
            localStorage.clear();
            navigate("/login");
          } else {
            const response = await fetch("http://localhost:5000/api/users/me", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              setUsername(data.username);
            } else {
              setError("Failed to fetch username");
            }
          }
        } catch (error) {
          setError("Failed to fetch username");
        }
      } else {
        navigate("/login");
      }
    };

    fetchUsername();
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username || !room) {
      setError("Please enter a username and select a room.");
      return;
    }
    setError("");
    // Redirect to the group chat room
    navigate("/groupchat", { state: { username, room } });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Join Chat</h1>
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
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="room">Room</label>
          <select
            className="form-control"
            id="room"
            name="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            <option value="">Select a room</option>
            {rooms.map((room, index) => (
              <option key={index} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Join
        </button>
      </form>
      {error && <p className="text-danger mt-2 text-center">{error}</p>}
    </div>
  );
};

export default JoinChat;