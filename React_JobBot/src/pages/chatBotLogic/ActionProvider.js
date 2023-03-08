import axios from "axios";

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
        widget: "JobTitles",
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
    node.setSelected({...node.getSelected(),'JobTitles':opts})
    node.setNextResponse(node.getNextResponse().children[0])
    console.log("In handle ",node.getSelected())
    this.addMessageToState(message);
  };

<<<<<<< Updated upstream
=======
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
    var responses = node.getSelected()
    axios.post("/getfirstjobs", {
      responses: responses
    }, {
      headers: {
      'Content-type': 'application/json; charset=UTF-8' } 
    })
    .then((response) => {
      if (response.data.success) {
        console.log("Server returned matching jobs:", response.data.list_jobs);
        // Add a message for each job to the chatbot's message history
        response.data.list_jobs.forEach((job) => {
          const jobMessage = this.createChatBotMessage(
            `Job title: ${job.job}\nCompany: ${job.company}\nLocation: ${job.city}`
          );
          this.addMessageToState(jobMessage);
        });
      } else {
        console.log("Error getting matching jobs: ", response.data.message);
      }
    })
    .catch((err) => {
      console.log("Error getting matching jobs: ", err.message);
    });


  }

>>>>>>> Stashed changes
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
