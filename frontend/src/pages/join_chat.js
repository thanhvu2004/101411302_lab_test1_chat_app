import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinChat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const rooms = ["devops", "cloud computing", "covid19", "sports", "nodeJS"];

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