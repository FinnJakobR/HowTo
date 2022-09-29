import { CreateVideoOrdner } from "../FileOperations/FileOP";
import {DownloadAndConvertVideo} from "../VideoOps/Download";
import {Worker, isMainThread, parentPort} from "worker_threads";
import { addVideoToUserApi, DequeueOpApi, GetUserDataApi, IsUserConnectedApi } from "../Api/DataApi";

async function Download_ConvertVideo(): Promise<void> {
    const QueueData: NullSave<any> = await DequeueOpApi("video");
    const UserData: NullSave<any> = await GetUserDataApi(QueueData._ID);

    console.log(UserData);
    const Videos: number = UserData.videos;

    if(QueueData._ID != UserData._id) throw Error("Queue ID is not Equal User ID");

    const isConnected = await IsUserConnectedApi(UserData._id);

    if(!isConnected){
       process.send!({_id: UserData._id, detail: "User is disconnected"});
        return;
    }

    await CreateVideoOrdner(Videos, QueueData._ID);

    await DownloadAndConvertVideo(QueueData.URL!, QueueData._ID!, UserData.videos!);

    await addVideoToUserApi(QueueData._ID);

    return;
}


Download_ConvertVideo();

