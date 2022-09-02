const {exec, spawn} = require("child_process"); 
const { FileSystemOps } = require("../Verschiedenes/FileSystem");
const { UserConnectionState } = require('../User/isUserConnected.js');


class Merge {
    constructor(videoUrl, audioUrl, UserId, videoId){
        this.videoUrl = videoUrl;
        this.audioUrl = audioUrl;
        this.UserId = UserId;
        this.videoId = videoId;
        this.isConnected = true;

        this.command = `ffmpeg -i ${this.videoUrl} -i ${this.audioUrl} -crf 50 -y -acodec copy -vcodec copy ../Users/${this.UserId}/${this.videoId}_merged.mkv`;

        this.ls = null;
    }

    async start(){

      await new Promise((resolve, reject) => {
        console.log(this.command)
        this.ls = spawn(this.command);
        
        this.ls.stdout.on("data",(data) => console.log(data));
 
        this.ls.stderr.on("data", err => new Error("Ein Fehler ist beim Mergen aufgetreten : " + err));
 
        this.ls.on('exit', (code) => {
          if(code == 0) {
             new FileSystemOps().DeleteAndRenameFile(this.videoId + "_merged.mkv", this.UserId);
             this.changeConnectionState();
             resolve();
         };
       });
      })
    }

    stop(){

    if(!this.ls) new Error("Der Merging Process wurde noch nicht gestarted");

    this.ls.kill('SIGINT');

    return;

    }

    async StopIfUserisDisConnect(){
        this.isConnected = true;
          while(isConnected){
            await Delay(UserSettings.checkInvervall);
            this.isConnected = UserConnectionState(this.userId);
          }
  
          this.stop();
      }
  
      changeConnectionState(){
          this.isConnected = false;
          return;
      }
}

module.exports = {Merge}