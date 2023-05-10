import axios from "axios";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  saveHistoryInDB=(node)=>{
    node.getSelected()["displayed jobs"] && delete node.getSelected()["displayed jobs"];
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    var history={
      ...node.getSavedInDB(),
      "client details":node.getRegistrationDetails(),
      "field":node.getSelected().field,
      "conversation content":node.getHistoryChat(),
      "displayed jobs":node.getSavedInDB()["displayed jobs"]?node.getSavedInDB()["displayed jobs"]:"-",
      "selected jobs":node.getSavedInDB()["selected jobs"]?node.getSavedInDB()["selected jobs"]:"-",
      "experiance & education":node.getSelected()["job Requirements"]?node.getSelected()["job Requirements"]:"-",
      "feedback on termination":node.getSavedInDB()["feedback on termination"]?node.getSavedInDB()["feedback on termination"]:"-",
      "selected features":node.getSelected(),
      "date":date
      }
      console.log("save data in DB ",history)
    // node.setSavedInDB(history);
    // //call server with 'history' var
    // //clienthistory
    //   axios.post('/clienthistory', {
    //     history: history
    //   }, {
    //     headers: {
    //     'Content-type': 'application/json; charset=UTF-8' } 
    //   })
    //   .then((response) => {
    //     console.log(response.data.message);
    //     console.log("save data in DB ",history)
    //   })
    //   .catch((error) => {
    //     console.error(error.response.data.error);
    //   });
  }

  selfSearch = (node,Freetxt) => {
    var txt1=node.getNextResponse().children[0].text;
    const message1 = this.createChatBotMessage(
      txt1,
      {
        widget: "moreInfo",
      }
    );
    this.addMessageToState(message1,node);

    //goodbye
    var txt2=node.getNextResponse().children[0].children[0].text;
    const message2 = this.createChatBotMessage(txt2);

    //set history
    if((typeof Freetxt === "object") && (Freetxt !== null) && (Freetxt.flag === "noJobs")){
      //adding the bot message into the end of history
      var newHistoryArray=node.getHistoryChat();
      var lastBotHistory=newHistoryArray.pop();
      lastBotHistory.bot.push(txt1,txt2)
      var updatedBotHistory={bot:lastBotHistory.bot}
      node.setHistoryChat([...newHistoryArray,updatedBotHistory])
    }else{
      node.setHistoryChat([...node.getHistoryChat(),{user:[Freetxt]},{bot:[txt1,txt2]}]);
    }
    console.log("history ",node.getHistoryChat());
    node.setIsFeedback(0);
    this.addMessageToState(message2,node);
    this.saveHistoryInDB(node)
  };

  handleField = (node,opt) => {
    console.log("Thank you god!",node.getRegistrationDetails())
    var txt=node.getNextResponse().children[0].children[1].text;
    const message = this.createChatBotMessage(
      txt,
      {
        widget: "jobTitles",
      }
    );
    node.setSelected({...node.getSelected(),field:opt})
    node.setHistoryChat([...node.getHistoryChat(),{bot:[node.getNextResponse().text,node.getNextResponse().children[0].text]},{user:[opt]},{bot:[txt]}])
    console.log("how ",node.getHistoryChat())
    node.setNextResponse(node.getNextResponse().children[0].children[1])
    this.addMessageToState(message,node);
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
    this.addMessageToState(message,node);
  };

  handleApproval(node,opt){
    //case of asking for saving user details in our system
    if(node.getNextResponse().title==="user selected 'other' field"){
      //????????????????????? if yes save!!!
      var txt=node.getNextResponse().children[0].text;
      const message = this.createChatBotMessage(
        txt,
        {
          widget: "moreInfo",
        }
      );
      node.setSelected({...node.getSelected(),approval:opt});
      node.setHistoryChat([...node.getHistoryChat(),{user:[opt]},{bot:[txt]}]);
      console.log("history ",node.getHistoryChat());
      this.addMessageToState(message,node);
      //קריאה לסיום לא בטוח
      this.saveHistoryInDB(node)
    }
    //case of asking for self job search
    else if(node.getNextResponse().title.includes("self job search")){
      if(opt==="Yes"){
        //קריאה לסיום
        this.selfSearch(node,opt)
      }else{
        //קריאה לסיום
        var txt=node.getNextResponse().children[1].text;
        const message = this.createChatBotMessage(txt);
        node.setHistoryChat([...node.getHistoryChat(),{user:[opt]},{bot:[txt]}]);
        console.log("history ",node.getHistoryChat());
        this.addMessageToState(message,node);
        this.saveHistoryInDB(node)
      }
    }
    //case of asking for accurate match
    else if(node.getNextResponse().title==="user selected 'Nothing fits' or up to 2 jobs"){
      //user want an accurate match
      if(opt==="Yes"){
        node.setHistoryChat([...node.getHistoryChat(),{user:[opt]}]);
        document.documentElement.style.setProperty('--button-visibility', 'visible');
        this.requirementsWidget(node)
      }else{
        //user did not want an accurate match
        var txt=node.getNextResponse().children[0].text;
        const message = this.createChatBotMessage(txt);
        node.setHistoryChat([...node.getHistoryChat(),{user:[opt]},{bot:[txt]}]);
        console.log("history ",node.getHistoryChat());
        node.setIsFeedback(1);
        node.setNextResponse(node.getNextResponse().children[0])
        this.addMessageToState(message,node);
        document.documentElement.style.setProperty('--button-visibility', 'visible');
      }
    }
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
    this.addMessageToState(message,node);
  };

  handleCompany = (node,opts) => {
    var txt1=node.getNextResponse().children[0].text;
    const message1=this.createChatBotMessage(txt1);
    this.addMessageToState(message1,node);
    
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
    this.addMessageToState(message2,node);
  };

  handleArea(node,opts){
    var txt1=node.getNextResponse().children[0].text;
    const message1=this.createChatBotMessage(txt1);
    this.addMessageToState(message1,node);

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
    this.addMessageToState(message2,node);
  }
  //Samuel version
  // handleJobType(node,opts){
  //   const message = this.createChatBotMessage(
  //     node.getNextResponse().children[0].text,
  //     {
  //       widget: "",
  //     }
  //   );
  //   node.setSelected({...node.getSelected(),'job Types':opts})
  //   node.setNextResponse(node.getNextResponse().children[0])
  //   this.addMessageToState(message,node);
  //   //server
  //   var responses = node.getSelected()
  //   axios.post("/getfirstjobs", {
  //     responses: responses
  //   }, {
  //     headers: {
  //     'Content-type': 'application/json; charset=UTF-8' } 
  //   })
  //   .then((response) => {
  //     if (response.data.success) {
  //       console.log("Server returned matching jobs:", response.data.list_jobs);
  //       // Add a message for each job to the chatbot's message history
  //       response.data.list_jobs.forEach((job) => {
  //         const jobMessage = this.createChatBotMessage(
  //           `Job title: ${job.job}\nCompany: ${job.company}\nLocation: ${job.city}`
  //         );
  //         this.addMessageToState(jobMessage,node);
  //       });
  //     } else {
  //       console.log("Error getting matching jobs: ", response.data.message);
  //     }
  //   })
  //   .catch((err) => {
  //     console.log("Error getting matching jobs: ", err.message);
  //   });
  // }

  handleJobType(node,opts){
    //asking to wait
    var txt1=node.getNextResponse().children[0].text;
    const message1 = this.createChatBotMessage(txt1);
    this.addMessageToState(message1,node);

    //server calculating jobs...
    node.setSelected({...node.getSelected(),'job Types':opts})
    console.log("selected before sending to server: ",node.getSelected())
    // var jobs=["X","Y","Z","T","W","Nothing fits"];
    // node.setJobs(jobs);

    //samuel
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
        // response.data.list_jobs.forEach((job) => {
        //   const jobMessage = this.createChatBotMessage(
        //     `Job title: ${job.job}\nCompany: ${job.company}\nLocation: ${job.city}`
        //   );
        //   this.addMessageToState(jobMessage,node);
        // });
        // while(response.data.list_jobs===[]){}
        
        // node.setJobs(response.data.list_jobs);

        node.setJobs(response.data.list_jobs.map((job,index) =>{
          if(!job._id){
            var _id=(index).toString();
            return {...job,"_id":_id};
          }else{
            return job;
          }
        }));

        // node.setJobs(["A","B","C","D","E","F","G","H","I","J","Nothing fits"]);
        if(node.getSavedInDB()["displayed jobs"]){
          node.setSavedInDB({...node.getSavedInDB(),"displayed jobs":node.getSavedInDB()["displayed jobs"].concat(node.getJobs())});
        }else{
          node.setSavedInDB({...node.getSavedInDB(),"displayed jobs":node.getJobs()});
        }

        //continute
        if(response.data.list_jobs.length!==0){
          var txt2=node.getNextResponse().children[0].children[0].text;
          const message2 = this.createChatBotMessage(
            txt2,
            {
              widget: "jobs",
            }
          );
          node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt1,txt2]}])//ID job ADDED???
          node.setSelected({...node.getSelected(),"displayed jobs":response.data.list_jobs})
          console.log("history ",node.getHistoryChat());
          node.setNextResponse(node.getNextResponse().children[0].children[0])
          this.addMessageToState(message2,node);
        }else{
          var txt2="No jobs found";
          const message2 = this.createChatBotMessage(txt2);
          node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt1,txt2]}])
          console.log("history ",node.getHistoryChat());
          node.setNextResponse(node.getNextResponse().children[0].children[0])
          this.addMessageToState(message2,node);
          //continute to accuracy phase

          node.incCountNotFits(node.getCountNotFits());
          this.handleJob(node,["No jobs"]);
        }

      } else {
        console.log("Error getting matching jobs: ", response.data.message);
      }
    })
    .catch((err) => {
      console.log("Error getting matching jobs: ", err.message);
    });

    // //continute
    // var txt2=node.getNextResponse().children[0].children[0].text;
    // const message2 = this.createChatBotMessage(
    //   txt2,
    //   {
    //     widget: "jobs",
    //   }
    // );
    // node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt1,txt2]}])
    // console.log("history ",node.getHistoryChat());
    // node.setNextResponse(node.getNextResponse().children[0].children[0])
    // this.addMessageToState(message2,node);
  }

  handleJob(node,opts){
    var isJobs=1;
    if(opts[0]==="No jobs"){
      opts[0]="Nothing fits";
      isJobs=0;
    }

    if(opts[0]==="Nothing fits"){
      if(node.getCountNotFits()===1){
        var txt=node.getNextResponse().children[0].text;
        const message = this.createChatBotMessage(
          txt,
          {
            widget:"approval"
          }
          );
        this.addMessageToState(message,node);

        //adding the bot message into the end of history
        if(isJobs===1){
          //check if it is a case that user selected 1 or 2 jobs in the first matching jobs
          if(node.getSelectedJobs().length>0){
            opts=node.getSelectedJobs();
            node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt]}])
          }else{
            node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt]}])
          }
        }else{
          var newHistoryArray=node.getHistoryChat();
          var lastBotHistory=newHistoryArray.pop();
          lastBotHistory.bot.push(txt)
          var updatedBotHistory={bot:lastBotHistory.bot}
          node.setHistoryChat([...newHistoryArray,updatedBotHistory])
        }
        node.setNextResponse(node.getNextResponse().children[0])
      }else if(node.getCountNotFits()===2){
        if(isJobs===1){
          this.selfSearch(node,opts[0]);
        }else{
          this.selfSearch(node,{flag:"noJobs"});
        }
      }
    }else if((opts.length<=2)&&(node.getIsJobAccuracy()===0)){//#מה ההבדל בין זה ללמעלה??
      var txt=node.getNextResponse().children[0].text;
      const message = this.createChatBotMessage(
        txt,
        {
          widget:"approval"
        }
        );
      this.addMessageToState(message,node);
      node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt]}])
      node.setNextResponse(node.getNextResponse().children[0])
    }else{
      txt=node.getNextResponse().children[1].text;
      const message = this.createChatBotMessage(
        txt,
        {
          widget: "emailDisplay",
        }
      );
      node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt]}])
      console.log("I chose jobs  ",node.getSelectedJobs());
      node.setNextResponse(node.getNextResponse().children[1])
      this.addMessageToState(message,node);
    }
  }

  handleEmailDisplay(node,opts){
    //user selected 'Just keep going'
    if(opts[0]==="Just keep going"){
      var txt=node.getNextResponse().children[0].text;
      const message = this.createChatBotMessage(
        txt,
        {
          widget: "approval",
        }
      );
      node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt]}])
      console.log("history ",node.getHistoryChat());
      node.setNextResponse(node.getNextResponse().children[0])
      this.addMessageToState(message,node);
    }
    //user selected 'Display choices'
    else if(opts.length===1 && opts.includes("Display my choices again")){
      var txt1=node.getNextResponse().children[1].text;
      const message1=this.createChatBotMessage(
        txt1,
        {
          widget: "displaySelectedJobs",
        }
      );
      this.addMessageToState(message1,node);
      var txt2=node.getNextResponse().children[1].children[0].text;
      const message2=this.createChatBotMessage(
        txt2,
        {
          widget: "approval",
        }
      );
      node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt1,txt2]}])
      console.log("history ",node.getHistoryChat());
      node.setNextResponse(node.getNextResponse().children[1].children[0])
      this.addMessageToState(message2,node);
    }
    //user selected 'Email them to me'
    else if((opts.length===1 && opts.includes("Email them to me"))){
      var txt=node.getNextResponse().children[2].text;
      const message=this.createChatBotMessage(
        txt,
        {
          widget: "email",//enter email
        }
      );
      node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt]}])
      console.log("history ",node.getHistoryChat());
      node.setNextResponse(node.getNextResponse().children[2])
      this.addMessageToState(message,node);
    }
    //user selected 'Display choices and Email them to me'
    else {
      var txt1=node.getNextResponse().children[3].text;
      const message1 = this.createChatBotMessage(
        txt1,
        {
          widget: "displaySelectedJobs",
        }
      );
      this.addMessageToState(message1,node);

      var txt2=node.getNextResponse().children[3].children[0].text;
      const message2 = this.createChatBotMessage(
        txt2,
        {
          widget: "email",//enter email
        }
      );
      node.setHistoryChat([...node.getHistoryChat(),{user:opts},{bot:[txt1,txt2]}])
      console.log("history ",node.getHistoryChat());
      node.setNextResponse(node.getNextResponse().children[3].children[0])
      this.addMessageToState(message2,node);
    }
  }

  handleEmail(node,email){
    console.log("email: ",email,"sended")
    if(email===""){
      var txt=node.getNextResponse().children[0].children[0].text;
      const message = this.createChatBotMessage(
        txt,
        {
          widget: "approval",
        }
      );
      node.setHistoryChat([...node.getHistoryChat(),{user:email},{bot:[txt]}])
      console.log("history ",node.getHistoryChat());
      node.setNextResponse(node.getNextResponse().children[0].children[0])
      this.addMessageToState(message,node);
    }else {
      // const nodemailer = require('nodemailer');
  
      // // create reusable transporter object using the default SMTP transport
      // let transporter = nodemailer.createTransport({
      //     host: 'smtp.gmail.com',
      //     port: 587,
      //     secure: false,
      //     auth: {
      //         user: 'your_email@gmail.com',
      //         pass: 'your_email_password'
      //     }
      // });
  
      // // setup email data with unicode symbols
      // let mailOptions = {
      //     from: 'your_email@gmail.com', // sender address
      //     to: 'recipient_email@example.com', // list of receivers
      //     subject: 'Test email', // Subject line
      //     text: 'Hello world!', // plain text body
      //     html: '<b>Hello world!</b>' // html body
      // };
  
      // // send mail with defined transport object
      // transporter.sendMail(mailOptions, (error, info) => {
      //     if (error) {
      //         return console.log(error);
      //     }
      //     console.log('Message sent: %s', info.messageId);
      // });
      // //option 2
      // axios.post('/send-email', {
      //   email: email
      // }, {
      //   headers: {
      //   'Content-type': 'application/json; charset=UTF-8' } 
      // })
      // .then((response) => {
      //   console.log(response.data.message);
      // })
      // .catch((error) => {
      //   console.error(error.response.data.error);
      // });
      var txt1=node.getNextResponse().children[0].text;
      const message1 = this.createChatBotMessage(txt1);
      this.addMessageToState(message1,node);
  
      var txt2=node.getNextResponse().children[0].children[0].text;
      const message2 = this.createChatBotMessage(
        txt2,
        {
          widget: "approval",
        }
      );
      node.setHistoryChat([...node.getHistoryChat(),{user:email},{bot:[txt1,txt2]}])
      console.log("history ",node.getHistoryChat());
      node.setNextResponse(node.getNextResponse().children[0].children[0])
      this.addMessageToState(message2,node);
    }
  }

  handleAccuracyLevel(node,opts){
    var tempNodeObject={...node.getAccuracyNode()}
    node.setNextResponse(tempNodeObject)
    if(opts.includes("Experience level")){
      this.experienceWidget(node)
    }else if(opts.includes("Desired city")){
      this.cityWidget(node)
    }else if(opts.includes("Job title")){
      this.jobTitleTypingWidget(node)
    }else{
      console.log("server match");
      this.accurateJobsWidget(node)
    }
  }

  experienceWidget(node){
    var txt=node.getNextResponse().children[2].text;
    const message = this.createChatBotMessage(
      txt,
      {
        widget: "experienceLevel",
      }
    );
    node.setHistoryChat([...node.getHistoryChat(),{bot:[txt]}])
    // console.log("history ",node.getHistoryChat());
    node.setNextResponse(node.getNextResponse().children[2])
    this.addMessageToState(message,node);
  }

  handleExperienceLevel(node,opts){
    if(opts[0]!=="Other"){
      node.setIsJobAccuracy(1);
    }
    node.setSelected({...node.getSelected(),"experience level":opts})
    node.setHistoryChat([...node.getHistoryChat(),{user:opts}])
    console.log("history in hanExp ",node.getHistoryChat());
    //remove 'Experience level' from the selected accuracy levels and handle additional widgets of accuracy levels
    node.setAccuracyOptions(node.getAccuracyOptions().filter((selectedOption) => selectedOption !== "Experience level"))
    this.handleAccuracyLevel(node,node.getAccuracyOptions())
  }

  cityWidget(node){
    var txt=node.getNextResponse().children[1].text;
    const message = this.createChatBotMessage(
      txt,
      {
        widget: "cities",
      }
    );
    node.setHistoryChat([...node.getHistoryChat(),{bot:[txt]}])
    node.setNextResponse(node.getNextResponse().children[1])
    console.log("history in cityWidget ",node.getHistoryChat());
    this.addMessageToState(message,node);   
  }

  handleCities(node,opts){
    if(opts[0]!=="Other"){
      node.setIsJobAccuracy(1);
    }
    node.setSelected({...node.getSelected(),"cities":opts})
    node.setHistoryChat([...node.getHistoryChat(),{user:opts}])
    console.log("history in hanCities ",node.getHistoryChat());
    //remove 'Desired city' from the selected accuracy levels and handle additional widgets of accuracy levels
    node.setAccuracyOptions(node.getAccuracyOptions().filter((selectedOption) => selectedOption !== "Desired city"))
    this.handleAccuracyLevel(node,node.getAccuracyOptions())
  }

  requirementsWidget(node){
    var txt=node.getNextResponse().children[1].text;
    const message = this.createChatBotMessage(txt);
    node.setHistoryChat([...node.getHistoryChat(),{bot:[txt]}])
    node.setNextResponse(node.getNextResponse().children[1])
    console.log("history in requirementsWidget ",node.getHistoryChat());
    node.setIsRequirements(1);
    this.addMessageToState(message,node); 
  }

  handleRequirements(node,msg){
    document.documentElement.style.setProperty('--button-visibility', 'hidden');
    //typing about job requirements is stopped 
    node.setIsRequirements(0);

    //unclear-->0 ???????
    node.setIsJobAccuracy(1);

    node.setSelected({...node.getSelected(),"job Requirements":msg})
    node.setHistoryChat([...node.getHistoryChat(),{user:[msg]}])
    console.log("history in handleRequirements ",node.getHistoryChat());
    console.log("selected in handleRequirements ",node.getSelected());
    //remove 'Job requirements' from the selected accuracy levels and handle additional widgets of accuracy levels
    // node.setAccuracyOptions(node.getAccuracyOptions().filter((selectedOption) => selectedOption !== "Job requirements"))
    // this.handleAccuracyLevel(node,node.getAccuracyOptions())

    var txt=node.getNextResponse().children[0].text;
    const message = this.createChatBotMessage(
      txt,
      {
        widget: "accuracyLevel",
      }
    );
    node.setHistoryChat([...node.getHistoryChat(),{bot:[txt]}]);
    console.log("history ",node.getHistoryChat());
    node.setNextResponse(node.getNextResponse().children[0])
    this.addMessageToState(message,node);
  }

  jobTitleTypingWidget(node){
    var txt=node.getNextResponse().children[3].text;
    const message = this.createChatBotMessage(txt, {
      widget: "jobTitleTyping",
    });
    node.setHistoryChat([...node.getHistoryChat(),{bot:[txt]}])
    node.setNextResponse(node.getNextResponse().children[3])
    console.log("history in jobTitleTypingWidgetTyping ",node.getHistoryChat());
    this.addMessageToState(message,node); 
  }
  handleJobTitleTyping(node,msg){
    //unclear-->0 ???????
    node.setIsJobAccuracy(1);

    node.setSelected({...node.getSelected(),"additional job title":msg})
    node.setHistoryChat([...node.getHistoryChat(),{user:[msg]}])
    console.log("history in handleIsJobTitleTyping ",node.getHistoryChat());
    console.log("selected in handleIsJobTitleTyping ",node.getSelected());
    //remove 'Job title' from the selected accuracy levels and handle additional widgets of accuracy levels
    node.setAccuracyOptions(node.getAccuracyOptions().filter((selectedOption) => selectedOption !== "Job title"))
    this.handleAccuracyLevel(node,node.getAccuracyOptions())
  }

  accurateJobsWidget(node){
    //asking to wait
    var txt1=node.getNextResponse().children[0].text;
    const message1 = this.createChatBotMessage(txt1);
    this.addMessageToState(message1,node);

    //server calculating jobs...
    console.log("new selected ",node.getSelected())
    var responses = node.getSelected()
    axios.post("/getsecondjobs", {
      responses: responses
    }, {
      headers: {
      'Content-type': 'application/json; charset=UTF-8' } 
    })
    
    .then((response) => {
      if (response.data.success) {
        console.log("Server returned matching jobs:", response.data.list_jobs);
        // Add a message for each job to the chatbot's message history
        // response.data.list_jobs.forEach((job) => {
        //   const jobMessage = this.createChatBotMessage(
        //     `Job title: ${job.job}\nCompany: ${job.company}\nLocation: ${job.city}`
        //   );
        //   this.addMessageToState(jobMessage,node);
        // });
        // while(response.data.list_jobs===[]){}

        // node.setJobs(response.data.list_jobs);
        
        node.setJobs(response.data.list_jobs.map((job,index) =>{
          if(!job._id){
            var _id=(index+20).toString();
            return {...job,"_id":_id};
          }else{
            return job;
          }
        }));
        //node.setJobs(["K","L","M","N","O","P","Q","R","S","T","Nothing fits"]);
        if(node.getSavedInDB()["displayed jobs"]){
          node.setSavedInDB({...node.getSavedInDB(),"displayed jobs":node.getSavedInDB()["displayed jobs"].concat(node.getJobs())});
        }else{
          node.setSavedInDB({...node.getSavedInDB(),"displayed jobs":node.getJobs()});
        }
        
        //לא לשכוח לשרשר את העבודות החדשות שהוצעו????????אולי לעשות רשימה חדשה שהיא העבודות סבב 2
        //continute
        if(response.data.list_jobs.length!==0){
          if(response.data.list_jobs.length>1){
            var txt2=`With all the information you provided me, I find for you these top ${response.data.list_jobs.length} jobs`;
            const message2 = this.createChatBotMessage(txt2)
            this.addMessageToState(message2,node);
          }
          var txt3=node.getNextResponse().children[0].children[0].text;
          const message3 = this.createChatBotMessage(
            txt3,
            {
              widget: "jobs",
            }
          );
          if(response.data.list_jobs.length>1){
            node.setHistoryChat([...node.getHistoryChat(),{bot:[txt1,txt2,txt3]}])
          }else{
            node.setHistoryChat([...node.getHistoryChat(),{bot:[txt1,txt3]}])
          }
          console.log("history in accurate jobs handle ",node.getHistoryChat());
          node.setNextResponse(node.getNextResponse().children[0].children[0])
          this.addMessageToState(message3,node);
        }else{
          var txt2="No jobs found";
          const message2 = this.createChatBotMessage(txt2);
          node.setHistoryChat([...node.getHistoryChat(),{bot:[txt1,txt2]}])
          console.log("history ",node.getHistoryChat());
          node.setNextResponse(node.getNextResponse().children[0].children[0])
          this.addMessageToState(message2,node);

          //continute to accuracy phase
          node.incCountNotFits(node.getCountNotFits());
          this.handleJob(node,["No jobs"]);
        }

      } else {
        console.log("Error getting matching jobs: ", response.data.message);
      }
    })
    .catch((err) => {
      console.log("Error getting matching jobs: ", err.message);
    });
  }

  addMessageToState = (message,node) => {
    this.setState((prevState) =>{
      return {
        ...prevState,
        messages: [...prevState.messages, message],
        head: node
        };
    });
  };
}

export default ActionProvider;
