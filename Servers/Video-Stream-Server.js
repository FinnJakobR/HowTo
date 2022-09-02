const app = require("express")();
const cors = require("cors");
const { QueueOperations } = require("../DataStructures/Queue.js");
const { VideoStreamSettings, StreamServerSettings } = require("../Settings/Settings.js");
const { FileSystemOps } = require("../Verschiedenes/FileSystem.js");
const path = require("path");

const fs = new FileSystemOps();
const QueueOP = new QueueOperations();

app.use(cors({
    origin: VideoStreamSettings.cors.origin, 
  credentials: VideoStreamSettings.cors.credentials,   
}));

app.get("/",(req, res)=>{
  return res.status(200).sendFile(path.join(__dirname, "..", "UI", "UI.html"));
});

app.listen(VideoStreamSettings.port,()=>{
    console.log("Video Stream Server started");
});

app.get("/:uuid/:filename", async (req,res)=>{
    if(!fs.checkIfFileExist(`../Users/${req.params.uuid}/index.m3u8`)) fs.createM3U8File(req.params.uuid); //Wenn des keine index File gibt beim User dann erstell eine neue

    if(!req.params.filename.includes(".ts")) res.status(200).sendFile(path.join(__dirname, "..", "Users", req.params.uuid, req.params.filename)); //Für den Fall wenn der Client die M3u8 File anfordert 

    const RequestFileNumber = req.params.filename.replace(/\D/g, ''); //Extrahiere die Number der angeforderten Ts File

    const Queue = QueueOP.Get(req.params.uuid); //Gibt die Queue des Users zurück 

    const TimeStamps = [...Queue.items.timeStamp]; //Fügt alle in der Queue vorhandenen Timpstamps in ein Array

    const highestNumberFromFile = await fs.GetHighestNumberFromM3u8File(req.params.uuid); //Gibt die höchste Number der ts File in der M3u8 File zurück

    if(!TimeStamps.includes(RequestFileNumber + 1)){  //checkt ob nächste ts File ein neues Video ist
       
        await fs.WriteInExistingFileAsync(`#EXTINF:1.000000\nhttp://localhost:${StreamServerSettings.port}/${req.params.uuid}/fileSequence${(highestNumberFromFile+1)}.ts\n`, req.params.uuid);
    
    }else if(TimeStamps.includes(RequestFileNumber + 1)){
        
        await fs.WriteInExistingFileAsync(`#EXT-X-DISCONTINUITY\n#EXTINF:1.000000\nhttp://localhost:${StreamServerSettings.port}/${req.params.uuid}/fileSequence${(highestNumberFromFile+1)}.ts\n`, req.params.uuid);
    
    }

    if(!fs.checkIfFileExist("../Users" + "/" + req.params.uuid+ "/" + req.params.filename)) return res.sendStatus(400); // Wenn es die angeforderte Ts File nicht gibt, dann wird HTTP 400 zurückgegeben

    res.sendStatus(200).sendFile(path.join(__dirname, "..", "Users", req.params.uuid, req.params.filename)); //Sendet die angeforderte ts File zum Client

    return;
})
