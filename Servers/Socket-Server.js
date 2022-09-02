const ExpressServer = require('express');
const http = require("http").Server(ExpressServer);
const SocketServer = require("socket.io")(http);

const {SocketEventListiner} = require("./Socket.js");
const {SocketServerSettings, YoutubeSearchSettings, UserSettings} = require("../Settings/Settings.js");
const {Queue, QueueOperations} = require("../DataStructures/Queue.js");
const {YoutubeSearch} = require("../YoutubeOps/Search.js");
const {FileSystemOps} = require("../Verschiedenes/FileSystem.js");
const {OpenAiOp} = require("../AI/OpenAiOp.js");
const { VideoDownload } = require('../YoutubeOps/Download.js');
const { Merge } = require('../VideoOps/Merge.js');
const { ConvertVideo } = require('../VideoOps/Convert.js');


const SERVERPORT = SocketServerSettings.port;
const Qop = new QueueOperations();
const FileOps = new FileSystemOps();


const UserStack = [];

SocketServer.on("connection",(socket)=>{
 const SocketEventListener = new SocketEventListiner(socket);

 SocketEventListener.newSocketCommandsWithArgs("NEW_QUESTION", async(so, arg)=>{
  const InitQueue = new Queue(arg.id); //Erstelle eine neue Queue

  const FirstSearch = new YoutubeSearch(arg.Question); // Initialisiere ein Youtube Search

  const Data = await FirstSearch.start(); // Start ein Youtube Search

  const element = {VideoId: Data.id, Question: arg.Question, url: Data.url , title: Data.title, laenge: Data.laenge, timeStamp: 0}
        
  InitQueue.enqueue(element);  // Speichere die Daten in der Queue
        
  Qop.Init(InitQueue); //Speichere die Queue im Stack 

  FileOps.createNewUser(arg.id); //Create den Folder für den User
    
  UserStack.push(arg.id); // Packt den User in den Stack 

  VIDEO_RUN(arg.id) //Main Funktion der Software 

  StartM3u8Server(arg.id, socket); // Startet den M3U8 port für den User wenn Ts Files vorhanden sind

  SocketServer.to(arg.id).emit("QUESTION_IN_QUEUE_COMPLETE", element);
 });

 SocketEventListener.newSocketCommandsWithArgs("QUESTION_IN_QUEUE",async(so,arg)=>{
      const element = {VideoId: null, Question: arg.Question, timeStamp: null};
       
      const AIOP = new OpenAiOp();

       const prompt = await AIOP.createNewPrompt(arg.Question); // Suche mit OpenAi eine neue Passende Prompt;
      
      element.Question = prompt; // Setzt die Question zu dem neuen Prompt

       if(IsAllreadyPromptForUser(id, element.Question)){
        SocketServer.to(arg.id).emit("ERROR", {code: 304}); //Sendet zum Client eine Error Message 
        return
       } //checkt ob die Frage schon mal vom User verwendet wurde 

      const SearchRes = await new YoutubeSearch(prompt).start(); // sucht mit Youtube nach den passenen Video 

      element.VideoId = SearchRes.id; // Setzt die ID zur passenden ID des gefunden Videos 

      const timeStamp = Qop.getTimeStamp(arg.id); //Get den TimeStamp des letzten Videos in der Queue

      element.timeStamp = timeStamp + (SearchRes.laenge / YoutubeSearchSettings.timeStampsEinheit); //Addiert den gefundenen Timpestamp mit der Länge des neuen Videos

      Qop.enqueue(element, arg.id); //Packt die Video Daten in die Queue der UserID
      
      SocketServer.to(arg.id).emit("QUESTION_IN_QUEUE_COMPLETE", element);
 });


  SocketServer.on("disconnect",(socket)=>{
    Qop.delete(socket.id); //Lösche die User Queue
    FileOps.deleteUser(socket.id); //lösche den User Ordner
    DeleteUserFromStack(socket.id) // Delete den User vom Stack
  });



});


function DeleteUserFromStack(id){
  var index = UserStack.indexOf(id);

  if(index == -1) new Error("Den User gibt es nicht im Stack");

  UserStack.splice(index, 1);
  
  return;
}


//TODO Lösch die QUEUE items 

async function VIDEO_RUN(id){
  
  await Delay(100); //Delay um Resorcen zu sparen

 const VideoData = Qop.Get(id).items[0];
 const Download = new VideoDownload(null, VideoData.VideoId, id);

 await Download.startAudio();
 await Download.startVideo();

 const VideoUrl = `../Users/${id}/${VideoData.VideoId}.mkv`;
 const AudioUrl =  `../Users/${id}/${VideoData.VideoId}.mp3`;

 const MergeClass = new Merge(VideoUrl, AudioUrl, id, VideoData.VideoId);

 await MergeClass.start(); //Das muss noch gefixt werden 


 const Convert = new ConvertVideo(id);

 await Convert.start();

 Qop.dequeue(id);

 if(isUserConnected(id) && !Qop.isEmpty(id) ) return VIDEO_RUN(id);
 
 return;
}



function isUserConnected(id){
  var index = UserStack.indexOf(id);

  if(index < 0) return false;

  return true;
}


async function StartM3u8Server(id) {
  var containsTsFiles = FileOps.AreTsFilesAvailable(id); 
 while (!containsTsFiles) {
   containsTsFiles = FileOps.AreTsFilesAvailable(id);
   Delay(UserSettings.checkInvervall); // Delay beim checken ob es ts Files beim User gibt
   }
   
   SocketServer.to(id).emit("START_SERVER");

   return 
}

/*
1. Hol die Video Daten aus der Queue
2. Video wird gedownloaded
3. Video wird gemerged
4. Video wird in Ts Files Convertiert 
*/

const Delay = (ms) =>{
  return new Promise(res => setTimeout(res,ms));
}

function IsAllreadyPromptForUser(id, prompt){
  const Queue = Qop.Get(id);

  for (let index = 0; index < Queue.items.length; index++) {
    if(Queue.items[index].Question == prompt){
      return true;
    }    
  }

  return false;
}

http.listen(SERVERPORT, ()=>{
    console.log("Socket Server sucessfull started on Port " + SERVERPORT);
})


