const {Merge} = require("../VideoOps/Merge.js");
const fs = require("fs");
const path = require("path");

const UserDir = "Test";
const VIDEOID = "cpIwMZ3cUEc";

async function TestMerginProcess(){

    const videoUrl = "../Users/" + UserDir + "/" + VIDEOID + ".mkv";
    const audioUrl = "../Users/" + UserDir + "/" + VIDEOID + ".mp4"

const MergeOp = new Merge(videoUrl, audioUrl, UserDir);

await MergeOp.start();

console.log("Video Sucessfull merged");
}


TestMerginProcess();