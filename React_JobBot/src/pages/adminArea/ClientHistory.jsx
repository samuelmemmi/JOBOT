import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function ClientHistory() {
  const location = useLocation();
  const clientDetails = location.state;
  console.log(clientDetails);

  return (
    <div>
      <h1>History By Fields</h1>
      <nav>
        Tabs of:
        <ul>
          <li>
            <Link to={{ pathname: '/conversations', state: { clientDetails } }}>
              Conversations
            </Link>
          </li>
          <li>
            <Link to={{ pathname: '/selectedJobs', state: { clientDetails } }}>
              Selected/Offered jobs
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ClientHistory;
