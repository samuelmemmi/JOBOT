import React from "react";
// import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { useHistory } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useUser } from "../../UserProvider";


export default function Login({setUserType}) {
  //const {setUserType} = useUser()
  // const history = useHistory();
  let navigate = useNavigate();
  const routeChange = () => {
    navigate("/./register");
  };

  console.log(setUserType)

  const moveToChat = () => {
    var userName = document.getElementById("LoginUserName").value;
    var Password = document.getElementById("LoginPassword").value;
    
    // Envoi de la demande POST à votre serveur Flask
    axios.post("/login", {
      userName: userName,
      Password: Password,
    }, {
      headers: {
      'Content-type': 'application/json; charset=UTF-8' } 
    })
      .then((response) => {
        if (response.data.success) {
          if (response.data.message === "Admin login success"){
            // setUserType("admin")$$$$$$$$$$$$$$$$$$$
            setUserType({type:"admin",details:{userName: userName,password: Password,}})
            navigate("/./homePageAdmin", {
              state: {
                userName: userName,
                password: Password,
              },
            });
          }
          else {
            // setUserType("user")$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
            setUserType({type:"client",details:{userName: userName,password: Password,}})
            navigate("/./homePage", {
              state: {
                userName: userName,
                password: Password,
              },
            });
          }
        }
        else {
          document.getElementById("loginfail").innerHTML =
            response.data.message;
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div 
      style={{
        height: "100vh",
        backgroundColor: "#F1F6F9",
        color: "#212A3E"
      }}
      className="w-100 d-flex flex-column align-items-center justify-content-center pb-5">
      <div className="w-50 d-flex flex-column align-items-center ">
        <h1 style={{color: "#309CFF"}} className="display-1 m-0">JOBOT</h1>
        <h2 style={{color: "#309CFF"}} className="m-0">Login</h2>
        <p className="mt-3 mb-4">With JOBOT you can find your dream job in seconds!</p>
      </div>
      <div 
        style={{
          backgroundColor: "#309CFF",
          color: "#212A3E",
          width: "35%",
          borderRadius: "20px",
          height:"35%"
        }}
        className="d-flex flex-column align-items-center p-4">
        <div className="w-100 d-flex flex-column align-items-center"> 
        <TextField
          sx={{
            backgroundColor: "#F1F6F9",
            borderRadius: "5px",
          }}
          className="w-100"
          label="Username"
          type="text"
          id="LoginUserName"
        />
          <TextField
          sx={{
            backgroundColor: "#F1F6F9",
            borderRadius: "5px",
          }}
          className="mt-2 w-100"
          label="Password"
          type="password"
          id="LoginPassword"
        />
        </div>
        <div 
        style={{
          //backgroundColor: "red"
        }}
        className="w-100 d-flex flex-row justify-content-between mt-4 ">

        <Button 
        sx={{
          backgroundColor: "#8AFA63",
          width: "50%"
        }}
        className="mx-2" variant="contained"  onClick={moveToChat}>Login</Button>
        <Button 
         sx={{
          backgroundColor: "#8AFA63",
          width: "50%"
        }}
        className="mx-2" variant="contained" onClick={routeChange}>Register</Button>
        </div>
      </div>
      <br/>
      <div id="loginfail"></div>
    </div>
  );
}
