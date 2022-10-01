import { GeneralSettings, SocketServerSettings } from "../Settings/Settings";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { CreateStreamingFile, CreateUserDir, DeleteUserDir } from "../FileOperations/FileOP";
import {Worker, isMainThread, parentPort} from "worker_threads";
import { AddUserApi, EnqueueOpApi, RemoveUserApi } from "../Api/DataApi";
import { exec, fork, spawn } from "child_process";


const PORT = SocketServerSettings.port;
const ExpressMiddleware = express();
const server = http.createServer(ExpressMiddleware);

ExpressMiddleware.use(cors());

const SocketServer = new Server(server, {
    cors: {
        origin: "*"
    }
});

ExpressMiddleware.get("/",(req,res)=>{
  res.sendFile(__dirname + "/Client.html");
});


SocketServer.on("connection",async (socket)=>{

    console.log("A new User is Connected");

    socket.on(SocketServerSettings.NewVideoCommand,async (arg)=>{

        console.log(arg);

        const QueueItem: QueueItem = {_ID: socket.id, URL: null, QUESTION: arg.value};

        await EnqueueOpApi("api",QueueItem);

         const API = fork(GeneralSettings.path+"/Workers/ApiWorker.js");

         API.on("message",async (message)=>{

            const stringMessage = JSON.stringify(message);

            const Message = JSON.parse(stringMessage);

            if(Message.MESSAGE == "USER IS DISCONNECTED!"){
                await DeleteUserDir(Message.DATA.ID);

                return;
             }

             const VideoItem: QueueItem = {
              _ID: Message.DATA.ID!,
              URL: Message.DATA.URL!,
              QUESTION: arg.value
             }

             SocketServer.to(Message.UUID).emit(SocketServerSettings.SendTimeStampsCommand, {question: arg.value, TimeStamp: Message.DATA.DURATION})

             const VideoProcess = fork(GeneralSettings.path+"/Workers/DownloadWorker.js");

             VideoProcess.on("message",async (message)=>{
               const StringMessage = JSON.stringify(message);
               const Message = JSON.parse(StringMessage);

               if(Message.detail == "First Segments are loaded" && arg.isFirstVideo){
                SocketServer.to(Message._id).emit(SocketServerSettings.StartClientPlayerCommand);
            }

            if(Message.detail == "User is disconnected"){
                   
                 DeleteUserDir(Message._id);

                console.log("User " + Message._id + " is Discconected!");

                return;
            }

            if(Message.detail == "DownLoadingConverting Finish") {

                const AiItem: QueueItem = {
                    _ID:  socket.id,
                    URL: null,
                    QUESTION: arg.value

                }

                await EnqueueOpApi("ai", AiItem);
                    
                const AI = fork(GeneralSettings.path+"/Workers/AiWorker.js");

                AI.on("message",(message)=>{
                    const StringMessage = JSON.stringify(message);
                    const Message = JSON.parse(StringMessage);
                    SocketServer.to(Message._ID).emit(SocketServerSettings.CheckQuestCommand, {Question: Message.newQuestion, BeforeQuestion: arg.value});
                    return;
                });
            };
             });

         })
         });

 
    await AddUserApi(socket.id);
    await CreateUserDir(socket.id);
    await CreateStreamingFile(socket.id);
    

    if(!isMainThread) throw new Error("MainServer File have to on MainThread!");


    socket.on("disconnect",async ()=>{

        await RemoveUserApi(socket.id);
     
        console.log("DISCONNECT");
     
        setTimeout(async () => {
         await DeleteUserDir(socket.id);
         
        }, 1000);
     
     });

     

});



server.listen(PORT,async ()=>{
console.log("Pogramm sucessfull Started");
console.log("Server Listen on port %d", PORT );
});
