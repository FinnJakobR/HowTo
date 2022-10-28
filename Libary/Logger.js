"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearLogs = exports.DeleteUserDebug = exports.AddUserDebug = exports.updateProgress = exports.InitLogger = void 0;
const fs_1 = __importDefault(require("fs"));
var Users = [];
function InitLogger() {
    const LogsUnparsed = fs_1.default.readFileSync("./Logs.json", "utf-8");
    if (LogsUnparsed != "") {
        const Logs = JSON.parse(fs_1.default.readFileSync("./Logs.json", "utf-8"));
        Users = Logs;
        return;
    }
}
exports.InitLogger = InitLogger;
function WriteLogs() {
    try {
        const a = JSON.parse(JSON.stringify(Users));
        console.log("ACCEPT");
    }
    catch (error) {
        throw Error("Could not parsed Users " + Users);
    }
    fs_1.default.writeFileSync("./Logs.json", JSON.stringify(Users)); //--> Bug
    return;
}
function renderProgress() {
    // reset cursor, clear screen, do not write a new line
    process.stdout.write('\x1b[H\x1b[2J');
    // render progress
    if (Users.length == 0)
        return console.log("No User is Connected!");
    Users.forEach(user => console.log(`---------
    User: ${user["id"]}
    state: ${user["state"]}
    DownLoadedVideos: ${JSON.stringify(user["DownLoadedVideos"])}
    VideoLength: ${user["VideoLength"]}
    Download: ${user["Download"]}
    LastDownLoadedVideo: ${user["LastDownLoadedVideo"]}
---------`));
    WriteLogs();
}
function updateProgress(user, data, status) {
    InitLogger();
    const ind = GetIndex(user);
    if (data == "DownLoadedVideos") {
        Users[ind][data] = JSON.parse(status);
        renderProgress();
        return;
    }
    Users[ind][data] = status;
    renderProgress();
}
exports.updateProgress = updateProgress;
function GetIndex(user_id) {
    for (let index = 0; index < Users.length; index++) {
        if (Users[index].id == user_id) {
            return index;
        }
    }
    throw Error("Not found Index!");
}
function AddUserDebug(id) {
    const InitData = {
        id: id,
        "state": "idle",
        "DownLoadedVideos": "{}",
        "VideoLength": "TBD",
        "LastDownLoadedVideo": "TBD",
        "Download": "TBD",
    };
    Users.push(InitData);
    renderProgress();
}
exports.AddUserDebug = AddUserDebug;
function DeleteUserDebug(id) {
    const ind = GetIndex(id);
    Users.splice(ind, 1);
    renderProgress();
    return;
}
exports.DeleteUserDebug = DeleteUserDebug;
function ClearLogs() {
    console.log("Clear Logs!");
    fs_1.default.writeFileSync("./Logs.json", "[]");
    InitLogger();
    return;
}
exports.ClearLogs = ClearLogs;
//1.Clear die Log Datei mit und füge ein Array an 
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
