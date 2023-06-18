import {Outlet } from "react-router-dom";

import Login from "./pages/login/Login.jsx";
import { useUser } from "./UserProvider.js";


const ProtectedRoutes = ({updateUsertype}) => {
  const {userType} = useUser();
  return Object.keys(userType).length !== 0 ? <Outlet /> : <Login  updateUsertype={updateUsertype}/>;
};

export default ProtectedRoutes;