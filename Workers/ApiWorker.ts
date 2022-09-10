import {Worker, isMainThread, parentPort} from "worker_threads";
import { SearchVideo } from "../Api/Api";
import { DequeueApiQueue, EnqueueVideoQueue } from "../DataStructures/Queue";
import { ChangeTimeStamp, GETUserData, IsUserConnected } from "../DataStructures/UserDictonary";

async function Search(): Promise<void> {
    const Data = DequeueApiQueue();
    const UserData = GETUserData(Data._ID);

    if(Data._ID != UserData.id) throw new Error("Queue id is not equal to UserDataBase id");

    if(!IsUserConnected(Data._ID) && !isMainThread) {
       parentPort?.postMessage({_id: Data._ID, detail: "User is Disconnected"});
       return;
    };

    const SearchResponse = await SearchVideo(Data.QUESTION);

    const VIDEO_Queue_Element: QueueItem = {_ID: Data._ID, URL: SearchResponse.URL, QUESTION: Data.QUESTION};
 
    EnqueueVideoQueue(VIDEO_Queue_Element);

    ChangeTimeStamp(UserData._id, SearchResponse.DURATION);


    if(!isMainThread){
        parentPort?.postMessage({_ID: Data._ID, QUESTION: Data.QUESTION, URL: Data.URL, TIMESTAMP: SearchResponse.DURATION, detail: "API Worker Ended"});
    }

    return;
}


Search();