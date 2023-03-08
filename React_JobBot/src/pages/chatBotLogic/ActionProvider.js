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
    node.setSelected({...node.getSelected(),'JobTitles':opts})
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
