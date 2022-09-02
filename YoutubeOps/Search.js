const ytsr = require('ytsr');
const ytdl = require("ytdl-core");
const {YoutubeSearchSettings, YoutubeDownloaderOptions} = require("../Settings/Settings.js");
 

class YoutubeSearch {
    constructor(value){
     this.value = value;
     if(!value) throw new Error("Die Such-Anfrage an Youtube kann nicht undefined sein");

     this.options = {pages: YoutubeSearchSettings.pages, safeSearch: YoutubeSearchSettings.safeSearch};
    }

    async start(){
       if(YoutubeSearchSettings.filter != "onlyVideo") new Error("dieser Filter ist bis jetzt nicht implementiert")
    
      
       const filters1 = await ytsr.getFilters(this.value);
       const filter1 = filters1.get('Type').get('Video');
       const res = await ytsr(filter1.url, this.options);


       for (let index = 0; index < res.items.length; index++) {
        
        const retValue = {
            title: res.items[index].title,
            id: res.items[index].id,
            url: res.items[index].url,
           }

           const QualityData = await ytdl.getInfo(retValue.url, YoutubeDownloaderOptions.option);
           for (let index2 = 0; index2 < QualityData.formats.length; index2++) {
            if(QualityData.formats[index2].qualityLabel == "1080p") {
                retValue.laenge = Number(QualityData.formats[index2].approxDurationMs);
                return retValue;
            }
           }
       }
       
    }
}

module.exports = {YoutubeSearch};