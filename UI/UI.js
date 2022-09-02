
const PORT = 3000;

const URL = "http://localhost:" + PORT;

const SocketConnection = io(URL);

const Button = document.querySelectorAll("#search_button")[0];

const Video_Player =  document.getElementsByTagName('video')[0];


const HSL_Settings = { 
    levelLoadingTimeOut: 1000000, 
    manifestLoadingTimeOut: 1000, 
    levelLoadingMaxRetryTimeout: 1000, 
    levelLoadingMaxRetry: 2, 
    autoStartLoad : true, 
    debug: false, 
    liveDurationInfinity: false, 
    maxBufferLength: 10,
    backBufferLength: 10, 
    maxMaxBufferLength: 10
}


var socketID = null;

var Videos = []; //Speichert die Videos im Stack

var VideosInQueue = 0; //Zählt die Videos die sich in der Queue befinden 
var VideosPlayed = 0; //Zählt die Videos die gespielt wurden 

var TimeStamps = []; //Speichert die TimeStamps im Stack 

SocketConnection.on("connect",()=>{
    socketID = SocketConnection.socket.sessionid;
});

SocketConnection.on("QUESTION_IN_QUEUE_COMPLETE",arg =>{
 Videos.push(arg); //Push in den Video Stack 
 TimeStamps.push(arg.timeStamp); //Push in den TimeStamp Stack
 SaveInCache(arg); //Saved für spätere Funktionen Video Data im Cache


 if(VideosInQueue == (VideosPlayed + 2)){
    //return;
 } //Später funktion Client-Side Stopping des Runs

 VideosInQueue++; //Zählt die Videos in der Queue
 SocketConnection.emit("QUESTION_IN_QUEUE", arg);

});

SocketConnection.on("ERROR",error =>{
    if(error.code == 304){
       VideosInQueue--; //Dekremiert den Videos in Queue wenn es ein Fehler gibt
        SocketConnection.emit("QUESTION_IN_QUEUE", {id: socketID, Question: arg.Question});     
        console.warning("Eine neu generierte Frage wurde schon einmal verwendet " + arg.Question);
    }
})

SocketConnection.on("START_SERVER",()=>{
    ChangeButtonState(); //Enable den Button wieder
    changePointer(); //Changed den Cursor wenn es Ts Files gibt 
    StartPlayer(); //Startet den Player wenn es Ts Files gibt 
})


function START(){

    Videos = []; //Leere den Videos Stack
    TimeStamps = []; //Leere den TimeStaps Stack 

    ClearTimeStamps(); //lösche alle Vorhandenen TimeStamps
    
    ChangeButtonState(); //disable den Button

    ChangeUserID(); //Ändere bei jeder neuen Suche die UUID

    changePointer(); //Change den Pointer zum Lade-Cursor

    const Question = document.getElementsByTagName("input")[0].value; //Bekomme den Text aus dem Textfield

    SocketConnection.emit("NEW_QUESTION", {id: socketID, Question: Question}); //Sende ein Event an den Socket Server
}


function ChangeButtonState(){
    if(Button.disabled) {
        Button.disabled = false;
        return;
    }

    Button.disabled = true;
    return
}


function ChangeUserID(){
    SocketConnection.disconnect();
    SocketConnection.connect();
}


function changePointer(){
   const currentState = document.body.style.cursor;

   if(currentState.includes("wait")){
    document.body.style.cursor = "pointer";
    return;
   }

   document.body.style.cursor = "wait !important";

   return;
}

function StartPlayer(){
 const url = URL + "/" + socketID;

 if(Hls.isSupported()){
    const hls = new Hls({ levelLoadingTimeOut: 1000000, manifestLoadingTimeOut: 1000, levelLoadingMaxRetryTimeout: 1000, levelLoadingMaxRetry: 2, autoStartLoad : true, debug: false, liveDurationInfinity: false, maxBufferLength: 10,backBufferLength: 10, maxMaxBufferLength: 10});
    hls.loadSource(url);
    hls.attachMedia(Video_Player);
    ChangeVideoDisplayState();
 }
}

function SaveInCache(element){
    const data = localStorage.getItem("VIDEO_DATA");
    if(!data) {
        localStorage.setItem("VIDEO_DATA", JSON.stringify(Videos));
        return;
    }

    const parsedData = JSON.parse(data);

    parsedData.push(element);

    localStorage.setItem("VIDEO_DATA", JSON.stringify(parsedData));

    return;

}

function ChangeVideoDisplayState(){
    const currentState = document.getElementsByTagName('video')[0].style.display;

    if(currentState == "block"){
        document.getElementsByTagName('video')[0].style.display = "none";
        return;
    }
    document.getElementsByTagName('video')[0].style.display = "block";
}

document.getElementsByTagName("video")[0].addEventListener("timeupdate",()=>{
    const currentTime = Math.floor(Video_Player.currentTime);

    for (let index = 0; index < Videos.length; index++) {
        if(currentTime == Videos[index].timeStamp){
            ShowTimeStamps();
            VideosPlayed++; //Zählt die gespielten Videos
            Videos[index].timeStamp = -1; //Avoide das er nochmal generiert werden kann;
            return;
        }else if(currentTime == TimeStamps[index]){
            ClearRed();
            const elements = document.getElementsByClassName("Stamps")[0].childNodes;
            elements[index].id = "active";
        }
    }
})


document.getElementsByTagName("video")[0].addEventListener("seeking",()=>{
  const currentTime = Math.floor(document.getElementsByName("video")[0].currentTime);
  const Stamps = document.getElementsByClassName("Stamps")[0].childNodes;

  for (let index = 0; index < Stamps.length; index++) {
    if(currentTime == TimeStamps[index]){
        ClearRed();
        Stamps.id = "active";
        return;
    }
  }
});


function ClearTimeStamps(){
    document.getElementsByClassName("Stamps")[0].innerHTML = "";
    return;
}


function ShowTimeStamps(data){
    var wrapper = document.createElement("div");
    wrapper.className = data.time;
    var link = document.createElement("a");
    link.href = "#";
    link.innerHTML = data.title + "?";
    link.id = "active";

    link.onclick = (e)=>{
        Jumpto(data.time, e);
    }

    ClearRed();
    
    wrapper.appendChild(link);
   document.getElementsByClassName("Stamps")[0].appendChild(wrapper);
   var scrollBottom = document.getElementsByClassName("Stamps")[0];
   scrollBottom.scrollTop = scrollBottom.scrollHeight;
}



function ClearRed(){
    const element = document.getElementsByClassName("Stamps")[0].childNodes;

    for (let index = 0; index < element.length; index++) {
        element.id = "";
    }

    return;
}


function JumpTo(time, e){
    e.preventDefault();
    return document.getElementsByTagName("video")[0].currentTime = time;

}
