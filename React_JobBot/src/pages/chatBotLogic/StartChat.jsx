import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { useLocation } from 'react-router-dom';

import config from "./config";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import dec_tree from "./getFlowText.js"
// import Header from "../Header.jsx";

import "./startChat.css";

function StartChat() {
  const location = useLocation();
  const clientDetails = location.state;
  console.log(clientDetails)
  dec_tree.setRegistrationDetails(clientDetails)

  // const chatwindowconfig ={
  //   width: "350px",
  //   height: "500px",
  //   floating: true,
  // };

  const validator = (input) => {
    if((dec_tree.getIsFeedback()===1)||(dec_tree.getIsRequirements()===1)){
      if(input.length > 0){
        return true
      }
      return false;
    }
    return false;
  }

  return (
    <>
    {/* <Header/> */}
    <div className="chatWindow">
      <div style={{ maxWidth: "800px" }}>
      <Chatbot
        config={config}
        actionProvider={ActionProvider}
        messageParser={MessageParser}
        validator={validator}
        // {...chatwindowconfig}
      />
      </div>
    </div>
    </>
  );
}

export default StartChat;

