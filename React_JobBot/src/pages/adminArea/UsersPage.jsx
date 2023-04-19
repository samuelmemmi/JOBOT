import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsersPage() {
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
    <div>
      <h1>All the users in the database</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <h2>{user.user_name}</h2>
            <p>{user.password}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
