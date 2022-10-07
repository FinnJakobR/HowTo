import fs from "fs";



export async function sleep (ms: number): Promise<void>{
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, ms);
  })
}

export function printing(process: NodeJS.Process, text:string, line: number) {
    process.stdout.cursorTo(0, line);

    process.stdout.write(text.toString());
}

declare global {

    type NullSave<T> = T extends null ? never : T;

    type QueueItem = {
        _ID: string 
        URL: string | null 
        QUESTION: string
    }

    type API_RESPONSE = {
        ID: string | void,
        NAME: string | void,
        DURATION: number,
        URL: string,
    }

    type API_SETTINGS_TYPE = {
        page: number,
        safeSearch: boolean,
        type: string,
        resolution: VideoResolution,
        sortBy: VideoSort,
        limit: number
    }

    type USER_DATABASE = {
        [USER: string] : {
            _id: string,
            videos: number,
            NextTimeStampsMs: number ,
            StreamFileStream: fs.WriteStream | null,
            VideoIndexLengths: {
             [index: number]: number
            },
            RequestedFiles : {
                [FileName: string]: true
            }
        }| null
    };

    type VideoResolution =  "4k" | "HD" | "360°" | "VR180" | "HDR" | "3D";
    type VideoSort =  "Relevance" | "Upload date" | "View count" | "Rating" | "active";


  interface Array<T> {
    removeAtIndex(index:number): void,
    removeValueAtIndex(value: NullSave<any>): void
}

interface String {
 getMinutes(): number, 
 getSeconds(): number
}

}


String.prototype.getMinutes = function() {
    if(!this.includes(":")) throw new Error("The String does not match the accepted the Pattern EX: 3:33");

    const Index = this.lastIndexOf(":");
    const Minutes: number = Number(this.slice(0, Index-1));
    return Minutes;

}


String.prototype.getSeconds = function() {
    if(!this.includes(":")) throw new Error("The String does not match the accepted the Pattern EX: 3:33");

    const Index = this.indexOf(":");
    const Seconds = Number(this.slice(Index + 1));

    return Seconds;
}


Array.prototype.removeValueAtIndex = function (value) {
    const Index = this.indexOf(value);
   if(Index > -1) this.splice(Index,1);

   else throw Error("This value is not in the Array");
}

Array.prototype.removeAtIndex = function (index) {
    this.splice(index,1);
}

//so the program will not close instantly
//process.stdin.resume();

//do something when app is closing

//process.on("exit",async ()=>{
  //await savePromptsInFile();
//});

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