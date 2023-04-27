const JobCard = ({ job, isSelected, onCardClick }) => {
    if (job._id==="Nothing fits"){
      return(
      <div className={`job-card ${isSelected ? "selected" : ""}`}>
      <strong>Nothing Fits</strong>
      </div>
      );
    }
  
    return (
    <div className="job">
      <div className={`job-card ${isSelected ? "selected" : ""}`} onClick={() => onCardClick(job._id)}>
        <h3>{job.job}</h3>
        <p>{job.company}</p>
        <p>{job.city}</p>
        {isSelected?"-":"+"}
      </div>
      {isSelected && (
          <div className="job-details">
            <p><strong>description:</strong><br/> {job.description}</p>
            <p><strong>date:</strong><br/>{job.date}</p>
            <p><strong>link:</strong><br/>{job.link}</p>
          </div>
        )}
    </div>
    );
  };

  export default JobCard;