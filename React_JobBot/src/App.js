import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import StartChat from "./pages/chatBotLogic/StartChat.jsx"
import ViewChatFlow from "./pages/chatBotLogic/viewChatFlow.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/startChat" element={<StartChat />}/>
      <Route path="/viewChatFlow" element={<ViewChatFlow />}/>
    </Routes>
  );
}

export default App;
