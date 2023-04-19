import React from "react";
import {useState,useEffect} from "react";

import JobCard from "./JobCard.jsx"

import "./Options.css";

const Jobs = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [submitted,setSubmitted]=useState(true);

  useEffect(()=>{setOptions([...props.node.getJobs(),{id:"Nothing fits"}])},[]);

  const handleOptionChange = (event) => {
    const option = event.target.value;
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const isFormValid = () => {
    return Object.values(selectedOptions).some((isChecked) => isChecked)&&submitted;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected Options1: ", selectedOptions);
    // handle submission logic
    setSubmitted(false);
    if(selectedOptions.includes("Nothing fits")){
      props.node.incCountNotFits(props.node.getCountNotFits());
      console.log("count ",props.node.getCountNotFits())
      props.actionProvider.handleJob(props.node,["Nothing fits"]);
    }else if((selectedOptions.length<=2)&&props.node.getCountNotFits()===0){
      props.node.incCountNotFits(props.node.getCountNotFits());
      props.node.setSelectedJobs(props.node.getSelectedJobs().concat(selectedOptions))
      console.log("selected jobs ",props.node.getSelectedJobs())
      props.actionProvider.handleJob(props.node,["Nothing fits"]);
    }else{
      props.actionProvider.handleJob(props.node,selectedOptions);
    }
  };

  const onCardClick = (id) => {
    setSelectedJobId(selectedJobId === id ? null : id);
  };
    
  return(
   <form onSubmit={handleSubmit}>
    {options.map((job,index) => (
      <div key={index}>
          <input
          className="checkbox"
          type="checkbox"
          value={job.id}
          onChange={handleOptionChange}
          disabled={(job.id!=="Nothing fits")&&selectedOptions.includes("Nothing fits")}
          />
          {/* {job.id} */}

          <JobCard
          // key={job.id}
          job={job}
          isSelected={job.id === selectedJobId}
          onCardClick={onCardClick}
          />
      </div>
      ))
    }
    <button type="submit" className="option-button" disabled={!isFormValid()}>Submit</button>
   </form>
  );
};

export default Jobs;
