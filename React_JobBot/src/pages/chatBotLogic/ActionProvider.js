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
    this.addMessageToState(message);
  };

  handleOtherField = (node,opt)=>{
    const message = this.createChatBotMessage(
      node.getNextResponse().children[0].children[0].text,
      {
        widget: "approval",
      }
    );
    node.setSelected({...node.getSelected(),field:opt});
    node.setNextResponse(node.getNextResponse().children[0].children[0])
    this.addMessageToState(message);
  }

  handleApproval(node,opt){
    const message = this.createChatBotMessage(node.getNextResponse().children[0].text);
    node.setSelected({...node.getSelected(),approval:opt});
    node.setNextResponse(node.getNextResponse().children[0])
    this.addMessageToState(message);
  }

  handleJobTitle = (node,opts) => {
    const message = this.createChatBotMessage(
      node.getNextResponse().children[0].text,
      {
        widget: "companies",
      }
    );
    node.setSelected({...node.getSelected(),'job titles':opts})
    node.setNextResponse(node.getNextResponse().children[0])
    this.addMessageToState(message);
  };

  handleCompany = (node,opts) => {
    const message1=this.createChatBotMessage(node.getNextResponse().children[0].text);
    this.addMessageToState(message1);
    const message2 = this.createChatBotMessage(
      node.getNextResponse().children[0].children[0].text,
      {
        widget: "areas",
      }
    );
    node.setSelected({...node.getSelected(),companies:opts})
    node.setNextResponse(node.getNextResponse().children[0].children[0])
    this.addMessageToState(message2);
  };

  handleArea(node,opts){
    const message1=this.createChatBotMessage(node.getNextResponse().children[0].text);
    this.addMessageToState(message1);
    const message2 = this.createChatBotMessage(
      node.getNextResponse().children[0].children[0].text,
      {
        widget: "jobTypes",
      }
    );
    node.setSelected({...node.getSelected(), areas:opts})
    node.setNextResponse(node.getNextResponse().children[0].children[0])
    this.addMessageToState(message2);
  }

  handleJobType(node,opts){
    const message = this.createChatBotMessage(
      node.getNextResponse().children[0].text,
      {
        widget: "",
      }
    );
    node.setSelected({...node.getSelected(),'job Types':opts})
    node.setNextResponse(node.getNextResponse().children[0])
    this.addMessageToState(message);
    //server
    var t=console.log(node.getSelected())

  }

  addMessageToState = (message) => {
    this.setState((prevState) =>{
      return {
      ...prevState,
      messages: [...prevState.messages, message],
      };
    });
  };

}

export default ActionProvider;
