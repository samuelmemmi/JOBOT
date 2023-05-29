import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './OfferedJobs.css';
import starImage from './star.avif';

function OfferedJobs(props) {
  // const location = useLocation();
  // const clientDetails = location.state;
  const state=props.propValue
  const clientDetails = state.clientDetails;
  console.log(clientDetails);

  const [jobs, setJobs] = useState([]);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [jobTitleSearchQuery, setJobTitleSearchQuery] = useState('');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchjobs();
  }, []);

  const fetchjobs = () => {
    if(state.jobs=="displayed"){
      axios.post('/offeredjobs', { clientDetails })
      .then(response => {
        setJobs(response.data.jobs);
        setIsLoading(true)
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
      });
    }else{
      axios.post('/selectededjobs', { clientDetails })
      .then(response => {
        setJobs(response.data.jobs);
        setIsLoading(true)
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
      });
    }

  };

  const filteredJobs = jobs.filter(job =>
    job.company.toLowerCase().includes(companySearchQuery.toLowerCase()) &&
    job.job.toLowerCase().includes(jobTitleSearchQuery.toLowerCase()) &&
    job.city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <div>
      {/* <h1 className="title">The Offered Jobs for the client</h1> */}
      {!isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="jobs-page">
          <div className="search-container">
            {/* Search input components */}
          </div>
          {filteredJobs&&filteredJobs.length > 0 ? (
            <ul className="jobs-list">
            {filteredJobs&&filteredJobs.map((job, index) => (
              <li key={index} className="job-item">
                <h2 className="company-name">{job.company}</h2>
                <p className="job-title">{job.job}</p>
                <p className="job-location">{job.city}</p>
                {job.rating&&<p className="job-rating"><span><img className="star" src={starImage} alt="Star" /></span> {job.rating}</p>}
                <p className="job-date">{job.date}</p>
                <p className="job-link">
                  <a href={job.link} target="_blank" rel="noopener noreferrer">
                    {job.link}
                  </a>
                </p>
                <p className="job-description">{job.description}</p>
              </li>
            ))}
          </ul>
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default OfferedJobs;