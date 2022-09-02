const fs = require('fs');
const { FileSystemSettings, StreamServerSettings } = require('../Settings/Settings.js');


class FileSystemOps {
    constructor(){
     if(!fs.existsSync("../Users")) fs.mkdirSync("../Users");
    }

    createNewUser(id){
     fs.mkdirSync("../Users/" + id);
     return;
    }

    deleteUser(id){
        if(!fs.existsSync("../Users" + id)) return;
        
        fs.rmdirSync("../Users/" + id, {recursive: true});
        return;
    }

    createNewModelPrompt(promp1, promp2){
        
        if(!fs.existsSync(FileSystemSettings.PromptPath)) fs.writeFileSync(FileSystemSettings.PromptPath, "", "utf-8"); //wenn es models.jsonl nicht gibt dann wird die file erstellt 

        var data = fs.readFileSync(FileSystemSettings.PromptPath);
        data += `{"prompt": "${promp1}", "completion": "${promp2}"}\n`;
     fs.writeFileSync(FileSystemSettings.PromptPath, data ,{encoding:'utf8',flag:'w'});
     return;
    }

    AllreadyPrompted(promp){
        var data = fs.readFileSync(FileSystemSettings.PromptPath, "utf-8");

        if(data == "") return null;

        const step1 = data.split("\n");

        const WhiteSpaceIndex = step1.indexOf("");
        
        step1.splice(WhiteSpaceIndex, 1);
        
        for (let index = 0; index < step1.length; index++) {
            const ConvData = JSON.parse(step1[index]);

            if(ConvData.prompt.toLowerCase() == promp.toLowerCase()) return ConvData.completion;
            
        }

        return null;
    }

    DeleteAndRenameFile(OldName,userid){
        fs.unlinkSync("../Users/" + userid + "/" + OldName+".mkv");
        fs.unlinkSync("../Users/" + userid + "/" + OldName+".mp3");
        fs.renameSync("../Users/" + userid + "/" + OldName+"_merged.mkv", "../Users/" + userid + "/" + OldName+".mkv");

        return;
    }


    GetTsFileLength(userID){
        var length = 0;
        const Dir = fs.readdirSync("../Users/" + userID);

        for (let index = 0; index < Dir.length; index++) {
            if(Dir[index].includes(".ts")) length++;
            
        }
        return length;
    }

    DeleteFile(Path){
        fs.unlinkSync(Path);

        return;
    }

    AreTsFilesAvailable(id){
     const Dir = fs.readdirSync("../Users/" + id);

     if(Dir.includes("FileSequenz0.ts")) return true;

     return false;
    }

    createM3U8File(UserId){
        fs.writeFileSync(`../Users/${UserId}/index.m3u8`, `#EXTM3U\n#EXT-X-PLAYLIST-TYPE:EVENT\n#EXT-X-VERSION:7\n#EXT-X-MEDIA-SEQUENCE:0\n#EXT-X-TARGETDURATION:1\n#EXT-X-DISCONTINUITY-SEQUENCE:0\n#EXTINF:1.00000\nhttp://localhost:${StreamServerSettings.port}/${UserId}/fileSequence0.ts\n`)
    }

    checkIfFileExist(Path){
        return fs.existsSync(Path);
    }

    async GetHighestNumberFromM3u8File(id){
        await new Promise((resolve)=>{
         fs.readFile("../Users/" + id + "/" + "index.m3u8", "utf-8", (err, content)=>{
            
            const data = content; 
            if(err) console.log(err);

            const step1  = data.split("\n");

            var index = 0;

            for (let index = 0; index < step1.length; index++) {
                if(step1[index].includes(".ts")){
                    index++;
                }
                
            }

            resolve(index);
            
         })
        });
    }


    async WriteInExistingFileAsync(id,content){

     new Promise((resolve, reject) => {
        fs.writeFile("../Users/" + id + "/" + "index.m3u8", content, {flag: "a"}, (err)=>{
            if(err) return console.log(err);
            resolve();
         }) 
    });
    }

}

module.exports = {FileSystemOps};