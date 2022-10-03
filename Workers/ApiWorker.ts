import {Worker, isMainThread, parentPort} from "worker_threads";
import { SearchVideo } from "../Api/Api";
import { ChangeTimeStampApi, GetUserDataApi, IsUserConnectedApi } from "../Api/DataApi";

async function Search(): Promise<void> {


    const Data = JSON.parse(process.argv[2]);
    const UserData =  await GetUserDataApi(Data._ID);

    console.log(UserData);


    if(Data._ID != UserData._id) throw new Error("Queue id is not equal to UserDataBase id");

    const isConnected = await IsUserConnectedApi(Data._ID);

    if(!isConnected) {
        process.send!({MESSAGE: "USER IS DISCONNECTED!", DATA: null});
        return;
    }

    const SearchResponse = await SearchVideo(Data.QUESTION);

    console.log("RES: " + SearchResponse);
 
    console.log("DURATION: " + SearchResponse.DURATION);
    console.log("ID: " + UserData._id);

    await ChangeTimeStampApi(UserData._id, SearchResponse.DURATION);


    process.send!({"MESSAGE": "OPERATION SUCESS!", "DATA": SearchResponse, "UUID": UserData._id});

    return;
}

async function StartFunc(){
    await Search();
}

StartFunc(); 