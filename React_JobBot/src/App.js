import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import StartChat from "./pages/chatBotLogic/StartChat.jsx"
import ViewChatFlow from "./pages/adminArea/viewChatFlow.jsx";
import HomeClient from "./pages/clientArea/HomeClient.jsx";
import HomeAdmin from "./pages/adminArea/HomeAdmin.jsx";
import JobsPage from "./pages/adminArea/JobsPage.jsx";
import UsersPage from "./pages/adminArea/UsersPage.jsx";
import Logout from "./pages/logout/Logout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/startChat" element={<StartChat />}/>
      <Route path="/viewChatFlow" element={<ViewChatFlow />}/>
      <Route path="/homePage" element={<HomeClient />}/>
      <Route path="/homePageAdmin" element={<HomeAdmin />}/>
      <Route path="/jobs" element={<JobsPage />}/>
      <Route path="/users" element={<UsersPage />}/>
      <Route path="/logout" element={<Logout />}/>
    </Routes>
  );
}

export default App;