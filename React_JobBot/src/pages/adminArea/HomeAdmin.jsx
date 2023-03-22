import React from 'react';
import { Link } from 'react-router-dom';

function HomeAdmin() {
  return (
    <div>
    <h1>JOBOT Admin</h1>
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
                <Link to="/users">Users</Link>
            </li>
            <li>
                <Link to="/jobs">Jobs</Link>
            </li>
            <li>
                <Link to="/viewChatFlow">Chat Flow</Link>
            </li>
            <li>
                <Link to="/statistics">Statistics</Link>
            </li>
        </ul>
    </nav>
    </div>
  );
}

export default HomeAdmin;