import React, { useState } from 'react';
import axios from 'axios';

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
      <RenderObject object={myObject}/>
      <button onClick={exportObject}>Export</button>
    </div>
  );
}

export default ViewChatFlow;//FINALLLLLL

// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import { Chart, ChartLegend, ChartSeries, ChartSeriesItem, ChartTitle } from '@progress/kendo-react-charts';
// import 'hammerjs';
// const series = [{
//   category: '0-14',
//   value: 0.2545
// }, {
//   category: '15-24',
//   value: 0.1552
// }, {
//   category: '25-54',
//   value: 0.4059
// }, {
//   category: '55-64',
//   value: 0.0911
// }, {
//   category: '65+',
//   value: 0.0933
// }];
// const labelContent = props => {
//   let formatedNumber = Number(props.dataItem.value).toLocaleString(undefined, {
//     style: 'percent',
//     minimumFractionDigits: 2
//   });
//   return `${props.dataItem.category} years old: ${formatedNumber}`;
// };
// const ViewChatFlow = () => <Chart>
//     <ChartTitle text='World Population by Broad Age Groups' />
//     <ChartLegend position="bottom" />
//     <ChartSeries>
//       <ChartSeriesItem type="pie" data={series} field="value" categoryField="category" labels={{
//       visible: true,
//       content: labelContent
//     }} />
//     </ChartSeries>
//   </Chart>;
// // ReactDOM.render(<ChartContainer />, document.querySelector('my-app'));

// export default ViewChatFlow;
