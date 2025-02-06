import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";
import Header from "../components/header";

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
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token is expired
        localStorage.clear();
        navigate("/login");
      }
    } else {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours > 24) {
      return date.toLocaleString();
    } else if (diffInHours >= 1) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      const diffInMinutes = diffInMs / (1000 * 60);
      return `${Math.floor(diffInMinutes)} minutes ago`;
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h1 className="text-center">Group Chat</h1>
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <div>
              <h2>Welcome {username}</h2>
              <p>Room: {room}</p>
            </div>
            <div>
              <button onClick={() => navigate("/")} className="btn btn-danger">
                Leave Room
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="messages mb-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="message mb-2 d-flex justify-content-between"
                >
                  <div>
                    <strong>{msg.from_user || msg.user}</strong>:{" "}
                    {msg.message || msg.text}
                  </div>
                  <em className="text-muted">{formatDate(msg.date_sent)}</em>
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
    </div>
  );
};

export default GroupChat;