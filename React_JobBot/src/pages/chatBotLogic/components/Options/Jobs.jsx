import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const Jobs = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitted,setSubmitted]=useState(false);

  useEffect(
    ()=>{
        setOptions(props.node.getJobs())
    }
    ,[]);//maybe props.node_if_options>0

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
    console.log("Selected Options1: ", selectedOptions);
    // handle submission logic
    setSubmitted(true);
    if(selectedOptions.includes("Nothing fits")){
      props.node.incCountNotFits(props.node.getCountNotFits());
      console.log("count ",props.node.getCountNotFits())
      props.actionProvider.handleJob(props.node,["Nothing fits"]);
    }else{
      props.actionProvider.handleJob(props.node,selectedOptions);
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
            className="checkbox"
            type="checkbox"
            value={opt}
            onChange={handleOptionChange}
            disabled={(opt!=="Nothing fits")&&selectedOptions.includes("Nothing fits")} />
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

export default Jobs;
