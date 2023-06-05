import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersPage.css';

function UsersPage1() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.post('/viewusers')
      .then(response => {
        if (response.data.success) {
          setUsers(response.data.users_list);
        } else {
          console.log('Error fetching jobs:', response.data.message);
        }
      })
      .catch(error => {
        console.log('Error fetching jobs:', error.message);
      });
  }, []);

  return (
    <div className="users-page">
      <h1 className="title">JOBOT Users</h1>
      <ul className="users-list">
        {users.map((user, index) => (
          <li key={index} className="user-item">
            <h2 className="user-name">{user.user_name}</h2>
            <p className="user-password">{user.password}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage1;
