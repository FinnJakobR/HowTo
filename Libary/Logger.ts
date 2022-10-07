import fs from "fs";

var Users: any[] = [];

function InitLogger(){

    const LogsUnparsed = fs.readFileSync("./Logs.json", "utf-8")

if(LogsUnparsed != ""){
    const Logs = JSON.parse(fs.readFileSync("./Logs.json", "utf-8"));
    Users = Logs;

    return;
}

}


function WriteLogs(){
    fs.writeFileSync("./Logs.json", JSON.stringify(Users));

    return 
}


function renderProgress() {
    // reset cursor, clear screen, do not write a new line
    process.stdout.write('\x1b[H\x1b[2J')
    
    // render progress

    if(Users.length == 0) return console.log("No User is Connected!");
    
   Users.forEach(user => console.log(
        `---------
    User: ${user["id"]}
    state: ${user["state"]}
    DownLoadedVideos: ${user["DownLoadedVideos"]}
    VideoLength: ${user["VideoLength"]}
    LastDownLoadedVideo: ${user["LastDownLoadedVideo"]}
---------`))

    WriteLogs();

    }
    
    export function updateProgress(user: string, data: string, status: string) {
    InitLogger();
    const ind = GetIndex(user);
    Users[ind!][data] = status
    renderProgress()
    }
    
    function GetIndex(user_id: string) {
    for (let index = 0; index < Users.length; index++) {
        if (Users[index].id == user_id) {
            return index;
        }
    }
    }
    
    export function AddUserDebug(id: string) {
    const InitData = {
        id: id,
        "state": "idle",
        "DownLoadedVideos": "{}",
        "VideoLength": "TBD",
        "LastDownLoadedVideo": "TBD"
    }
    
   Users.push(InitData);
    
    renderProgress();
    }
    
    
    export function DeleteUserDebug(id: string){
     const ind = GetIndex(id);
     Users.splice(ind!, 1);
    
     renderProgress();
    
     return 
    }


export function ClearLogs(){
    console.log("Clear Logs!")
    fs.writeFileSync("./Logs.json", "[]");
    InitLogger();
    return;
} 


InitLogger()


process.on('uncaughtException', function(err) {
    // handle the error safely
    //console.log(err);
})


//so the program will not close instantly

//do something when app is closing


//catches ctrl+c event

//process.on("SIGINT",async ()=>{
  //  await savePromptsInFile();
//});

// catches "kill pid" (for example: nodemon restart)

//process.on('SIGUSR1', async ()=>{
    //await savePromptsInFile();
//});
//process.on('SIGUSR2', async ()=>{
    //await savePromptsInFile();
//});

//catches uncaught exceptions
//process.on('uncaughtException', async ()=>{
   // await savePromptsInFile();
//});