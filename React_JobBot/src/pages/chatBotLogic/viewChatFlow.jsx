import React, { useState } from 'react';

import chatFlow from './convert_tree_to_json.js';

const TreeNode = ({ node }) => {
  const [isExpanded, setExpanded] = useState(false);
  return (
    <ul>
      <li>
        {node.title+": "}
        {node.text}
        {node.children && node.children.length > 0 && (
          <button onClick={() => setExpanded(!isExpanded)}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </li>
      {isExpanded &&
        node.children.map((childNode, index) => (
          <TreeNode key={index} node={childNode} />
        ))}
    </ul>
  );
};


const Tree = ({ data }) => {
  return <TreeNode node={data} />;
};

const ViewChatFlow = () => {
  return (
    <div>
      <Tree data={chatFlow} />
    </div>
  );
};

export default ViewChatFlow;

