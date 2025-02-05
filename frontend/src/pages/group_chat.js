import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const GroupChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, room } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !username || !room) {
      navigate("/login");
    }

    socket.emit("joinRoom", { username, room });

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/chat/messages/${room}`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          setError("Error fetching messages");
        }
      } catch (error) {
        setError("Error fetching messages");
      }
    };

    fetchMessages();

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("typing", ({ username }) => {
      setTypingMessage(`${username} is typing...`);
    });

    socket.on("stopTyping", ({ username }) => {
      setTypingMessage("");
    });

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [navigate, username, room]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/chat/messages/${room}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from_user: username, message: newMessage }),
        }
      );

      if (response.ok) {
        socket.emit("sendMessage", { username, room, message: newMessage });
        setNewMessage("");
        socket.emit("stopTyping", { username, room });
      } else {
        setError("Error sending message");
      }
    } catch (error) {
      setError("Error sending message");
    }
  };

  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      socket.emit("typing", { username, room });
    }

    setTimeout(() => {
      setTyping(false);
      socket.emit("stopTyping", { username, room });
    }, 3000);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Group Chat</h1>
      <div className="card">
        <div className="card-header">
          <h2>Welcome {username}</h2>
          <p>Room: {room}</p>
        </div>
        <div className="card-body">
          <div className="messages mb-3">
            {messages.map((msg, index) => (
              <div key={index} className="message mb-2">
                <strong>{msg.from_user}</strong>: {msg.message}{" "}
                <em>{new Date(msg.date_sent).toLocaleString()}</em>
              </div>
            ))}
          </div>
          {typingMessage && <p className="text-muted">{typingMessage}</p>}
          <form onSubmit={handleSubmit} className="d-flex align-items-center">
            <input
              type="text"
              className="form-control flex-grow-1 mr-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleTyping}
              placeholder="Type your message"
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default GroupChat;