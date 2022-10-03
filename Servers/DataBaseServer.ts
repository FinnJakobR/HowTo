import bodyParser from "body-parser";
import  express  from "express";
import { GetGeneratedPrompt, SaveInDict } from "../DataStructures/Dictonary";
import { DeleteUserFromQueue, DequeueAIQueue, DequeueApiQueue, DequeueVideoQueue, EnqueueApiQueue, EnqueueInQueue, EnqueueVideoQueue } from "../DataStructures/Queue";
import { AddFileStream, AddVideoToUser, ADD_User, ChangeTimeStamp, GetIndexLength, GetStream, GETUserData, isAllreadyRequested, IsUserConnected, RemoveUser } from "../DataStructures/UserDictonary";
import { DataBaseServerSettings } from "../Settings/Settings";

// 1. Queue


const PORT = DataBaseServerSettings.port;

const DataBaseServer = express();

DataBaseServer.use(bodyParser.json());


DataBaseServer.get("/QUEUE/:ID/DELETE_USER", (req,res)=>{
  const _id = req.params.ID;

  DeleteUserFromQueue(_id);

  return res.status(200).send({CODE: 200, MESSAGE: "Delte from Queue Operation sucessfull!", DATA: null});


});




DataBaseServer.get("/QUEUE/:QUEUE_TYPE/DEQUEUE/",(req,res)=>{

  console.log("HELLO");
   
   const type = req.params.QUEUE_TYPE.toLowerCase();

   if(type.toLowerCase() != "ai" && type.toLowerCase() != "api" && type.toLowerCase() != "video"){
    res.send({CODE: 404, MESSAGE: "Given Queue Name is not found"});
    return;
   }

    if(type == "api"){
        const Data = DequeueApiQueue();

        res.status(200).send({CODE: 200, MESSAGE: "Queue operation sucess!", DATA: Data});
        return;
    }

    if(type == "ai"){
      const Data = DequeueAIQueue();
      res.status(200).send({CODE: 200, MESSAGE: "Queue operation sucess!", DATA: Data});
        return;
    }

    if(type == "video"){
      const Data = DequeueVideoQueue();
      res.status(200).send({CODE: 200, MESSAGE: "Queue operation sucess!", DATA: Data});
        return;
    }

});

DataBaseServer.post("/QUEUE/:QUEUE_TYPE/:OPERATION",(req,res)=>{

  console.log(req.params.QUEUE_TYPE.toLowerCase());
    const type = req.params.QUEUE_TYPE.toLowerCase();
    const operation = req.params.OPERATION;
    const Body: QueueItem = req.body!; 

    console.log(operation);
 
    if(type.toLowerCase() != "ai" && type.toLowerCase() != "api" && type.toLowerCase() != "video"){
     res.send({CODE: 404, MESSAGE: "Given Queue Name is not found"});
     return;
    }
 
    if(operation.toLowerCase() != "enqueue") {
     res.send({CODE: 404, MESSAGE: "queue operation not Found for a get Request"});
     return;
    }

    console.log("ENQUEUE OPERATION");

    if(type == "ai"){

        EnqueueInQueue(Body);
       
        res.send({CODE: 200, MESSAGE: "Queue operation sucess!", DATA: null});
        return;
    }


    if(type == "api"){

      console.log("HELLO");

        EnqueueApiQueue(Body);
       
        res.send({CODE: 200, MESSAGE: "Queue operation sucess!", DATA: null});
        return;
    }

    if(type == "video"){
        
        EnqueueVideoQueue(Body);

        res.send({CODE: 200, MESSAGE: "Queue operation sucess!", DATA: null});
        return;
    }

    throw Error("ERROR");

});


DataBaseServer.post("/DICTONARY/:OPERATION",(req,res)=>{
  
    const operation = req.params.OPERATION.toLowerCase();
    const Body = req.body;

    if(operation != "saveprompt" && operation != "getprompt"){
        res.send({CODE: 404, MESSAGE: "operation not Found!" });
        return;
    }

    if((operation == "saveprompt" && !Body.generatedPrompt) || (operation == "saveprompt" && !Body.prompt)){
        res.send({CODE: 400, MESSAGE: "Body is not Valid!"});
        return;
    }

    if((operation == "getprompt" && !Body.prompt) ){
        res.send({CODE: 400, MESSAGE: "Body is not Valid!"});
        return;
    }

    if(operation == "saveprompt"){
        SaveInDict(Body.prompt, Body.generatedPrompt);
        res.send({CODE: 200, MESSAGE: "Save Prompt sucess"});
        return;
    }

    if(operation == "getprompt"){
       const Data = GetGeneratedPrompt(Body.prompt)
        res.send({CODE: 200, MESSAGE: "Get Prompt sucess", prompt: Data});
        return;
    }


});


DataBaseServer.post("/USERDATABASE/:USER_ID/:OPERATION",(req,res)=>{
  const operation = req.params.OPERATION.toLowerCase();
  const Body = req.body;
  const _id = req.params.USER_ID;


  console.log("Operation: " + operation);

  if(operation != "changetimestamp" && operation != "getindexlength" && operation != "isallreadyrequested" && operation != "adduser" && operation != "addvideotouser" && operation != "isuserconnected" && operation != "removeuser" && operation != "getuserdata" && operation != "addfilestream" && operation != "getstream"){
    res.send({CODE: 400, MESSAGE: "UserDatabase operation not found!"});
    return;
  }

  if(operation == "changetimestamp"){

    if(!IsUserConnected(_id)) {
    return  res.send({CODE: 400, MESSAGE: "User is Disconnected"});
    }

    console.log("SENDED TIMESTAMP: " + Body.newTimeStamp);
    ChangeTimeStamp(_id, Body.newTimeStamp - 1000); //-1000 because of 0MS;

    res.send({CODE: 200, MESSAGE: "Operation Sucess"});

    return;
  }

  if(operation == "getindexlength"){

    if(!IsUserConnected(_id)) {
      return  res.send({CODE: 400, MESSAGE: "User is Disconnected"});
      }

    const Data = GetIndexLength(_id, Body.index);
    res.send({CODE: 200, MESSAGE: "Operation Sucess", DATA: Data});
    return;
  }

  if(operation == "adduser"){
    
    ADD_User(_id);

    res.send({CODE: 200, MESSAGE: "User Added!"});

    return;
  }

  if(operation == "addvideotouser"){

    if(!IsUserConnected(_id)) {
      return  res.send({CODE: 400, MESSAGE: "User is Disconnected"});
      }

    AddVideoToUser(_id);
    res.send({CODE: 200, MESSAGE: "Operation Success"});

    return;
  }

  if(operation == "isallreadyrequested"){

    if(!IsUserConnected(_id)) {
      return  res.send({CODE: 400, MESSAGE: "User is Disconnected"});
      }

    const isReq = isAllreadyRequested(_id, Body.FileName);
    
    res.send({CODE: 200, MESSAGE: "Operation Success", ISREQ: isReq});

    return;
  }

  if(operation == "isuserconnected"){

    const isUserCon = IsUserConnected(_id);
    res.send({CODE: 200, MESSAGE: "Operation Success", ISUSERCON: isUserCon});
    return;
  }

  if(operation == "removeuser"){

    if(!IsUserConnected(_id)) {
      return  res.send({CODE: 400, MESSAGE: "User is Disconnected"});
      }

    RemoveUser(_id);
    
    res.send({CODE: 200, MESSAGE: "Operation Success"});

    return;
  }

  if(operation == "getuserdata"){
    
    if(!IsUserConnected(_id)) {
      return  res.send({CODE: 400, MESSAGE: "User is Disconnected"});
      }

    const Data = GETUserData(_id);

    res.send({CODE: 200, MESSAGE: "operation Success", DATA: Data});
    return;
  }

  if(operation == "addfilestream"){

    if(!IsUserConnected(_id)) {
      return  res.send({CODE: 400, MESSAGE: "User is Disconnected"});
      }
    
    AddFileStream(_id);

    res.send({CODE: 200, MESSAGE: "operation Success"});
    return;
  }


  if(operation == "getstream"){

    if(!IsUserConnected(_id)) {
      return  res.send({CODE: 400, MESSAGE: "User is Disconnected"});
      }
      
      const stream = GetStream(_id);
      res.send({CODE: 200, MESSAGE: "operation Success", STREAM: stream}); 

      return;
  }
})





DataBaseServer.listen(PORT, ()=>{
    console.log("DataBaseServer started!");
})



