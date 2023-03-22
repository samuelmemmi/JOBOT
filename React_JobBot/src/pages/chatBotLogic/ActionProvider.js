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
    var txt=node.getNextResponse().children[0].children[1].text;
    const message = this.createChatBotMessage(
      txt,
      {
        widget: "JobTitles",
      }
    );
    node.setSelected({...node.getSelected(),field:opt})
    node.setHistoryChat([...node.getHistoryChat(),{bot:[node.getNextResponse().text,node.getNextResponse().children[0].text]},{user:[opt]},{bot:[txt]}])
    console.log("how ",node.getHistoryChat())
    node.setNextResponse(node.getNextResponse().children[0].children[1])
    this.addMessageToState(message);
  };

  handleOtherField = (node,opt)=>{
    var txt=node.getNextResponse().children[0].children[0].text;
    const message = this.createChatBotMessage(
      txt,
      {
        widget: "approval",
      }
    );
    node.setSelected({...node.getSelected(),field:opt});
    node.setHistoryChat([...node.getHistoryChat(),{bot:[node.getNextResponse().text,node.getNextResponse().children[0].text]},{user:[opt]},{bot:[txt]}])
    console.log("how ",node.getHistoryChat())
    node.setNextResponse(node.getNextResponse().children[0].children[0])
    this.addMessageToState(message);
  };

  handleApproval(node,opt){
    var txt=node.getNextResponse().children[0].text;
    const message = this.createChatBotMessage(txt);
    node.setSelected({...node.getSelected(),approval:opt});
    node.setHistoryChat([...node.getHistoryChat(),{user:[opt]},{bot:[txt]}]);
    console.log("how ",node.getHistoryChat());
    this.addMessageToState(message);
  }

  handleJobTitle = (node,opts) => {
    var txt=node.getNextResponse().children[0].text;
    const message = this.createChatBotMessage(
      txt,
      {
        widget: "companies",
      }
    );
    node.setSelected({...node.getSelected(),'JobTitles':opts})
    node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt]}])
    console.log("how ",node.getHistoryChat());
    node.setNextResponse(node.getNextResponse().children[0])
    this.addMessageToState(message);
  };


  handleCompany = (node,opts) => {
    var txt1=node.getNextResponse().children[0].text;
    const message1=this.createChatBotMessage(txt1);
    this.addMessageToState(message1);
    
    var txt2=node.getNextResponse().children[0].children[0].text;
    const message2 = this.createChatBotMessage(
      txt2,
      {
        widget: "areas",
      }
    );
    node.setSelected({...node.getSelected(),companies:opts})
    node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt1,txt2]}])
    console.log("how ",node.getHistoryChat());
    node.setNextResponse(node.getNextResponse().children[0].children[0])
    this.addMessageToState(message2);
  };

  handleArea(node,opts){
    var txt1=node.getNextResponse().children[0].text;
    const message1=this.createChatBotMessage(txt1);
    this.addMessageToState(message1);

    var txt2=node.getNextResponse().children[0].children[0].text;
    const message2 = this.createChatBotMessage(
      txt2,
      {
        widget: "jobTypes",
      }
    );
    node.setSelected({...node.getSelected(), areas:opts})
    node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt1,txt2]}])
    console.log("how ",node.getHistoryChat());
    node.setNextResponse(node.getNextResponse().children[0].children[0])
    this.addMessageToState(message2);
  }
  //Samuel version
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


  // handleJobType(node,opts){
  //   var txt1=node.getNextResponse().children[0].text;
  //   const message1 = this.createChatBotMessage(txt1);
  //   this.addMessageToState(message1);

  //   //server
  //   var jobs=["X","Y","Z","T","W","Nothing fits"];
  //   node.setJobs(jobs);

  //   var txt2=node.getNextResponse().children[0].children[0].text;
  //   const message2 = this.createChatBotMessage(
  //     txt2,
  //     {
  //       widget: "jobs",
  //     }
  //   );
  //   node.setSelected({...node.getSelected(),'job Types':opts})
  //   node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt1,txt2]}])
  //   console.log("how ",node.getHistoryChat());
  //   node.setNextResponse(node.getNextResponse().children[0].children[0].children[0])
  //   this.addMessageToState(message2);
  // }

  handleJob(node,opts){
    if(opts.length===0||((opts.length>0)&&(opts[0]==="Nothing fits"))){
      if(node.getCountNotFits()===1){
        //first message
        var txt1=node.getNextResponse().text;
        const message1 = this.createChatBotMessage(
          txt1,
          {
            widget:"jobs"
          }
          );
        this.addMessageToState(message1);
        node.setHistoryChat([...node.getHistoryChat(),{bot:[txt1]}])
        node.setNextResponse(node.getNextResponse().children[0])
      }else if(node.getCountNotFits()===2){
        var txt=node.getNextResponse().text;
        const message = this.createChatBotMessage(
          txt,
          {
            widget:""
          }
          );
        this.addMessageToState(message);
        node.setHistoryChat([...node.getHistoryChat(),{bot:[txt]}])
        node.setNextResponse(node.getNextResponse().children[0])
      }
      // var txt=node.getNextResponse().children[0].text;
      // const message = this.createChatBotMessage(
      //   txt,
      //   {
      //     widget: "jobs",
      //   }
      // );
      // node.setSelected({...node.getSelected(),'selected jobs':opts})
      // node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt]}])
      // node.setSelectedJobs(opts);
      // console.log("in jobs handle ",node.getHistoryChat());
      // node.setNextResponse(node.getNextResponse().children[0])
      // this.addMessageToState(message);
      //server
      //var t=console.log(node.getSelected())
    }
    else{
      txt=node.getNextResponse().children[1].text;
      const message = this.createChatBotMessage(
        txt,
        {
          widget: "emailDisplay",
        }
      );
      node.setSelected({...node.getSelected(),'selected jobs':opts})
      node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt]}])
      node.setSelectedJobs(opts);
      console.log("I chose jobs  ",node.getSelectedJobs());
      node.setNextResponse(node.getNextResponse().children[1])
      this.addMessageToState(message);
    }
  }

  handleEmailDisplay(node,opts){
    if(opts.length>0 && opts.includes("Email them to me")){
      //logic sending email
      console.log("I send to you mail");
    }
    if((opts.length>0 && opts.includes("Display my choices again"))){
      const mess=this.createChatBotMessage(
        "There are your selected jobs",
        {
          widget: "displaySelectedJobs",
        }
      );
      this.addMessageToState(mess);
    }
    //(מה את רוצה לתעד בהיסטוריה, והאם להכניס לקובץ שלנו גם את החלק של הצגת המשרות (במידה והוא לחץ על הצגת משרות
    node.setHistoryChat([...node.getHistoryChat(),{bot:["There are your selected jobs"]}])

    //המשך רגיל
    var txt=node.getNextResponse().children[0].text;
    const message = this.createChatBotMessage(
      txt,
      {
        widget: "approval",//תמחקי פה ותכיני רגיל
      }
    );
    // node.setSelected({...node.getSelected(),'email or/and display':opts})
    node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt]}])
    console.log("how ",node.getHistoryChat());
    node.setNextResponse(node.getNextResponse().children[0])
    this.addMessageToState(message);
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
