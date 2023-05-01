import axios from "axios";
import React from "react";
import {useState,useEffect} from "react";

import "./Options.css";

const EmailDisplay = (props) => {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitted,setSubmitted]=useState(true);

  //set the updated existing cities from the jobs DB
  useEffect(
    ()=>{
      axios.post("/cities",{
        areas:props.node.getSelected().areas
      }, {
        headers: {
        'Content-type': 'application/json; charset=UTF-8' } 
      })
      .then((response) => {
        if (response.data.success) {
          setOptions([...response.data.cities,"Other"])
        } else {
          console.log("Server did not returned cities");
        }
      })
      .catch((err) => {
        console.log("Error getting cities", err.message);
      });
    }
    ,[]);
  
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
    if(selectedOptions.includes("Other")){
      props.actionProvider.handleCities(props.node,["Other"]);
    }else{
      props.actionProvider.handleCities(props.node,selectedOptions);
    }
  };
  //We used chatGpt to divide the cities into 3 columns
  const columnSize = Math.ceil(options.length / 3);
  const columns = [
    options.slice(0, columnSize),
    options.slice(columnSize, columnSize * 2),
    options.slice(columnSize * 2),
  ];

  const renderCheckbox = (opt) => (
    <div key={opt}>
      <label>
      <input
      className="checkbox"
      type="checkbox"
      value={opt}
      onChange={handleOptionChange}
      disabled={(opt!=="Other")&&selectedOptions.includes("Other")} />
      {opt}
      </label>
    </div>
  );

  const renderColumns = (columnCities,index) => (
    <div key={index} style={{ flex: 1, justifyContent: 'space-between', alignItems: 'flex-start' }}>
      {columnCities.map(city => renderCheckbox(city))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <div style={{ display: 'flex' }}>
        {
          columns.map((columnCities,index) => renderColumns(columnCities,index))
        }
        </div>
      </label>
      <br />
      <button type="submit" className="option-button" disabled={!isFormValid()}>Submit</button>
    </form>
  );

};

export default EmailDisplay;
