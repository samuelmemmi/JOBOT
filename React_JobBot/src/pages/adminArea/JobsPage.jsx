// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './JobsPage.css';
// import starImage from './star.avif';

// function JobsPage() {
//   const [jobs, setJobs] = useState([]);
//   // const [companySearchQuery, setCompanySearchQuery] = useState('');
//   // const [jobTitleSearchQuery, setJobTitleSearchQuery] = useState('');
//   // const [citySearchQuery, setCitySearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(false);


//   useEffect(() => {
//     setIsLoading(true)
//     axios.post('/viewjobs')
//       .then(response => {
//         if (response.data.success) {
//           setJobs(response.data.total_list);
//           setIsLoading(false);
//         } else {
//           console.log('Error fetching jobs:', response.data.message);
//         }
//       })
//       .catch(error => {
//         console.log('Error fetching jobs:', error.message);
//       });
//   }, []);

//   // const filteredJobs = jobs.filter(job =>
//   //   job.company.toLowerCase().includes(companySearchQuery.toLowerCase()) &&
//   //   job.job.toLowerCase().includes(jobTitleSearchQuery.toLowerCase()) &&
//   //   job.city.toLowerCase().includes(citySearchQuery.toLowerCase())
//   // );

//   // return (
//   //   <div>
//   //     <h1 className="title">JOBOT Jobs</h1>
//   //     {isLoading ? (
//   //       <p className="loading">Loading...</p>
//   //     ) : (
//   //       <div className="jobs-page">
//   //         <div className="search-container">
//   //           <input
//   //             type="text"
//   //             placeholder="Search jobs by company name"
//   //             value={companySearchQuery}
//   //             onChange={event => setCompanySearchQuery(event.target.value)}
//   //             className="search-input"
//   //           />
//   //           <input
//   //             type="text"
//   //             placeholder="Search jobs by title"
//   //             value={jobTitleSearchQuery}
//   //             onChange={event => setJobTitleSearchQuery(event.target.value)}
//   //             className="search-input"
//   //           />
//   //           <input
//   //             type="text"
//   //             placeholder="Search jobs by city"
//   //             value={citySearchQuery}
//   //             onChange={event => setCitySearchQuery(event.target.value)}
//   //             className="search-input"
//   //           />
//   //         </div>
//   //         <ul className="jobs-list">
//   //           {filteredJobs.map((job, index) => (
//   //             <li key={index} className="job-item">
//   //               <h2 className="company-name">{job.company}</h2>
//   //               <p className="job-title">{job.job}</p>
//   //               <p className="job-location">{job.city}</p>
//   //               {job.rating&&<p className="job-rating"><span><img className="star" src={starImage} alt="Star" /></span> {job.rating}</p>}
//   //               <p className="job-date">{job.date}</p>
//   //               <p className="job-link">
//   //                 <a href={job.link} target="_blank" rel="noopener noreferrer">
//   //                   {job.link}
//   //                 </a>
//   //               </p>
//   //               <p className="job-description">{job.description}</p>
//   //             </li>
//   //           ))}
//   //         </ul>
//   //       </div>
//   //     )}
//   //   </div>

//   // );

//   const jobsPerPage = 10;

//   const JobList = ({ jobs }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedJob, setSelectedJob] = useState(null);
  
//     // Calculate total number of pages
//     const totalPages = Math.ceil(jobs.length / jobsPerPage);
  
//     // Get jobs for the current page
//     const indexOfLastJob = currentPage * jobsPerPage;
//     const indexOfFirstJob = indexOfLastJob - jobsPerPage;
//     const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  
//     // Handle pagination
//     const handlePageClick = (pageNumber) => {
//       setCurrentPage(pageNumber);
//       setSelectedJob(null);
//     };
  
//     // Handle drill-down
//     const handleJobClick = (job) => {
//       setSelectedJob(job);
//     };
  
//     return (
//       <div className="job-list-container">
//         <h1 className="job-list-title">Job Listings</h1>
//         {selectedJob ? (
//           <div className="job-details">
//             <h2>{selectedJob.title}</h2>
//             <p>{selectedJob.company}</p>
//             <p>{selectedJob.city}</p>
//             <p>{selectedJob.date}</p>
//             <p>{selectedJob.rating}</p>
//             <button onClick={() => setSelectedJob(null)}>Back</button>
//           </div>
//         ) : (
//           <div>
//             <ul className="job-list">
//               {currentJobs.map((job) => (
//                 <li
//                   key={job.id}
//                   className="job-list-item"
//                   onClick={() => handleJobClick(job)}
//                 >
//                   <h3>{job.title}</h3>
//                   <p>{job.company}</p>
//                   <p>{job.city}</p>
//                 </li>
//               ))}
//             </ul>
//             <div className="pagination">
//               {Array.from({ length: totalPages }, (_, index) => index + 1).map(
//                 (pageNumber) => (
//                   <button
//                     key={pageNumber}
//                     onClick={() => handlePageClick(pageNumber)}
//                     className={currentPage === pageNumber ? 'active' : ''}
//                   >
//                     {pageNumber}
//                   </button>
//                 )
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

// return (
//   jobs?<JobList jobs={jobs}/>:<div>wait...</div>
// )
// }

// export default JobsPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobsPage.css';
import starImage from './star.avif';
import {CollapsableCard} from "./CollapsableCard.jsx"
import {CardsTable} from "./CardsTable.jsx"
import { blue } from '@mui/material/colors';

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

  function collapsed(job){
    return (<div style={{textAlign:"center"}} >
    {job.rating&&<p className="job-rating"><span><img className="star" src={starImage} alt="Star" /></span> {job.rating}</p>}
    <p className="job-date">{job.date}</p>
    <p className="job-link">
      <a href={job.link} target="_blank" rel="noopener noreferrer">
        {`${job.link.slice(0, 30)}...`}
      </a>
    </p>
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

  return (
    <div>
      <h1 className="title">JOBOT Jobs</h1>
      { isLoading ?  <p className="loading">Loading...</p> :(
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
      <CardsTable data={dataAsCards} />
      </div>
      </div>) }
      {/* {isLoading ? (
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
      )} */}
    </div>

  );
}

export default JobsPage;

