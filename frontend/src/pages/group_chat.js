import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GroupChat = () => {
    const location = useLocation();
    const { username, room } = location.state;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        // Fetch past messages when the component mounts
        const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/chat/messages/${room}`);
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
    }, [room]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
        const response = await fetch(`http://localhost:5000/api/chat/messages/${room}`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ from_user: username, message: newMessage }),
        });

        if (response.ok) {
            setMessages([...messages, { from_user: username, message: newMessage, date_sent: new Date() }]);
            setNewMessage("");
        } else {
            setError("Error sending message");
        }
        } catch (error) {
        setError("Error sending message");
        }
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
            <form onSubmit={handleSubmit} className="d-flex align-items-center">
                <input
                type="text"
                className="form-control mr-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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