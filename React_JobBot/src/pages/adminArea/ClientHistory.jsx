import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function ClientHistory() {
    const location = useLocation();
    const clientDetails = location.state;
    console.log(clientDetails)
  return (
    <div>
    <h1>History By Fields</h1>
    <nav>
        Tabs of:
        <ul>
            <li>
                <p>Conversations </p>
            </li>
            <li>
                <p>Selected/Offered jobs </p>
            </li>
        </ul>
    </nav>
    </div>
  );
}

export default ClientHistory;
