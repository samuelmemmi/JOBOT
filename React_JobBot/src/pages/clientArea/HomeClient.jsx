import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Home() {
    const location = useLocation();
    const clientDetails = location.state;
    console.log(clientDetails)
  return (
    <div>
    <h1>JOBOT</h1>
    <p>
    With JOBOT find your dream job in seconds.
    </p>
    <nav>
        <ul>
            <li>
                <Link to="/logout">Log out?</Link>
            </li>
            <li>
                <Link to="/details" state={clientDetails}>Registration details</Link>
            </li>
            <li>
                <Link to="/about">About</Link>
            </li>
            <li>
                <Link to="/startChat" state={clientDetails}>Start chat</Link>
            </li>
            <li>
                <Link to="/jobs">Self job search</Link>
            </li>
        </ul>
    </nav>
    </div>
  );
}

export default Home;
