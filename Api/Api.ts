import {getFilters, Video} from "ytsr";
import ytsr from "ytsr";
import { ApiSettings } from "../Settings/Settings";

const Options: ytsr.Options = {
    safeSearch: ApiSettings.safeSearch,
    pages: ApiSettings.page,
    limit: ApiSettings.limit,
}

export async function SearchVideo(request: string): Promise<API_RESPONSE> {

//console.log("SearchVideo");
    

const Filter: string = await CreateFilters(request);

const response: ytsr.Result = await ytsr(Filter, Options);


for (let index = 0; index < response.items.length; index++) {

    const Videos = response.items[index] as Video;

    const SplittedDuration = Videos.duration?.split(":");
     if(SplittedDuration?.length == 2){
        const DurationInString = Videos.duration;

        const DurationinMs: number = ConvertDuration(DurationInString!);
        
        const VideoUrl = Videos.url;
        
        const ReturnData: API_RESPONSE = {
          ID: Videos.id,
          NAME: Videos.title,
          DURATION: DurationinMs,
          URL: VideoUrl!
        
        }
        
        return ReturnData;
     }
    
}

throw Error("Could not get a Video with a Length smaller than one Hour!");
}

async function CreateFilters(request: string) {
const filters1: any = await getFilters(request);
const filter1 = filters1.get('Type').get(ApiSettings.type);
const filters2: any = await ytsr.getFilters(filter1.url);
const filter2 = filters2.get('Features').get(ApiSettings.resolution);

if(ApiSettings.sortBy != "Relevance"){
    const filters3: any = await ytsr.getFilters(filter2.url);
    const filter3 = filters3.get("Sort by").get(ApiSettings.sortBy);

    return filter3.url
}

return filter2.url
}


function getSeconds(_string: string): number {
    if(!_string.includes(":")) throw new Error("The String does not match the accepted the Pattern EX: 3:33");

    const Index = _string.indexOf(":");
    const Seconds = Number(_string.slice(Index + 1));

    return Seconds;
}

function getMinutes(_string: string): number {
    if(!_string.includes(":")) throw new Error("The String does not match the accepted the Pattern EX: 3:33");

    const Index = _string.indexOf(":");
    const Minutes = Number(_string.slice(0, Index));

    return Minutes * 60;
}


function ConvertDuration(DurationInString: string): number {
    return (getSeconds(DurationInString) + getMinutes(DurationInString)) * 1000;
}