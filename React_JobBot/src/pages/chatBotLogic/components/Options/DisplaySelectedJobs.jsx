import React from "react";
import {useState,useEffect} from "react";

import JobCard from "./JobCard.jsx"

const DisplaySelectedJobs = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(()=>{
    var selectedJobsDetails=[];
    var jobs=props.node.getSavedInDB()["displayed jobs"];
    var selectedJobs=props.node.getSavedInDB()["selected jobs"];
    jobs.map((job)=>{
      if(selectedJobs.includes(job._id)){//#מתוך סך העבודות כולם הצג את כל העבודות שנבחרו בכל השלבים
        selectedJobsDetails.push(job);
      }
    })
    setOptions(selectedJobsDetails)
  },[]);

  const onCardClick = (id) => {
    setSelectedJobId(selectedJobId === id ? null : id);
  };

  const buttonsMarkup = options.map((job,index) => (
    <JobCard
    key={index}
    job={job}
    isSelected={job._id === selectedJobId}
    onCardClick={onCardClick}
    />
  ),[]);


  return <div>{buttonsMarkup}</div>;
};

export default DisplaySelectedJobs;

