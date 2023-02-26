import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const Options = (props) => {
  const [options, setOptions] = useState([]);

  function whichHandler(opt) {
    switch(opt) {
      case "Other":
        return (() => {props.actionProvider.handleOtherField(props.node,opt);});
      default:
        return (() => {props.actionProvider.handleField(props.node,opt);});
    }
  }

  useEffect(()=>{setOptions(props.node.getNextResponse().children[0].options)},[]);//maybe props.node_if_options>0

  var i=1;
  const buttonsMarkup = options.map((opt) =>{
    return (        
      <button key={i++} onClick={whichHandler(opt)} className="option-button">
      {opt}
      </button>);
  },[]);

  return <div className="options-container">{buttonsMarkup}</div>;
};

export default Options;
