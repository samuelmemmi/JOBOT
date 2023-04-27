import React from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function Register() {
  let navigate = useNavigate();
  const routeChange = () => {
    navigate("/.");
  };

  const RegisterAccount = () => {
    var userName = document.getElementById("RegisterUserName").value;
    var Password = document.getElementById("RegisterPassword").value;
    
    // Envoi de la demande POST à votre serveur Flask
    axios.post("/register", {
      user_name: userName,
      password: Password
    }, {
      headers: {
      'Content-type': 'application/json; charset=UTF-8' } 
    })
      .then((response) => {
        if (response.data.success) {
          document.getElementById("registersuccess").innerHTML = response.data.message;
          setTimeout(() => {
            navigate("/.", { state: { successMessage: response.data.message } });
          }, 2500);
        } else {
          document.getElementById("registerfail").innerHTML = response.data.message;
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">JOBOT</h3>
          <h2 className="loginLogo1">Register</h2>
          <span className="loginDesc">
            With JOBOT find your dream job in seconds
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <input
              placeholder="Username"
              className="loginInput"
              id="RegisterUserName"
            />
            <input
              placeholder="Password"
              className="loginInput"
              id="RegisterPassword"
            />
            <div id="registerfail"></div>
            <div id="registersuccess"></div>
            <button className="loginButton" onClick={RegisterAccount}>
              Sign up
            </button>
            <button className="loginRgisterButton" onClick={routeChange}>
              Log into account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



