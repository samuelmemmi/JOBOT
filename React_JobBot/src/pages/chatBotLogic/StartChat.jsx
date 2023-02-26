import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";


import config from "./config";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";

import "./startChat.css";

function StartChat() {
  // const [showBot, toggleBot] = useState(false);

  // const saveMessages = (messages, HTMLString) => {
  //   localStorage.setItem('chat_messages', JSON.stringify(messages));
  // };
  return (
    <div className="chatWindow">
      <div style={{ maxWidth: "800px" }}>
      <Chatbot
        config={config}
        actionProvider={ActionProvider}
        messageParser={MessageParser}
        // saveMessages={saveMessages}
      />
      </div>
    </div>
  );
}

export default StartChat;

//  <button onClick={() => toggleBot((prev) => !prev)}>Bot</button>
