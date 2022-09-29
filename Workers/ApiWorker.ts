import {Worker, isMainThread, parentPort} from "worker_threads";
import { SearchVideo } from "../Api/Api";
import { ChangeTimeStampApi, DequeueOpApi, EnqueueOpApi, GetUserDataApi, IsUserConnectedApi } from "../Api/DataApi";

async function Search(): Promise<void> {
    const Data = await DequeueOpApi("api");
    const UserData =  await GetUserDataApi(Data._ID);

    if(Data._ID != UserData._id) throw new Error("Queue id is not equal to UserDataBase id");

    const isConnected = await IsUserConnectedApi(Data._ID);

    if(!isConnected) {
        process.send!({MESSAGE: "USER IS DISCONNECTED!", DATA: null});
        return;
    }

    const SearchResponse = await SearchVideo(Data.QUESTION);

    const VIDEO_Queue_Element: QueueItem = {_ID: Data._ID, URL: SearchResponse.URL, QUESTION: Data.QUESTION};
 
    await EnqueueOpApi("video",VIDEO_Queue_Element);

    await ChangeTimeStampApi(UserData._id, SearchResponse.DURATION);


    process.send!({"MESSAGE": "OPERATION SUCESS!", "DATA": SearchResponse, "UUID": UserData._id});

    return;
}

async function StartFunc(){
    await Search();
}

StartFunc(); 