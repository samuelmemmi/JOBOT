import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './JobsPage.css';
import starImage from './star.avif';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LaunchIcon from '@mui/icons-material/Launch';
import {CollapsableCard} from "./CollapsableCard.jsx"
import {CardsTable} from "./CardsTable.jsx"
import { blue } from '@mui/material/colors';
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';

import ErrorMessages from "../chatBotLogic/components/Options/ErrorMessages"


function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [jobTitleSearchQuery, setJobTitleSearchQuery] = useState('');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isServerDown, setIsServerDown] = useState(false);



  useEffect(() => {
    setIsLoading(true)
    axios.post('/viewjobs')
      .then(response => {
        if (response.data.success) {
          setJobs(response.data.total_list);
          setIsLoading(false);
        } else {
          console.log('Error fetching jobs:', response.data.message);
        }
      })
      .catch(error => {
        setIsServerDown(true)
        createRoot(document.getElementById("jobsfail")).render(<ErrorMessages />);
        console.log('Error fetching jobs:', error.message);
      });
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.company.toLowerCase().includes(companySearchQuery.toLowerCase()) &&
    job.job.toLowerCase().includes(jobTitleSearchQuery.toLowerCase()) &&
    job.city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  function collapsed(job){
    return (<div style={{textAlign:"center"}} >
    {job.rating&&<p className="job-rating"><span><img className="star" src={starImage} alt="Star" /></span> {job.rating}</p>}
    {job.date&&<p className="job-date"><AccessTimeIcon color="primary" fontSize=""/>{"  "+job.date}</p>}
    {job.link&&<p className="job-link">
      <a href={job.link} target="_blank" rel="noopener noreferrer">
        <LaunchIcon color="primary"/>
        {"     "+`${job.link.slice(0, 30)}...`}
      </a>
    </p>}
    <p className="job-description" style={{margin: "0 2rem 2rem"}}>{job.description}</p>
    </div>)
  }

  const dataAsCards = filteredJobs.map((job, index) => {
    return {
      content: <div style={{textAlign:"center"}}>
                    <h2 className="job-title">{job.job}</h2>
                    <p>{job.company}</p>
                    <p className="job-location">{job.city}</p></div>,
      collapsableContent: collapsed(job)
    }
  })
//component={'span'}
  return (
    <div>
      <Typography variant='h4' align="center" m={2} fontFamily="Serif">JOBOT Jobs</Typography>
      {!isServerDown?(
        isLoading ? <div className="loading"><CircularProgress /></div>:(
          <div>
          <div className="w-50 d-flex mx-auto align-items-center justify-cotnent-center">
                <input
                  type="text"
                  placeholder="Search jobs by company name"
                  value={companySearchQuery}
                  onChange={event => setCompanySearchQuery(event.target.value)}
                  className="search-input"
                />
                <input
                  type="text"
                  placeholder="Search jobs by title"
                  value={jobTitleSearchQuery}
                  onChange={event => setJobTitleSearchQuery(event.target.value)}
                  className="search-input"
                />
                <input
                  type="text"
                  placeholder="Search jobs by city"
                  value={citySearchQuery}
                  onChange={event => setCitySearchQuery(event.target.value)}
                  className="search-input"
                />
          </div>
          <div>
          {filteredJobs.length === 0 ? (
            <p className="no-jobs-found" style={{display: 'flex',justifyContent: 'center',alignItems: 'center',marginTop: "2rem"}}>No jobs found.</p>
          ) : (
            <CardsTable data={dataAsCards} />
          )}
          </div>
        </div>)
      ):(
        <div id="jobsfail" style={{display: 'flex',justifyContent: 'center',alignItems: 'center',marginTop: "2rem"}}></div>
      )}

    </div>

  );
}

export default JobsPage;

