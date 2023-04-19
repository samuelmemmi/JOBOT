// import React from "react";
// import {useState,useEffect} from "react";

// import "./Options.css";

// const JobTypes = (props) => {
//   const [options, setOptions] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [submitted,setSubmitted]=useState(true);

//   useEffect(()=>{setOptions(props.node.getNextResponse().options)},[]);//maybe props.node_if_options>0


//   const handleOptionChange = (event) => {
//     const option = event.target.value;
//     if (selectedOptions.includes(option)) {
//       setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
//     } else {
//       setSelectedOptions([...selectedOptions, option]);
//     }
//   };

//   const isFormValid = () => {
//     return Object.values(selectedOptions).some((isChecked) => isChecked)&&submitted;
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log("Selected Options: ", selectedOptions);
//     // handle submission logic
//     setSubmitted(false);
//     props.actionProvider.handleJobType(props.node,selectedOptions);
    
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         {options.map((opt,index) =>{
//           return(
//           <label key={index}>
//             <br />
//             <input
//             type="checkbox"
//             value={opt}
//             onChange={handleOptionChange} />
//             {opt}
//           </label>);
//         },[])
//         }
//       </label>
//       <br />
//       <button type="submit" className="option-button" disabled={!isFormValid()}>Submit</button>
//     </form>
//   );
// };

// export default JobTypes;

import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const JobTypes = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Full_time");
  const [submitted,setSubmitted]=useState(false);

  useEffect(()=>{setOptions(props.node.getNextResponse().options)},[]);//maybe props.node_if_options>0

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle submission logic
    setSubmitted(true);
    props.actionProvider.handleJobType(props.node,[selectedOption])
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {options.map((opt,index) =>{
          return(
          <label key={index}>
            <br />
            <input
            type="radio"
            value={opt}
            name="jobType"
            checked={selectedOption === opt}
            onChange={handleOptionChange} 
            />
            {opt}
          </label>);
        },[])
        }
      </label>
      <br />
      <button type="submit" className="option-button" disabled={submitted}>Submit</button>
    </form>);
};

export default JobTypes;

