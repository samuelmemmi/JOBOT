import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// import Typography from "@mui/material/Typography";

import './UsersPage.css';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    axios.post('/viewusers')
      .then(response => {
        if (response.data.success) {
          setUsers(response.data.users_list);
          setIsLoading(true);
        } else {
          console.log('Error fetching jobs:', response.data.message);
        }
      })
      .catch(error => {
        console.log('Error fetching jobs:', error.message);
      });
  }, []);

  const adminUsers = users.filter(user => user.admin&&(user.admin === 'Yes'));
  const nonAdminUsers = users.filter(user => !user.admin||(user.admin === 'No'));

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  function handleHistory(user){
    var details={userName:user.user_name,password:user.password}
    navigate("/./history", {
      state: details,
    });
  }

  return (
    // <div className="users-page">
    //   <h1 className="title">JOBOT Users</h1>
    //   <ul className="users-list">
    //     {users.map((user, index) => (
    //       <li key={index} className="user-item" id="user-item" onClick={()=>handleHistory(user)}>
    //         <h2 className="user-name">{user.user_name}</h2>
    //         <p className="user-password">{user.password}</p>
    //         Admin:<p className="user-admin">{user.admin}</p>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    (isLoading)?(
      <div>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Admin Users" />
        <Tab label="Non-Admin Users" />
      </Tabs>

      {selectedTab === 0 && (
        <div>
          {/* <Typography variant="h6">Admin Users:</Typography> */}
          <ul>
            {adminUsers.map(user => (
              <li className="user-item" key={user.user_name}>
                <p>username: {user.user_name}</p>
                <p>password: {user.password}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTab === 1 && (
        <div>
          {/* <Typography variant="h6">Non-Admin Users:</Typography> */}
          <ul>
            {nonAdminUsers.map(user => (
              <li className="user-item" id="user-item" key={user.user_name} onClick={() => handleHistory(user)}>
                <p>{user.user_name}</p>
                <p>{user.password}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    ):(<p className="loading">Loading...</p>)
  );
}

export default UsersPage;

