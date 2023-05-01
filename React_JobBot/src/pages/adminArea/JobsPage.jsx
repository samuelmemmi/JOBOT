import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobsPage.css';
import starImage from './star.avif';

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [jobTitleSearchQuery, setJobTitleSearchQuery] = useState('');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);


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
        console.log('Error fetching jobs:', error.message);
      });
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.company.toLowerCase().includes(companySearchQuery.toLowerCase()) &&
    job.job.toLowerCase().includes(jobTitleSearchQuery.toLowerCase()) &&
    job.city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <div>
      <h1 className="title">JOBOT Jobs</h1>
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="jobs-page">
          <div className="search-container">
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
          <ul className="jobs-list">
            {filteredJobs.map((job, index) => (
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
        </div>
      )}
    </div>

  );
}

export default JobsPage;