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
    <div>
      <h1>Join Chat</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="room">Room</label>
        <select
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
        <button type="submit">Join</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default JoinChat;