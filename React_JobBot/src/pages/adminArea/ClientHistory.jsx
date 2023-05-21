import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ClientHistory() {
  const location = useLocation();
  const clientDetails = location.state;
  console.log(clientDetails);

  const navigate = useNavigate();

  function handleNavigate(pathname) {
    navigate(pathname, { state: { clientDetails } });
  }

  return (
    <div>
      <h1>History By Fields</h1>
      <nav>
        Tabs of:
        <ul>
          <li>
            <button onClick={() => handleNavigate('/./conversations')}>Conversations</button>
          </li>
          <li>
            <button onClick={() => handleNavigate('/./offeredJobs')}>Offered jobs</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ClientHistory;
