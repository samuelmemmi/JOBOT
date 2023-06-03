import React from 'react';
import { useLocation } from 'react-router-dom';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

import '../adminArea/UsersPage.css';
import { useUser } from "../../UserProvider.js"



function UserDetails() {
    // const location = useLocation();
    // const clientDetails = location.state;
    // console.log(clientDetails);
    const { userType } = useUser()
    const clientDetails = userType.details
    console.log(clientDetails)
    console.log(clientDetails)
  return (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center mx-auto mt-5 pt-5">
      {/* <h1 className="title">Registration details</h1> */}
      <ManageAccountsOutlinedIcon style={{fontSize: "100px"}} color="primary" />
      <li className="user-item w-25">
        <p className="user-name">user name: {clientDetails.userName}</p>
        <p className="user-password">password: {clientDetails.password}</p>
      </li>
    </div>
  );
}

export default UserDetails;
