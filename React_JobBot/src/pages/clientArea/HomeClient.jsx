import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
    <h1>JOBOT</h1>
    <p>
    With JOBOT find your dream job in seconds.
    </p>
    <nav>
        <ul>
            <li>
                <Link to="/">Log out?</Link>
            </li>
            <li>
                <Link to="/details">Registration details</Link>
            </li>
            <li>
                <Link to="/about">About</Link>
            </li>
            <li>
                <Link to="/startChat">Start Chat</Link>
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