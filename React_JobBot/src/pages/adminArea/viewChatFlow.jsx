import React, { useState } from 'react';
import axios from 'axios';
import Typography from "@mui/material/Typography";

import chatFlow from "../chatBotLogic/convert_tree_to_json";
import "./viewChatFlow.css"

function ViewChatFlow() {
  // const [myObject, setMyObject] = useState(require('../chatBotLogic/decisionTree.json'));
  const [myObject, setMyObject] = useState(()=>{
    try {
      var obje = require('../chatBotLogic/decisionTree.json');
      return obje;
    } catch (error) {
      //console.error(`Error loading data: ${error}`);
      obje = chatFlow;
      axios.post('/write-json', obje, {
          headers: {
          'Content-type': 'application/json; charset=UTF-8' } 
        })
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error(error.response.data.error);
        });
        return obje
    }});

  function RenderObject({ object }) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(object.text);
    const [collapsed, setCollapsed] = useState(true);
  
    const handleSave = () => {
      object.text = text;
      setEditing(false);
    };
  
    const handleCollapse = () => {
      setCollapsed(!collapsed);
    };
  
    return (
      <ul>
        <li className='vertix'>
        <input className="description" type="text" value={object.title} readOnly/>
          {editing ? (
            <input className="text-content" value={text} onChange={(e) => setText(e.target.value)} />
          ) : (
            <>
              <button className="expand-button" onClick={() => setEditing(true)}>Edit Formulation</button>
              <input className="text-content" type="text" value={object.text} readOnly/>
            </>
          )}
          {editing && <button className="expand-button" onClick={handleSave}>Save</button>}
          {object.children && object.children.length>0 && (<button className="expand-button" onClick={handleCollapse}>
          {collapsed ? 'Expand' : 'Collapse'}
          </button>)}
          </li>
          <div>
          {!collapsed && (
            <div>
              {object.children&&object.children.length>0&&(object.children.map((child,index) => (
                <RenderObject key={index} object={child} />
              )))}
            </div>
          )}
        </div>
        
      </ul>
    );
  }

  const exportObject = () => {
    // const json = JSON.stringify(myObject);
    // console.log(json);

    axios.post('/write-json', myObject, {
      headers: {
      'Content-type': 'application/json; charset=UTF-8' } 
    })
    .then((response) => {
      console.log(response.data.message);
    })
    .catch((error) => {
      console.error(error.response.data.error);
    });
  };

  return (
    <div className="pedigree-tree">
      <Typography variant='h4' align="center" m={2} fontFamily="Serif">Decision Tree of the Chat Bot</Typography>
      <RenderObject object={myObject}/>
      <button onClick={exportObject} style={{'margin-left': '20px'}}>Export</button>
    </div>
  );
}

export default ViewChatFlow;//FINALLLLLL


