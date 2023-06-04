import Button from '@mui/material/Button';
import JobotLogoPNG from "./JOBOT.png";

//$$$$$$$$$$$$
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import { Link } from 'react-router-dom';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import InfoIcon from '@mui/icons-material/Info';



//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
export default function Header({userType}) {
  // const headerKind = "admin" // useContext()
  return (
    <div className="d-flex justify-content-between align-items-center px-5" style={{backgroundColor:"#59698b",height:"8vh"}}>
      <div>
        <img src={JobotLogoPNG} style={{width:"45%"}}/>
      </div>
      <div>
       <ListItem>
            <IconButton component={Link} to="/about">
              <ListItemIcon>
                <InfoIcon color="primary" fontSize="large"/>
              </ListItemIcon>
            </IconButton>
            <ListItemText
              primary={false}
              secondary={false}
            />
        </ListItem>
      </div>

      {/* setUserType({type:"admin",details:{userName: userName,password: Password,}}) */}
        {/* {userType["type"] === "admin" ? 
        <div className="d-flex justify-content-right">
          <Button style={{color:"#F1F6F9"}}>ADMIN</Button>
          <Button style={{color:"#F1F6F9"}}>ADMIN</Button>
          <Button style={{color:"#F1F6F9"}}>ADMIN</Button>
        </div>
        : null}
        {userType["type"] === "client" ? 
        <div className="d-flex justify-content-right">
          <Button style={{color:"#F1F6F9"}}>USER</Button>
          <Button style={{color:"#F1F6F9"}}>USER</Button>
          <Button style={{color:"#F1F6F9"}}>USER</Button>
        </div>
        : null}
         {Object.keys(userType).length == 0 ? 
        <div className="d-flex justify-content-right">
          <Button style={{color:"#F1F6F9"}}>not logged in</Button>
          <Button style={{color:"#F1F6F9"}}>not logged in</Button>
          <Button style={{color:"#F1F6F9"}}>not logged in</Button>
        </div>
        : null} */}
    </div>
  );
}
