import React from "react";
import {useState,useEffect} from "react";

import JobCard from "./JobCard.jsx"

const DisplaySelectedJobs = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(()=>{
    var selectedJobsDetails=[];
    //????????ואז לאחד את 2 רשימות העבודות
    props.node.getJobs().map((job)=>{
      if(props.node.getSelectedJobs().includes(job.id.toString())){
        selectedJobsDetails.push(job);
      }
    })
    setOptions(selectedJobsDetails)
  },[]);

  const onCardClick = (id) => {
    setSelectedJobId(selectedJobId === id ? null : id);
  };

  const buttonsMarkup = options.map((job) => (
    <JobCard
    key={job.id}
    job={job}
    isSelected={job.id === selectedJobId}
    onCardClick={onCardClick}
    />
  ),[]);


  return <div>{buttonsMarkup}</div>;
};

export default DisplaySelectedJobs;

