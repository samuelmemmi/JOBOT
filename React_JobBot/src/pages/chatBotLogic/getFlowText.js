import chatFlow from "./convert_tree_to_json";

class FetchText{
    constructor(){
        this.head=chatFlow;
        this.selected={}
        this.historyChat=[]
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
}

var dec_tree=new FetchText();
export default dec_tree;