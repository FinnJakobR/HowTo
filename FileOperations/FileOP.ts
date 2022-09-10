import fs from "fs/promises";
import {Readable} from "stream";
import { AddFileStream, GetStream } from "../DataStructures/UserDictonary";
import { DictonarySettings, GeneralSettings, SocketServerSettings } from "../Settings/Settings";

/**
  * Read The File of the Prompt 
  * @param path define the Path of the Prompt File
  * @returns the Promps in the File from given Path
  */
 
export async function ReadPromptFile(path:string): Promise<string>{

const ReadedData = await fs.readFile(path,  "utf-8");

return ReadedData;
}

export async function saveInFile(data: string): Promise<void>{
   
    await fs.writeFile(DictonarySettings.promptPath, data, "utf-8");

    return;
}

export async function RemoveFile(path: string): Promise<void> {
  await fs.unlink(path);

  return;
}

export async function DeleteUserDir(_id:string): Promise<void> {
  
    await fs.rmdir(`../${GeneralSettings.VideoDirName}/${_id}`,{recursive: true});

  return;
}

export async function CreateUserDir(_id:string): Promise<void>{
    await fs.mkdir(`../${GeneralSettings.VideoDirName}/${_id}`);

    return
}


export async function CreateVideoOrdner(video:number, _id:string): Promise<void>{
    await fs.mkdir(`../${GeneralSettings.VideoDirName}/${_id}/${video}`);

    return;
}

export async function CreateStreamingFile (_id:string): Promise<void> {

    const FileData = 
    `
    #EXTM3U
    #EXT-X-PLAYLIST-TYPE:EVENT
    #EXT-X-VERSION:7
    #EXT-X-MEDIA-SEQUENCE:0
    #EXT-X-TARGETDURATION:1
    #EXT-X-DISCONTINUITY-SEQUENCE:0
    #EXTINF:1.00000
    ${GeneralSettings.HostName}:${SocketServerSettings.port}/${_id}/0/fileSequence0.ts
    `;

    await fs.writeFile(`../${GeneralSettings.VideoDirName}/${_id}/index.m3u8`, FileData);

    AddFileStream(_id);

    return;
}

export async function WriteInStreamFile(data: string, _id:string): Promise<void>{
    
    await new Promise<void>((resolve, reject) => {
        const stream = GetStream(_id);
        const ReadStream = Readable.from(`${data}\n`);
        ReadStream.pipe(stream);
        
        ReadStream.on("close",()=>{
            resolve();
        });

        ReadStream.on("error",()=>{
            reject("COULD NOT IN WRITE IN STREAM FILE");
        });
        
    });
}