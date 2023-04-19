import chatFlow from "./convert_tree_to_json";
import axios from 'axios';

class FetchText{
    constructor(){
        this.head={}
        this.selected={}
        this.historyChat=[]
        this.jobs=[]
        this.selectedJobs=[]
        this.countNotFits=0;
        this.isFeedback=0;
        //this.approval={"savingDetails":0,"accurateMatch":0,"viewAdditionalJobs":0};
        this.accuracyNode={}
        this.accuracyOptions=[]
        this.isJobAccuracy=0;
        this.isRequirements=0;
        ///////חייב לשמור את פרטי המשרות שהלקוח סך הכל בחר בDB
    }

    intialHead(){
        try {
            this.head = require('./decisionTree.json');
          } catch (error) {
            //console.error(`Error loading data: ${error}`);
            this.head = chatFlow;
            axios.post('/write-json', this.head, {
                headers: {
                'Content-type': 'application/json; charset=UTF-8' } 
              })
              .then((response) => {
                console.log(response.data.message);
              })
              .catch((error) => {
                console.error(error.response.data.error);
              });
          }
    }

    setNextResponse(node){
        this.head=node;
    }

    getNextResponse(){
        return this.head;
    }

    setSelected(selected){
        this.selected=selected;
    }

    getSelected(){
        return this.selected;
    }

    setHistoryChat(historyChat){
        this.historyChat=historyChat;
    }

    getHistoryChat(){
        return this.historyChat;
    }
    setJobs(jobs){
        this.jobs=jobs;
    }

    getJobs(){
        return this.jobs;
    }
    setSelectedJobs(selectedJobs){
        this.selectedJobs=selectedJobs;
    }

    getSelectedJobs(){
        return this.selectedJobs;
    }

    incCountNotFits(countNotFits){
        this.countNotFits=countNotFits+1;
    }

    getCountNotFits(){
        return this.countNotFits;
    }

    setIsFeedback(val){
        this.isFeedback=val;
    }

    getIsFeedback(){
        return this.isFeedback;
    }
    setAccuracyNode(accuracyNode){
        this.accuracyNode=accuracyNode;
    }

    getAccuracyNode(){
        return this.accuracyNode;
    }
    setAccuracyOptions(accuracyOptions){
        this.accuracyOptions=accuracyOptions;
    }

    getAccuracyOptions(){
        return this.accuracyOptions;
    }
    setIsJobAccuracy(isJobAccuracy){
        this.isJobAccuracy=isJobAccuracy;
    }

    getIsJobAccuracy(){
        return this.isJobAccuracy;
    }
    setIsRequirements(isRequirements){
        this.isRequirements=isRequirements;
    }

    getIsRequirements(){
        return this.isRequirements;
    }
}

var dec_tree=new FetchText();
dec_tree.intialHead()
export default dec_tree;