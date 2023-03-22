import chatFlow from '../chatBotLogic/convert_tree_to_json.js';
import "./h.css"
import './EditableList.css';
import React, { useState } from 'react';


const EditableTree = ({ text, children, description }) => {
  const [editedText, setEditedText] = useState(text);
  const [isExpanded, setExpanded] = useState(false);
  const [isFinishEdit, setFinishEdit]= useState(false);


  const handleTextChange = (event) => {
    if(isFinishEdit){
      setEditedText(event.target.value);
    }
  };

  return (
    <ul>
      <li className='vertix'>

      <input className="age" type="text" value={description} />

      <input className="person" type="text" value={editedText} onChange={handleTextChange} />
      
      {/* <br/> */}

      <button className="add-button" onClick={() => setFinishEdit(!isFinishEdit)}>
          {isFinishEdit ? 'Finish Edit' : 'Edit Formulation'}
      </button>

      {children && children.length > 0 && (
      <>
          <button className="add-button" onClick={() => setExpanded(!isExpanded)}>
          {isExpanded ? 'Collapse' : 'Expand'}
          </button>
      </>
      )}

      </li>
      {isExpanded && children&&children.length > 0&&(children.map((child, index) => (
        <EditableTree
          key={index}
          text={child.text}
          children={child.children}
          description={child.title}
        />
      )))}
    </ul>
  );
};

const ViewChatFlow = () => {
  return (
    <div className="pedigree-tree">
      <EditableTree text={chatFlow.text} children={chatFlow.children} description={chatFlow.title} />
      {chatFlow.text}
    </div>
  );
};

export default ViewChatFlow;