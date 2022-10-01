



export const DataBaseServerSettings = {
 port: 3000,
 hostname: "http://localhost"
}

export const ApiSettings: API_SETTINGS_TYPE = {
    page: 1,
    safeSearch: true,
    type: "Video" ,
    resolution: "HD" ,
    sortBy: "Relevance",
    limit: 2
}

export const GeneralSettings = {
  VideoDirName: "Videos",
  HostName: "http://localhost",
  path: ".",
}


export const OpenAiSettings = {
    apikey : "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" ,
    model: "davinci:ft-universit-t-der-k-nste-berlin-2022-02-12-18-36-05",
    NumPerRun: 3,
    delayMs: 1000,
}

export const SocketServerSettings = {
  port: 4000,
  NewVideoCommand: "NEW_VIDEO",
  SendTimeStampsCommand: "NEW_TIMESTAMP",
  StartClientPlayerCommand: "START_PLAYER",
  CheckQuestCommand: "CHECK_QUESTION"
}

export const StreamServerStettings = {
  port: 1000,
  url: "/:id/:video/:file"
}



export const DictonarySettings = {
  promptPath: "./Promps.txt"
}