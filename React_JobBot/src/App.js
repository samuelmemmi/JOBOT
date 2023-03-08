import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import StartChat from "./pages/chatBotLogic/StartChat.jsx"
import ViewChatFlow from "./pages/adminArea/viewChatFlow.jsx";
import HomeClient from "./pages/clientArea/HomeClient.jsx";
import HomeAdmin from "./pages/adminArea/HomeAdmin.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/startChat" element={<StartChat />}/>
      <Route path="/viewChatFlow" element={<ViewChatFlow />}/>
      <Route path="/homePage" element={<HomeClient />}/>
      <Route path="/homePageAdmin" element={<HomeAdmin />}/>
    </Routes>
  );
}

export default App;
