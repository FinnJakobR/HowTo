import { DequeueVideoQueue } from "../DataStructures/Queue";
import { AddVideoToUser, GETUserData, IsUserConnected } from "../DataStructures/UserDictonary";
import { CreateVideoOrdner } from "../FileOperations/FileOP";
import {DownloadAndConvertVideo} from "../VideoOps/Download";
import {Worker, isMainThread, parentPort} from "worker_threads";

async function Download_ConvertVideo(): Promise<void> {
    const QueueData: NullSave<any> = DequeueVideoQueue();
    const UserData: NullSave<any> = GETUserData(QueueData._ID);
    const Videos: number = UserData.videos;

    if(QueueData._ID != UserData._id) throw Error("Queue ID is not Equal User ID");

    if(!IsUserConnected(UserData._id) && isMainThread){
        parentPort?.postMessage({_id: UserData._id, detail: "User is disconnected"});
        return;
    }

    await CreateVideoOrdner(Videos, QueueData._ID);

    await DownloadAndConvertVideo(QueueData.URL!, QueueData._ID!, UserData.videos!);

    AddVideoToUser(QueueData._ID);

    return;
}


Download_ConvertVideo();

