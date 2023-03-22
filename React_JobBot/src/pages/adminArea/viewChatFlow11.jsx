import React, { useState } from 'react';
import "./h.css"
import './EditableList.css';


  

function ViewChatFlow() {
    const [data, setData] = useState({ text: "example 1", children: [{text: "example 2", children: []},{text: "example 3", children: []}] });

    const exportObject = () => {
        const jsonString = JSON.stringify(data);
        // code to export the JSON string
        console.log(jsonString)
    };

    function ObjectItem({ item }) {
        const [expanded, setExpanded] = useState(false);
        const [editing, setEditing] = useState(false);
        const [text, setText] = useState(item.text);
      
        const handleExpandClick = () => {
          setExpanded(!expanded);
        };
      
        const handleEditClick = () => {
          setEditing(!editing);
        };
      
        const handleTextChange = (event) => {
          setText(event.target.value);
        };
      
        const handleSave = () => {
          setData((prevState) => ({
            ...prevState,
            text: text,
          }));
          setEditing(false);
        };
      
        return (
          <div>
            <button onClick={handleExpandClick}>{expanded ? "-" : "+"}</button>
            {editing ? (
              <div>
                <input type="text" value={text} onChange={handleTextChange} />
                <button onClick={handleSave}>Save</button>
              </div>
            ) : (
              <div>
                <span>{item.text}</span>
                <button onClick={handleEditClick}>Edit</button>
              </div>
            )}
            {expanded && (
              <div>
                {item.children.map((child) => (
                  <ObjectItem item={child} />
                ))}
              </div>
            )}
          </div>
        );
      }

    return (<>
    <ObjectItem item={data} />;
    </>);
}


export default ViewChatFlow;