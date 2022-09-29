import axios from "axios";
import { DataBaseServerSettings } from "../Settings/Settings";

const ServerPort = DataBaseServerSettings.port;
const ServerHostName = DataBaseServerSettings.hostname;

const Main_Url = ServerHostName + ":" + ServerPort + "/";


export async function DequeueOpApi(type: string) :Promise<QueueItem>{

    const res = await axios.get(Main_Url + "QUEUE/" + type.toUpperCase() + "/DEQUEUE");
    
    return res.data.DATA;

}

export async function EnqueueOpApi(type:string, Data: QueueItem): Promise<void> {

     const data = await axios.post(Main_Url + "QUEUE/" + type.toUpperCase() + "/ENQUEUE",Data);

    return;
}


export async function SavePromptApi(prompt: string, generatedPrompt: string) {

    const Body = {
      prompt: prompt,
      generatedPrompt: generatedPrompt
    } 

    await axios.post(Main_Url + "DICTONARY/" + "SAVEPROMPT", Body);

    return;
}

export async function GetPromptApi(prompt: string) {

    const Body = {
        prompt: prompt
    }

   const res = await axios.post(Main_Url + "DICTONARY/" + "GETPROMPT", Body);

    return res.data.prompt;
}

export async function ChangeTimeStampApi(_id:string, newTimeStamp: number) {
    const Body = {
        newTimeStamp: newTimeStamp
    }

    await axios.post(Main_Url + "USERDATABASE/" + _id + "/newTimeStamp", Body);

    return;
}

export async function GetIndexLengthApi(_id:string, index: number) {
 const Body = {
    index: index
 }

 const res = await axios.post(Main_Url + "USERDATABASE/" + _id + "/GETINDEXLENGTH", Body);
 return res.data!.DATA;
}

export async function AddUserApi(_id:string) {

    const Body = {};

    const res = await axios.post(Main_Url + "USERDATABASE/" + _id + "/addUser", Body);

    return;
}

export async function addVideoToUserApi(_id:string) {
    
    const Body = {};

    const res = await axios.post(Main_Url + "USERDATABASE/" + _id + "/AddVideoToUser", Body);

    console.log(res);
    return;
}

export async function IsAllreadyRequestedApi(_id:string, FileName: string): Promise<boolean> {
    const Body = {
        FileName: FileName
    };

   const res =  await axios.post(Main_Url + "USERDATABASE/" + _id + "/IsAllreadyRequested", Body);

   return res.data.ISREQ;
}

export async function IsUserConnectedApi(_id: string): Promise<boolean> {
    
    const Body = {};

    const res = await axios.post(Main_Url + "USERDATABASE/" + _id + "/isuserconnected", Body);

    return res.data.ISUSERCON;
}


export async function RemoveUserApi(_id: string): Promise<void> {
    
    const Body = {};

    await axios.post(Main_Url + "USERDATABASE/" + _id + "/RemoveUser", Body);

    return;

}

export async function GetUserDataApi(_id:string) {

    const Body = {};

    const res = await axios.post(Main_Url + "USERDATABASE/" + _id + "/GetUserData", Body);

    return res.data.DATA;
    
}

export async function AddFileStreamApi(_id: string){
    const Body = {};

    await axios.post(Main_Url + "USERDATABASE/" + _id + "/AddFileStream", Body)

    return;
}

export async function GetFileStreamApi(_id:string) {
    const Body = {};

    const res = await axios.post(Main_Url + "USERDATABASE/" + _id + "/getstream", Body);

    console.log(res);

    return res.data.STREAM;

}