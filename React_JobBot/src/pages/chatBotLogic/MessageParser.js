import axios from "axios";

class MessageParser {
  constructor(actionProvider,props) {
    this.actionProvider = actionProvider;
    this.props=props;
  }

  parse(message) {
    console.log(message);
    const lowercase = message.toLowerCase();

    if (lowercase.includes("hello")) {
      this.actionProvider.greet();
    }

    if (lowercase.includes("javascript") || lowercase.includes("js")) {
      this.actionProvider.handleJavascriptQuiz();
    }

    if (this.props.head&&this.props.head.getIsFeedback()===1) {
      document.documentElement.style.setProperty('--button-visibility', 'hidden');
      this.props.head.setSavedInDB({...this.props.head.getSavedInDB(),"feedback on termination":message})
      //call server
      //message:string
    axios.post("/getIsFeedback", {
      message: message
    }, {
      headers: {
      'Content-type': 'application/json; charset=UTF-8' } 
    })
    
    .then((response) => {
      if (response.data.success) {
        console.log("Server returned matching jobs:", response.data.res);

      } else {
        console.log("Error getting matching jobs: ", response.data.res);
      }
    })
    .catch((err) => {
      console.log("Error getting matching jobs: ", err.message);
    });
      //קריאה לסיום
      this.actionProvider.selfSearch(this.props.head, message);
    }

    if(this.props.head&&this.props.head.getIsRequirements()===1){
      this.actionProvider.handleRequirements(this.props.head, message);
    }
  }
}

export default MessageParser;
