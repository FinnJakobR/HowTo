const {YoutubeSearch} = require("../YoutubeOps/Search.js");



async function TestSearch(value){
    const Search = new YoutubeSearch(value);
    const data = await Search.start();
     console.log(data);
}

TestSearch("Hot Tube");