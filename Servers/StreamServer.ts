import express from "express";
import path from "path";
import cors from "cors";
import { GetIndexLengthApi, IsAllreadyRequestedApi } from "../Api/DataApi";
import { WriteInStreamFile } from "../FileOperations/FileOP";
import { GeneralSettings, StreamServerStettings } from "../Settings/Settings";


const StreamServer = express();
const PORT = StreamServerStettings.port;

StreamServer.use(cors());


StreamServer.get(StreamServerStettings.url, async (req,res)=>{

    const _id = req.params.id;
    const videos = req.params.video;
    const FileName:string = req.params.file;

    if(FileName == "index.m3u8") return res.status(200).sendFile(path.join(__dirname, `../${GeneralSettings.VideoDirName}`, `/${_id}`, "/index.m3u8"));

    const isAllreadySended = await IsAllreadyRequestedApi(_id, `${videos}/${FileName}`);

    if(isAllreadySended) return res.status(200).sendFile(path.join(`${__dirname}`, `../${GeneralSettings.VideoDirName}`, `/${_id}`, `/${videos}` , `/${FileName}`));

    const FileNumber = FileName.match(/\d+/g);

    const IndexLength = await GetIndexLengthApi(_id, Number(videos));
    
    if(Number(FileNumber![0]) == IndexLength) {
        await WriteInStreamFile(`#EXT-X-DISCONTINUITY\n#EXTINF:1.000000\n${GeneralSettings.HostName}/${_id}/${videos+1}/0.ts\n`, _id);

        return res.status(200).sendFile(path.join(`${__dirname}`, `../${GeneralSettings.VideoDirName}`, `/${_id}`, `/${videos}` , `/${FileName}`));
    }

    await WriteInStreamFile(`#EXTINF:1.000000\n${GeneralSettings.HostName}:${StreamServerStettings.port}/${_id}/${videos}/${Number(FileNumber![0])+1}.ts\n`, _id);

    return res.status(200).sendFile(path.join(`${__dirname}`, `../${GeneralSettings.VideoDirName}`, `/${_id}`, `/${videos}` , `/${FileName}`));
});

StreamServer.listen(PORT,()=>{
    console.log("STREAM SERVER STARTED");
})