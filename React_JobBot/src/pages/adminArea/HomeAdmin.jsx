import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
// import FolderIcon from "@mui/icons-material/Folder";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PieChartIcon from '@mui/icons-material/PieChart';
// import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
// import InfoIcon from '@mui/icons-material/Info';

export default function HomeAdmin() {
    const location = useLocation();
    const adminDetails = location.state;
    console.log(adminDetails)
    
    
      const dense = false;
      const secondary = true;
    
      return (
        <div style={{height: "92vh"}} className="w-100 d-flex flex-column justify-content-center align-items-center pb-5">
            <h1 style={{color: "#309CFF"}}>Welcome Admin!</h1>
        <List dense={dense} className="m-3">
          <ListItem>
            <IconButton component={Link} to="/users">
              <ListItemIcon >
                <PeopleIcon color="primary" fontSize="large"/>
              </ListItemIcon>
            </IconButton>
            <ListItemText
              primary="Users"
              secondary={false}
            />
          </ListItem>
    
          <ListItem>
            <IconButton component={Link} to="/jobs">
              <ListItemIcon>
                <SearchOutlinedIcon  color="primary"  fontSize="large"/>
              </ListItemIcon>
            </IconButton>
            <ListItemText
              primary="Jobs"
              secondary={false}
            />
          </ListItem>

          <ListItem>
            <IconButton component={Link} to="/viewChatFlow">
              <ListItemIcon>
                <AccountTreeIcon  color="primary"  fontSize="large"/>
              </ListItemIcon>
            </IconButton>
            <ListItemText
              primary="Chat Flow"
              secondary={false}
            />
          </ListItem>

          <ListItem>
            <IconButton component={Link} to="/statistics">
              <ListItemIcon>
                <PieChartIcon  color="primary"  fontSize="large"/>
              </ListItemIcon>
            </IconButton>
            <ListItemText
              primary="Statistics"
              secondary={false}
            />
          </ListItem>
    
          <ListItem>
            <IconButton component={Link} to="/details" state={adminDetails}>
              <ListItemIcon>
                <ManageAccountsOutlinedIcon  color="primary"  fontSize="large"/>
              </ListItemIcon>
            </IconButton>
            <ListItemText
              primary="Admin Details"
              secondary={false}
            />
          </ListItem>
    
          <ListItem>
            <IconButton component={Link} to="/logout" state={adminDetails}>
              <ListItemIcon>
                <LogoutOutlinedIcon  color="primary"  fontSize="large"/>
              </ListItemIcon>
            </IconButton>
            <ListItemText
              primary="Logout"
              secondary={false}
            />
          </ListItem>
    
        </List>
        </div>
      );
    }



// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';

// function HomeAdmin() {
//     const location = useLocation();
//     const adminDetails = location.state;
//     console.log(adminDetails)
//   return (
//     <div>
//     <h1>JOBOT Admin</h1>
//     <p>
//     With JOBOT find your dream job in seconds.
//     </p>
//     <nav>
//         <ul>
//             <li>
//                 <Link to="/logout">Log out?</Link>
//             </li>
//             <li>
//                 <Link to="/details" state={adminDetails}>Registration details</Link>
//             </li>
//             <li>
//                 <Link to="/about">About</Link>
//             </li>
//             <li>
//                 <Link to="/users">Users</Link>
//             </li>
//             <li>
//                 <Link to="/jobs">Jobs</Link>
//             </li>
//             <li>
//                 <Link to="/viewChatFlow">Chat Flow</Link>
//             </li>
//             <li>
//                 <Link to="/statistics">Statistics</Link>
//             </li>
//         </ul>
//     </nav>
//     </div>
//   );
// }

// export default HomeAdmin;