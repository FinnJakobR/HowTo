import {Worker, isMainThread, parentPort} from "worker_threads";
import { GenerateNewWord } from "../AI/OpenAi";
import { DequeueOpApi, EnqueueOpApi, IsUserConnectedApi } from "../Api/DataApi";


async function CreateNewQuestion() : Promise<any> {
   
    const Data = await DequeueOpApi("ai");
    const isConnected = await IsUserConnectedApi(Data._ID);

    if(!isConnected) {
       process.send!({_id: Data._ID, detail: "User is disconnected"});
       return;
    };

    const newQuestion = await GenerateNewWord(Data.QUESTION);

    const API_Queue_Element: QueueItem = {_ID: Data._ID, URL: null, QUESTION: newQuestion!};

    process.send!({_ID: Data._ID, newQuestion: newQuestion, detail: "AI_WORKER_ENDED"});

    await EnqueueOpApi("api",API_Queue_Element);

    return
}


CreateNewQuestion();