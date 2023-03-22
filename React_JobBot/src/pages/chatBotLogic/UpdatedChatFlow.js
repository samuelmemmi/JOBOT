import chatFlow from "./convert_tree_to_json";

class UpdatedChatFlow{
    constructor(){
        this.chatFlow=chatFlow;
    }

    setChatFlow(chatFlow){
        this.chatFlow=chatFlow;
    }

    getChatFlow(){
        return this.chatFlow;
    }
}

var updated_dec_tree=new UpdatedChatFlow();
export default updated_dec_tree;