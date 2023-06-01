import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
// import './ConversationsPage.css';
// import ChatMsg from '@mui-treasury/components/chatMsg/ChatMsg';
import CircularProgress from '@mui/material/CircularProgress';

function ConversationsPage(props) {
  // const location = useLocation();
  // const clientDetails = location.state;
  const clientDetails=props.propValue
  console.log(clientDetails);

  const [historyItem, setHistoryItem] = useState(null);
  const [result,setResult] = useState(false)

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    axios.post('/viewhistory', { clientDetails })
      .then(response => {
        console.log("david ",response.data.content)
        setHistoryItem(response.data.content);
        setResult(true)
      })
      .catch(error => {
        console.error('Error fetching history:', error);
      });
  };

  return (
    <div className="conversations-page">
      {(!result) ? (
        <div className="loading"><CircularProgress /></div>):(
      (historyItem&&historyItem.length > 0)?(
      <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '100vh',
      }}>
        <div>
          {historyItem.map((messageObj, index) => {
            const sender = Object.keys(messageObj)[0];
            const messages = messageObj[sender];
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: sender === 'bot' ? 'flex-start' : 'flex-end',
                  marginBottom: '1rem',
                  marginTop: "2rem"
                }}
              >
                <div
                  style={{
                    background: sender === 'bot' ? '#f5f5f5' : '#007bff',
                    color: sender === 'bot' ? '#000' : '#fff',
                    borderRadius: sender === 'bot' ? '15px 15px 15px 5px' : '15px 15px 5px 15px',
                    padding: '10px',
                    maxWidth: '70%',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {messages.map((message, idx) => (
                    <p key={idx}>{message}</p>
                  ))}
                </div>
              </div>
            );
            })
          }
        </div>
      </div>):(<p style={{display: 'flex',justifyContent: 'center',alignItems: 'center',marginTop: "2rem"}}>No history item found.</p>)
      )
      }
    </div>
  );
}

export default ConversationsPage;
