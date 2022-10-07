import {Worker, isMainThread, parentPort} from "worker_threads";
import { SearchVideo } from "../Api/Api";
import { ChangeTimeStampApi, GetUserDataApi, IsUserConnectedApi } from "../Api/DataApi";
import { updateProgress } from "../Libary/Logger";

async function Search(): Promise<void> {


    const Data = JSON.parse(process.argv[2]);
    const UserData =  await GetUserDataApi(Data._ID);


    updateProgress(Data._ID, "state", "Waiting for Res for Video: " + Data.QUESTION);


    if(Data._ID != UserData._id) throw new Error("Queue id is not equal to UserDataBase id");

    const isConnected = await IsUserConnectedApi(Data._ID);

    if(!isConnected) {
        process.send!({MESSAGE: "USER IS DISCONNECTED!", DATA: null});
        return; 
    }

    const SearchResponse = await SearchVideo(Data.QUESTION);


    await ChangeTimeStampApi(UserData._id, SearchResponse.DURATION);

    updateProgress(Data._ID, "state", "Changed TimeStamp!");


    process.send!({"MESSAGE": "OPERATION SUCESS!", "DATA": SearchResponse, "UUID": UserData._id});

    updateProgress(Data._ID, "state", "Sended To MainServer Api Operation sucess!");

    return;
}

async function StartFunc(){
    await Search();
}

StartFunc(); 