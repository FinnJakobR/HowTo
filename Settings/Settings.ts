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
  HostName: "http://localhost"
}


export const OpenAiSettings = {
    apikey : "API_KEY" ,
    model: "OPEN_AI_MODEL",
    NumPerRun: 3,
    delayMs: 1000,
}

export const SocketServerSettings = {
  port: 3000,
  NewVideoCommand: "NEW_VIDEO",
  SendTimeStampsCommand: "NEW_TIMESTAMP",
  StartClientPlayerCommand: "START_PLAYER",
  CheckQuestCommand: "CHECK_QUESTION"
}

export const StreamServerStettings = {
  port: 5000,
  url: "/:id/:video/:file"
}



export const DictonarySettings = {
  promptPath: "./Promps.txt"
}
