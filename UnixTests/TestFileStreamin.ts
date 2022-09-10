import fs from "fs";
import {Readable} from "stream";

const stream = fs.createWriteStream("./Test.txt",{ flags: 'a' });



async function WriteInFile(data:string): Promise<void> {

    await new Promise<void>((resolve, reject) => {
        const ReadStream = Readable.from(`${data}\n`);
    
        ReadStream.pipe(stream, {end: false});
    
        ReadStream.on("close",()=>{
            resolve();
        });
    })

}


setInterval(async() => {
  await WriteInFile("HALLO");
}, 1000);