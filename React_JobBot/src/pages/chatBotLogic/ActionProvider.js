class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  greet = () => {
    const message = this.createChatBotMessage("Hello friend.");
    this.addMessageToState(message);
  };

  handleField = (node,opt) => {
    const message = this.createChatBotMessage(
      node.getNextResponse().children[0].children[1].text,
      {
        widget: "jobTitles",
      }
    );
    node.setSelected({...node.getSelected(),field:opt})
    node.setNextResponse(node.getNextResponse().children[0].children[1])
    console.log(node.getSelected())
    this.addMessageToState(message);
  };

  handleOtherField = (node,opt)=>{
    const message = this.createChatBotMessage(
      node.getNextResponse().children[0].children[0].text,
      {
        widget: "approval",
      }
    );
    // this.addNodeToState(nodes[0]);
    node.setSelected({...node.getSelected(),field:opt});
    // var x=node.getSelected();
    console.log("Selected Params ",node.getSelected())
    node.setNextResponse(node.getNextResponse().children[0].children[0])
    this.addMessageToState(message);
  }

  handleApproval(node,opt){
    const message = this.createChatBotMessage(node.getNextResponse().children[0].text);
    node.setSelected({...node.getSelected(),approval:opt});
    node.setNextResponse(node.getNextResponse().children[0])
    this.addMessageToState(message);
    console.log("SELECTED OTHER FLOW ",node.getSelected())
  }

  handleJobTitle = (node,opts) => {
    const message = this.createChatBotMessage(
      node.getNextResponse().children[0].text,
      {
        widget: "",
      }
    );
    node.setSelected({...node.getSelected(),'job titles':opts})
    node.setNextResponse(node.getNextResponse().children[0])
    console.log("In handle ",node.getSelected())
    this.addMessageToState(message);
  };

  addMessageToState = (message) => {
    this.setState((prevState) =>{
      // console.log(prevState.messages[prevState.messages.length-1].message+" LOOOLOOO"+x)
      console.log("Messages ",prevState.messages);
      return {
      ...prevState,
      messages: [...prevState.messages, message],
      };
    });
  };

//mine
  // addNodeToState = (node) => {
  //   this.setState((prevState) => ({
  //     ...prevState,
  //     nodes: [...prevState.nodes, node],
  //   }));
  // };
}

export default ActionProvider;
