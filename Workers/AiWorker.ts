import {Worker, isMainThread, parentPort} from "worker_threads";
import { GenerateNewWord } from "../AI/OpenAi";
import { DequeueAIQueue, EnqueueApiQueue } from "../DataStructures/Queue";
import { IsUserConnected } from "../DataStructures/UserDictonary";

async function CreateNewQuestion() : Promise<any> {
   
    const Data = DequeueAIQueue();

    if(!IsUserConnected(Data._ID) && !isMainThread) {
       parentPort?.postMessage({_id: Data._ID, detail: "User is disconnected"});
       return;
    };

    const newQuestion = await GenerateNewWord(Data.QUESTION);

    const API_Queue_Element: QueueItem = {_ID: Data._ID, URL: null, QUESTION: newQuestion!};

    if(!isMainThread){
        parentPort?.postMessage({_ID: Data._ID, newQuestion: newQuestion, detail: "AI_WORKER_ENDED"});
    }

    EnqueueApiQueue(API_Queue_Element);


    return
}


CreateNewQuestion();