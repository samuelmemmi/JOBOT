import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const Approval = (props) => {
  const [options, setOptions] = useState([]);

  function whichHandler(opt) {
    return (() => {props.actionProvider.handleApproval(props.node,opt);});
  }

  useEffect(()=>{setOptions(props.node.getNextResponse().options)},[]);//maybe props.node_if_options>0

  var i=1;
  const buttonsMarkup = options.map((opt) => (
    <button key={i++} onClick={whichHandler(opt)} className="option-button">
      {opt}
    </button>
  ),[]);

  return <div className="options-container">{buttonsMarkup}</div>;
};

export default Approval;

