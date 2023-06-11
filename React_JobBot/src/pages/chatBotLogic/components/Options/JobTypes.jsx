import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const JobTypes = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Full_time");
  const [submitted,setSubmitted]=useState(false);

  useEffect(()=>{setOptions(props.node.getNextResponse().options)},[]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle submission logic
    setSubmitted(true);
    props.actionProvider.handleJobType(props.node,[selectedOption])
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="listOptions">
        {options.map((opt,index) =>{
          return(
          <label key={index}>
            {/* <br /> */}
            <input
            type="radio"
            value={opt}
            name="jobType"
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

export default JobTypes;

