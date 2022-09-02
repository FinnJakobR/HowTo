

const {VideoDownload} = require("../YoutubeOps/Download.js");
const {YoutubeSearch} = require("../YoutubeOps/Search.js");
const {FileSystemOps} = require("../Verschiedenes/FileSystem.js");
const {Merge} = require("../VideoOps/Merge.js");

const DIR = "Test";
const Value = "How to play Football ? "

async function VideoDownloadTest(){
const YTS = new YoutubeSearch(Value);
const Res = await YTS.start(); 

new FileSystemOps().createNewUser(DIR);

const URL = "https://www.youtube.com/watch?v=" + Res.id;

const YtDL =  new VideoDownload(URL, Res.id, DIR);

await YtDL.startAudio();

await YtDL.startVideo();

console.log("Sucessfull downloaded");

return;

}


VideoDownloadTest();

