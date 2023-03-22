import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const EmailDisplay = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitted,setSubmitted]=useState(false);

  useEffect(()=>{
    console.log("which node? ",props.node.getNextResponse())
    setOptions(props.node.getNextResponse().options)
  },[]);//maybe props.node_if_options>0


  const handleOptionChange = (event) => {
    const option = event.target.value;
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected Options: ", selectedOptions);
    // handle submission logic
    setSubmitted(true);
    props.actionProvider.handleEmailDisplay(props.node,selectedOptions);
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {options.map((opt,index) =>{
          return(
          <label key={index}>
            <br />
            <input
            type="checkbox"
            value={opt}
            onChange={handleOptionChange} />
            {opt}
          </label>);
        },[])
        }
      </label>
      <br />
      <button type="submit" className="option-button" disabled={submitted}>Submit</button>
    </form>
  );
};

export default EmailDisplay;

