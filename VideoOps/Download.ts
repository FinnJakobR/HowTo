import ytdl from "ytdl-core";
import fs from "fs";
import cp from "child_process";
import ffmpeg from "ffmpeg-static";
import {Worker, isMainThread, parentPort} from "worker_threads";
import { GeneralSettings } from "../Settings/Settings";
import { RemoveFile } from "../FileOperations/FileOP";
import { IsUserConnectedApi } from "../Api/DataApi";
import { updateProgress } from "../Libary/Logger";

export async function DownloadAndConvertVideo(url:string, _id: string, videoNum: number) {

    //TODO: Ordner erstellen welche Video 1 2 usw 

    var isFirstTsFile = true;

    await new Promise<void>((resolve, reject) => {
      const tracker = {
        start: Date.now(),
        audio: { downloaded: 0, total: Infinity },
        video: { downloaded: 0, total: Infinity },
        merged: { frame: 0, speed: '0x', fps: 0 },
      }
      
      
      const audio = ytdl(url!, { quality: 'lowestaudio' })
        .on('progress', (_, downloaded, total) => {
          tracker.audio = { downloaded, total };
        });
        
      const video = ytdl(url!, { quality: 'highestvideo' })
        .on('progress', (_, downloaded, total) => {
          tracker.video = { downloaded, total };
        });
      
        //../${GeneralSettings.VideoDirName}/${_id}/${_id}.mp4
      
        const ConvertProcess: NullSave<any>  = cp.spawn(ffmpeg!, [
          '-loglevel', '8', '-hide_banner',
          '-i', 'pipe:4',
          '-i', 'pipe:5',
          '-map', '0:a',
          '-map', '1:v',
          "-c:v", "libx264",
          "-preset", "slower",
          "-crf","51",
          "-f", "avi",
          "pipe:3"
        ],{
          detached: true,
          windowsHide: true,
          stdio: [
            /* Standard: stdin, stdout, stderr */
            'inherit', 'inherit', 'inherit',
            /* Custom: pipe:3, pipe:4, pipe:5 */
            'pipe', 'pipe', 'pipe'
          ],
        });
      
        ConvertProcess.on("spawn",()=>{
          console.log("Start Download");


          updateProgress(_id, "state", "Start Download Video!")
          
        });

        ConvertProcess.on("end",()=>{
         console.log("a Video is sucessfull downloaded");
        });
      //ConvertProcess.stdio[3]?.pipe(process.stdio[0]);
      
      audio.pipe(ConvertProcess.stdio[4]);
      video.pipe(ConvertProcess.stdio[5]);
      
      const HLSProcess: NullSave<any> = cp.spawn(ffmpeg!, [
          '-loglevel', '8', '-hide_banner',
          "-i","pipe:3", 
          "-progress", "pipe:4",
          "-start_number", "0",
          "-g","1",
          "-hls_time", "1",
          "-hls_list_size", "0",
          "-level" , "6.0",
          "-c:v", "libx264",
          "-preset", "slower",
          "-crf","51",
          "-hls_segment_filename", `${GeneralSettings.path}/${GeneralSettings.VideoDirName}/${_id}/${videoNum}/%d.ts`, //TODO: CHANGE
          `${GeneralSettings.path}/${GeneralSettings.VideoDirName}/${_id}/buffer.m3u8` //TODO: CHANGE 
      ],{
        detached: true,
          windowsHide: true,
          stdio: [
            /* Standard: stdin, stdout, stderr */
            'inherit', 'inherit', 'inherit',
            /* Custom: pipe:3, pipe:4*/
            'pipe', "pipe"
          ],
        });
      
        
        ConvertProcess.stdio[3]?.pipe(HLSProcess.stdio[3]);
      
        HLSProcess.stdio[4]?.on("data",async ()=>{

          if(isFirstTsFile){
            
            isFirstTsFile = false;
            
            setTimeout(() => {
              process.send!({_id: _id, detail: "First Segments are loaded"});
            }, 1000);

          }

          const isConnected = await IsUserConnectedApi(_id);
      
          if(!isConnected) {
            try {
              audio.destroy();
              video.destroy();
              HLSProcess.stdio[3]?.destroy();
              HLSProcess.stdio[4]?.destroy();
              
              process.kill(-ConvertProcess.pid);
              process.kill(-HLSProcess.pid);
            } catch (error) {
              console.log("KILLED CONVERT");
            }
            
          };
      
        });
        
        HLSProcess.on("close",async ()=>{

          const isConnected = await IsUserConnectedApi(_id);
          
          if(isConnected){
            updateProgress(_id, "state", "Download Ended!");
            process.send!({_id: _id, detail: "DownLoadingConverting Finish"});
          
          }else{
           
             process.send!({_id: _id, detail: "User is disconnected"});
          }
           await RemoveFile(`${GeneralSettings.path}/${GeneralSettings.VideoDirName}/${_id}/buffer.m3u8`);
           resolve();
        });
    })
  
}