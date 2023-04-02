import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [jobTitleSearchQuery, setJobTitleSearchQuery] = useState('');
  const [citySearchQuery, setCitySearchQuery] = useState('');

  useEffect(() => {
    axios.post('/viewjobs')
      .then(response => {
        if (response.data.success) {
          setJobs(response.data.total_list);
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
      <h1>All the jobs in the database</h1>
      <br />
      <input
        type="text"
        placeholder="Search jobs by company name"
        value={companySearchQuery}
        onChange={event => setCompanySearchQuery(event.target.value)}
      />
      <input
        type="text"
        placeholder="Search jobs by title"
        value={jobTitleSearchQuery}
        onChange={event => setJobTitleSearchQuery(event.target.value)}
      />
      <input
        type="text"
        placeholder="Search jobs by city"
        value={citySearchQuery}
        onChange={event => setCitySearchQuery(event.target.value)}
      />
      <br />
      <ul>
        {filteredJobs.map((job, index) => (
          <li key={index}>
            <br />
            <h2>{job.company}</h2>
            <p>{job.job}</p>
            <p>{job.city}</p>
            <p>{job.rating}</p>
            <p>{job.date}</p>
            <p>{job.link}</p>
            <p>{job.description}</p>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobsPage;
