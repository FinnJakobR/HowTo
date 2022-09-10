import { SocketServerSettings } from "../Settings/Settings";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { ADD_User, RemoveUser } from "../DataStructures/UserDictonary";
import { CreateStreamingFile, CreateUserDir, DeleteUserDir } from "../FileOperations/FileOP";
import {Worker, isMainThread, parentPort} from "worker_threads";
import { EnqueueApiQueue } from "../DataStructures/Queue";
import { saveFilePromps } from "../DataStructures/Dictonary";


const PORT = SocketServerSettings.port;
const ExpressMiddleware = express();
const server = http.createServer(ExpressMiddleware);
const SocketServer = new Server(server);

ExpressMiddleware.get("/",(req,res)=>{
  
});


SocketServer.on("connection",async (socket)=>{
 
    ADD_User(socket.id);
    CreateUserDir(socket.id);
    CreateStreamingFile(socket.id);
    

    if(!isMainThread) throw new Error("MainServer File have to on MainThread!");

    socket.on(SocketServerSettings.NewVideoCommand,(arg)=>{

        const QueueItem: QueueItem = {_ID: socket.id, URL: null, QUESTION: arg.value};

        EnqueueApiQueue(QueueItem);

        const Api = new Worker("../Workers/ApiWorker.js");

        Api.on("message",(message)=>{

            SocketServer.to(message._id).emit(SocketServerSettings.SendTimeStampsCommand,{question: arg.value, TimeStamp: message.TimeStamp})
            
            const Download = new Worker("../Workers/DownloadWorker.js");

            Download.on("message",(message)=>{
                
                if(message.detail == "First Segments are loaded" && arg.isFirstVideo){
                    SocketServer.to(message._id).emit(SocketServerSettings.StartClientPlayerCommand);
                }

                if(message.detail == "User is disconnected"){
                   
                    DeleteUserDir(message._id);

                    console.log("User " + message._id + " is Discconected!");

                    return;
                }

                if(message.detail == "DownLoadingConverting Finish") {
                    
                    const AI = new Worker("../Workers/AiWorker.js");

                    AI.on("message",(message)=>{
                        SocketServer.to(message._id).emit(SocketServerSettings.CheckQuestCommand, {Question: message.newQuestion, BeforeQuestion: arg.value});
                        return;
                    });
                };

            });
        });
        
    });

});

SocketServer.on("disconnect",(socket)=>{
    
    RemoveUser(socket.id);

});



ExpressMiddleware.listen(PORT,async ()=>{
console.log("Pogramm sucessfull Started");
await saveFilePromps();
});
