import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import JoinChat from "./pages/join_chat";
import GroupChat from "./pages/group_chat";
import PrivateChat from "./pages/private_chat";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/joinchat" element={<JoinChat />} />
        <Route path="/groupchat" element={<GroupChat />} />
        <Route path="/privatechat" element={<PrivateChat />} />
        <Route path="/" element={<JoinChat />} />
      </Routes>
    </Router>
  );
};

export default App;
