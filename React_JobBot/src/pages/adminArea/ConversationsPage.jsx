import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './ConversationsPage.css';

function ConversationsPage() {
  const location = useLocation();
  const clientDetails = location.state;
  console.log(clientDetails);

  const [historyItem, setHistoryItem] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    axios
      .post('/viewhistory', { clientDetails })
      .then(response => {
        setHistoryItem(response.data.unique_listt);
      })
      .catch(error => {
        console.error('Error fetching history:', error);
      });
  };

  return (
    <div className="conversations-page">
      <h2>History Item:</h2>
      {historyItem ? (
        <div>
          {historyItem.map((item, index) => (
            <div key={index} className="message-item">
              {Object.keys(item).map((key, subIndex) => (
                <div key={subIndex} className="message">
                  <span className="role">{key}:</span>
                  <span className="content">{item[key]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No history item found.</p>
      )}
    </div>
  );
}

export default ConversationsPage;
