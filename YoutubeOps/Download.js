
const ytdl = require('ytdl-core');
const fs = require("fs");
const { UserSettings } = require('../Settings/Settings.js');
const { UserConnectionState } = require('../User/isUserConnected.js');



class VideoDownload {
    constructor(url, id, userId){
        this.url = url;
        this.id = id;
        this.userId = userId;
        if(!this.url || !this.id || !this.userId ) throw new Error("Alle Values müssen definiert sein ");
        this.videoStream = null;
        this.AudioStream = null;
        this.isConnected = true;

        this.StopIfUserisDisConnect();
    }
     
    async startVideo(){
     await new Promise((resolve)=>{
     this.videoStream = ytdl(this.url, {quality: "highestvideo"}).pipe(fs.createWriteStream("../Users/" + this.userId + "/" + this.id +'.mkv'))
     .on("close",()=>{
     resolve();
     this.changeConnectionState();
         });
     }); 
    }

     async startAudio(){
     await new Promise((resolve)=>{
        this.AudioStream = ytdl(this.url, {filter: "audioonly", quality: "highestaudio"}).pipe(fs.createWriteStream("../Users/" + this.userId + "/" + this.id + ".mp3"))
        .on("close",()=>{
            resolve();
            this.changeConnectionState();
        })
     })
    }

    async stopDownload(){
       this.AudioStream.destroy();
       this.videoStream.destroy();
       return;
    }

   async StopIfUserisDisConnect(){
      this.isConnected = true;
        while(isConnected){
          await Delay(UserSettings.checkInvervall);
          this.isConnected = UserConnectionState(this.userId);
        }

        this.stopDownload();
    }

    changeConnectionState(){
        this.isConnected = false;
        return;
    }
}

const Delay = (ms) =>{
    return new Promise(res => setTimeout(res,ms));
 }

module.exports = {VideoDownload};
