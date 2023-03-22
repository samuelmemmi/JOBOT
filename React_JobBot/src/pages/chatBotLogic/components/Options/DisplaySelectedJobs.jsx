import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const DisplaySelectedJobs = (props) => {
  const [options, setOptions] = useState([]);

  useEffect(()=>{
    setOptions(props.node.getSelectedJobs())
  },[]);//maybe props.node_if_options>0


  var i=1;
  const buttonsMarkup = options.map((opt) => (
    <button key={i++} className="option-button">
      {opt}
    </button>
  ),[]);

  return <div className="options-container">{buttonsMarkup}</div>;
};

export default DisplaySelectedJobs;

