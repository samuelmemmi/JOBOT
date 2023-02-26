import React from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  let navigate = useNavigate();
  const routeChange = () => {
    navigate("/./register");
  };

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
          navigate("/./startChat", {
            state: {
              name: userName,
            },
          });
        } else {
          document.getElementById("loginfail").innerHTML =
            response.data.message;
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
          <h3 className="loginLogo">JobBot</h3>
          <h2 className="loginLogo1">Login</h2>
          <span className="loginDesc">
            With JobBot find your dream job in seconds
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <input
              placeholder="Username"
              className="loginInput"
              id="LoginUserName"
            />
            <input
              placeholder="Password"
              className="loginInput"
              id="LoginPassword"
            />
            <div id="loginfail"></div>
            <button className="loginButton" onClick={moveToChat}>
              Log In
            </button>
            <button className="loginRgisterButton" onClick={routeChange}>
              Create a new Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
