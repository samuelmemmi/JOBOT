import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post('/logout')
      .then(response => {
        if (response.data.success) {
          setLoggedOut(true);
        }
      })
      .catch(error => {
        // Handle error (e.g. display error message)
      });
  };

  if (loggedOut) {
    navigate("/.");
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        background: '#1775ee',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer'
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
