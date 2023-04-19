import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import {useState} from "react";//

import config from "./config";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import dec_tree from "./getFlowText.js"


import "./startChat.css";



function StartChat() {
  const [chatbotState, setChatbotState] = useState(dec_tree);

  // const [showBot, toggleBot] = useState(false);

  // const saveMessages = (messages, HTMLString) => {
  //   localStorage.setItem('chat_messages', JSON.stringify(messages));
  // };

    // Define a function to update the chatbot state
    const handleStateChange = (state) => {
      setChatbotState(state);
    };

  return (
    <div className="chatWindow">
      <div style={{ maxWidth: "800px" }}>
      <Chatbot
        config={config}
        actionProvider={ActionProvider}
        messageParser={MessageParser}
        state={chatbotState}//
        onStateChange={handleStateChange}//
        // saveMessages={saveMessages}
      />
      </div>
    </div>
  );
}

export default StartChat;

//  <button onClick={() => toggleBot((prev) => !prev)}>Bot</button>


//
// // Define a function to export the chatbot state
// function exportChatbotState(state) {
//   const serializedState = JSON.stringify(state);
//   // Do something with the serialized state, e.g. save it to a file or send it to a server
// }

// // Call the exportChatbotState function to export the chatbot state
// exportChatbotState(chatbotState);
