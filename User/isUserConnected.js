
const {QueueOperations} = require("../DataStructures/Queue.js");

function UserConnectionState(id){
   const QOP = new QueueOperations();
   const result = QOP.Get(id);

   if(!result) return false;

   return true;
}


function changeState(state, id){
    const QOP = new QueueOperations();
    QOP.changeState(state, id);

    return;
}

module.exports = {UserConnectionState, changeState};