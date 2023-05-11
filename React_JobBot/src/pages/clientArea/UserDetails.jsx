import React from 'react';
import { useLocation } from 'react-router-dom';

import '../adminArea/UsersPage.css';

function UserDetails() {
    const location = useLocation();
    const clientDetails = location.state;
    console.log(clientDetails)
  return (
    <div>
      <h1 className="title">Registration details</h1>
          <li className="user-item">
            <p className="user-name">user name: {clientDetails.userName}</p>
            <p className="user-password">password: {clientDetails.password}</p>
          </li>
    </div>
  );
}

export default UserDetails;
