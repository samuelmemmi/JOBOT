import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const FieldOptions = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Other");
  const [submitted,setSubmitted]=useState(false);

  useEffect(()=>{setOptions(props.node.getNextResponse().children[0].options)},[]);//maybe props.node_if_options>0

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected Options radio: ", selectedOption);
    // handle submission logic
    setSubmitted(true);
    switch(selectedOption) {
      case "Other":
        props.actionProvider.handleOtherField(props.node,selectedOption);
        break;
      default:
        props.actionProvider.handleField(props.node,selectedOption);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {options.map((opt,index) =>{
          return(
          <label key={index}>
            <br />
            <input
            type="radio"
            value={opt}
            name="field"
            checked={selectedOption === opt}
            onChange={handleOptionChange} 
            />
            {opt}
          </label>);
        },[])
        }
      </label>
      <br />
      <button type="submit" className="option-button" disabled={submitted}>Submit</button>
    </form>);
};

export default FieldOptions;
