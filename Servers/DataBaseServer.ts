import bodyParser from "body-parser";
import  express  from "express";
import { GetGeneratedPrompt, SaveInDict } from "../DataStructures/Dictonary";
import { AddFileStream, AddVideoToUser, ADD_User, ChangeTimeStamp, GetIndexLength, GetStream, GETUserData, isAllreadyRequested, IsUserConnected, RemoveUser } from "../DataStructures/UserDictonary";
import { DataBaseServerSettings } from "../Settings/Settings";

// 1. Queue


const PORT = DataBaseServerSettings.port;

const DataBaseServer = express();

DataBaseServer.use(bodyParser.json());



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


  if(operation != "changetimestamp" && operation != "getindexlength" && operation != "isallreadyrequested" && operation != "adduser" && operation != "addvideotouser" && operation != "isuserconnected" && operation != "removeuser" && operation != "getuserdata" && operation != "addfilestream" && operation != "getstream"){
    res.send({CODE: 400, MESSAGE: "UserDatabase operation not found!"});
    return;
  }

  if(operation == "changetimestamp"){

    if(!IsUserConnected(_id)) {
    return  res.send({CODE: 400, MESSAGE: "User is Disconnected"});
    }
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



