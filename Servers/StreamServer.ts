import express from "express";
import { GetIndexLength, isAllreadyRequested } from "../DataStructures/UserDictonary";
import { WriteInStreamFile } from "../FileOperations/FileOP";
import { GeneralSettings, StreamServerStettings } from "../Settings/Settings";


const StreamServer = express();
const PORT = StreamServerStettings.port;


StreamServer.get(StreamServerStettings.url, async (req,res)=>{

    const _id = req.params.id;
    const videos = req.params.video;
    const FileName:string = req.params.file;

    if(FileName == "index.m3u8") return res.status(200).sendFile(`../${GeneralSettings.VideoDirName}/${_id}/index.m3u8`);

    const isAllreadySended = isAllreadyRequested(_id, `${videos}/${FileName}`);

    if(isAllreadySended) return res.status(200).sendFile(`../${GeneralSettings.VideoDirName}/${_id}/${videos}/${FileName}`);

    const FileNumber = FileName.match(/\d+/g);

    const IndexLength = GetIndexLength(_id, Number(videos));

    if(Number(FileNumber![0]) == IndexLength) {
        await WriteInStreamFile(`#EXT-X-DISCONTINUITY\n#EXTINF:1.000000\n${GeneralSettings.HostName}/${_id}/${videos+1}/0.ts`, _id);

        return res.status(200).sendFile(`../${GeneralSettings.VideoDirName}/${_id}/${videos}/${FileName}`);
    }

    await WriteInStreamFile(`#EXTINF:1.000000\n${GeneralSettings.HostName}/${_id}/${videos}/${FileNumber![0]+1}.ts`, _id);

    return res.status(200).sendFile(`../${GeneralSettings.VideoDirName}/${_id}/${videos}/${FileName}`);
});

StreamServer.listen(PORT,()=>{
    console.log("STREAM SERVER STARTED");
})