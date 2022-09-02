const SocketServerSettings = {
    port: 3000 //auf welchen Port soll der Socket Server erreichbar sein
}

const StreamServerSettings = {
    port: 4000 //auf welchen Port soll der Socket Server erreichbar sein
}

const DataBaseSettings = {
    url: "" //MongoDB Database URL
}

const OpenAiSettings = {
    NumPerRun: 3, //Wie  viele von OpenAi generierte Fragen soll pro Run miteinander verglichen werden
    apiKey: "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", //Apikey von OpenAi
    model: "davinci:ft-universit-t-der-k-nste-berlin-2022-02-12-18-36-05", //Modelname von OpenAi
    delayMs: 500, //Wie lange soll pro generierten Satz gewartet werden bis die nächste generiert wird in Millisekunden  --- VORSICHT: kleine Zahlen können Error Code 429 verusachen
}

const TensorflowSettings = {
    choice: "<" // < == Der kleinste Wert 
}

const YoutubeSearchSettings = {
    pages: 2,  //Wie viele Pages sollen pro Youtube Api anfrage zurückgegeben werden --- VORSICHT: Der werd darf nicht kleiner als 1 sein.
    filter: "onlyVideo", //Filter welche Daten zurückgegeben werden sollen 
    safeSearch: true, //Ob Safesearch Aktiviert oder Deaktiviert werden soll (SafeSearch == keine Age Resticted Videos werden angezeigt) --- VORSICHT: nur mit Absprache des Creators ändern
    timeStampsEinheit: 1000 //Ein welcher Einheit sollen die TimeStamps sein zb(1000 = Sekunde, 1 = Millisekunde, 60000 = Minute) --- VORSICHT: nur mit Absprache des Creators ändern
}

const YoutubeDownloaderOptions = {
    option: {filter: 'audioandvideo', quality: 'highestvideo'}
}

const FileSystemSettings = {
    PromptPath: "../AI/models.jsonl", //Path wo die generierten Promps gespeichert werden 
    UserPath: "../Users" //Path des Ordners wo die Users drin gespeichert werden sollen 
}

const M3U8Settings = {
    hls_time: 1 //wie lange sollen die einzelnen Video Sequenzen sein
}

const UserSettings = {
    checkInvervall: 100, // in Welchem Intervall soll gecheckt werden ob der User noch Connected ist
}

const VideoStreamSettings = {
    port: 4000,

    cors: {
        origin: "*",
        credentials: true
    }
}


module.exports = {VideoStreamSettings, SocketServerSettings, DataBaseSettings, OpenAiSettings, YoutubeSearchSettings, YoutubeDownloaderOptions, TensorflowSettings, StreamServerSettings,FileSystemSettings, M3U8Settings, UserSettings};
