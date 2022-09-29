import { io } from "socket.io-client";
import { ReadPromptFile } from "../FileOperations/FileOP";
import { SocketServerSettings } from "../Settings/Settings";

const connection = io("http://localhost:3000");
const Question = "How to play uno";

connection.on("connect_error",(err)=>{
    console.log(err);
    //throw new Error("COULD NOT CONNECT TO SERVER!");
});

const args = {isFirstVideo: true, value: Question};

connection.on("connect",()=>{
    console.log(connection.id);
    connection.emit(SocketServerSettings.NewVideoCommand, args);
});


connection.on(SocketServerSettings.SendTimeStampsCommand,(args)=>{
console.log("TIMESTAMP: " + args.TimeStamp);
});

connection.on(SocketServerSettings.StartClientPlayerCommand,(args)=>{
    console.log("START PLAYER");
})


connection.on(SocketServerSettings.CheckQuestCommand, (args)=>{
console.log(args.Question);

connection.emit(SocketServerSettings.NewVideoCommand, {isFirstVideo: false, value: args.Question});

});