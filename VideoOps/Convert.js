const ffmpeg = require("fluent-ffmpeg");
const { M3U8Settings, UserSettings } = require("../Settings/Settings.js");
const { UserConnectionState } = require("../User/isUserConnected.js");
const { FileSystemOps } = require("../Verschiedenes/FileSystem.js");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);



class ConvertVideo {
    constructor(videoId, userid){
        this.videoId = videoId;
        this.run = null;
        this.userid = userid;
        this.isConnected = true;
    }

    async start(){
     await new Promise((resolve, reject) => {
        const VideoFilesLength = new FileSystemOps().GetTsFileLength(this.userid);
         this.run =  ffmpeg("../Users/" + this.userid + "/" + this.videoId + ".mkv").outputOptions([
            "-profile:v baseline",
            "-start_number 0",
            "-level 6.0",
            "-crf 28",
            "-g 1",
            '-hls_time ' + M3U8Settings["hls_time"],
            '-hls_list_size 0',
            '-hls_segment_filename', `./Videos/${this.videoId}/fileSequence%d.ts`,
        ]).output(`../Users/${this.videoId}.m3u8`)
      }).on("error",(err)=>{
        new Error("Konnte Video nicht Convertieren weil, " + err);
      }).on("end", ()=>{
        new FileSystemOps().DeleteFile(`../Users/${this.videoId}.m3u8`);
        this.changeConnectionState();
        resolve();
      })
    }

    stop(){
        try {
            this.run.kill();
        }catch(e){}

     return;
    }

    async isReady(filePath){
     await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata)=>{
            if(err) new Error("Ein fehler ist während des Mergin-prozesses aufgetreten");
        if(metadata.format.duration >= (M3U8Settings["hls_time"] - 0.1) && metadata.format.size > 0 ){
            resolve(true);
        }else{
            resolve(false);
        }
        })
     });

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

const Delay = (ms) =>{
    return new Promise(res => setTimeout(res,ms));
 }


module.exports = {ConvertVideo};