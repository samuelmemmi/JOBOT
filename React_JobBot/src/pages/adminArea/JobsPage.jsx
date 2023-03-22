import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JobsPage() {
  const [jobs, setJobs] = useState([]);

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

  return (
    <div>
      <h1>All the jobs in the database</h1>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            <h2>{job.company}</h2>
            <p>{job.job}</p>
            <p>{job.city}</p>
            <p>{job.rating}</p>
            <p>{job.date}</p>
            <p>{job.link}</p>
            <p>{job.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobsPage;
