import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import './UsersPage.css';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();


  useEffect(() => {
    setIsLoading(true)
    axios.post('/viewusers')
      .then(response => {
        if (response.data.success) {
          setUsers(response.data.users_list);
          setIsLoading(false);
        } else {
          console.log('Error fetching jobs:', response.data.message);
        }
      })
      .catch(error => {
        console.log('Error fetching jobs:', error.message);
      });
  }, []);

  function handleHistory(user){
    var details={userName:user.user_name,password:user.password}
    navigate("/./history", {
      state: details,
    });
  }

  return (
    <div className="users-page">
      <h1 className="title">JOBOT Users</h1>
      <ul className="users-list">
        {users.map((user, index) => (
          <li key={index} className="user-item" id="user-item" onClick={()=>handleHistory(user)}>
            <h2 className="user-name">{user.user_name}</h2>
            <p className="user-password">{user.password}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
