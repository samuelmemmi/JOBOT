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

    if (this.props.head&&this.props.head.getIsFeedback()===1) {//&&lowercase.includes("bad navigation")
      //server
      this.actionProvider.selfSearch(this.props.head, message);
    }

    if(this.props.head&&this.props.head.getIsRequirements()===1){
      this.actionProvider.handleRequirements(this.props.head, message);
    }
  }
}

export default MessageParser;
