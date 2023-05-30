// import React from "react";
// import {useState,useEffect} from "react";

// import "./Options.css";

// const EmailDisplay = (props) => {
//   const [options, setOptions] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [submitted,setSubmitted]=useState(false);

//   useEffect(()=>{
//     console.log("which node? ",props.node.getNextResponse())
//     setOptions(props.node.getNextResponse().options)
//   },[]);//maybe props.node_if_options>0


//   const handleOptionChange = (event) => {
//     const option = event.target.value;
//     if (selectedOptions.includes(option)) {
//       setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
//     } else {
//       setSelectedOptions([...selectedOptions, option]);
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log("Selected Options: ", selectedOptions);
//     // handle submission logic
//     setSubmitted(true);
//     props.actionProvider.handleEmailDisplay(props.node,selectedOptions);
    
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
//       <button type="submit" className="option-button" disabled={submitted}>Submit</button>
//     </form>
//   );
// };

// export default EmailDisplay;

import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const EmailDisplay = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitted,setSubmitted]=useState(true);

  useEffect(
    ()=>{
      setOptions(props.node.getNextResponse().options)
    }
    ,[]);//maybe props.node_if_options>0

  const handleOptionChange = (event) => {
    const option = event.target.value;
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const isFormValid = () => {
    return Object.values(selectedOptions).some((isChecked) => isChecked)&&submitted;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected Options1: ", selectedOptions);
    // handle submission logic
    setSubmitted(false);
    if(selectedOptions.includes("Just keep going")){
      props.actionProvider.handleEmailDisplay(props.node,["Just keep going"]);
    }else{
      props.actionProvider.handleEmailDisplay(props.node,selectedOptions);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="listOptions">
        {options.map((opt,index) =>{
          return(
          <label key={index}>
            {/* <br /> */}
            <input
            className="checkbox"
            type="checkbox"
            value={opt}
            onChange={handleOptionChange}
            disabled={(opt!=="Just keep going")&&selectedOptions.includes("Just keep going")} />
            {opt}
          </label>);
        },[])
        }
      </label>
      <br />
      <button type="submit" className="option-button" disabled={!isFormValid()}>Submit</button>
    </form>
  );
};

export default EmailDisplay;

