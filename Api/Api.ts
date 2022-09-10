import {getFilters} from "ytsr";
import ytsr from "ytsr";
import { ApiSettings } from "../Settings/Settings";

const Options: ytsr.Options = {
    safeSearch: ApiSettings.safeSearch,
    pages: ApiSettings.page,
    limit: ApiSettings.limit,
}

export async function SearchVideo(request: string): Promise<API_RESPONSE> {

const Filter: string = await CreateFilters(request);

const response: ytsr.Result = await ytsr(Filter, Options);

const DurationInString = response.items[0].type == "video" ? response.items[0].duration : console.log("This Result Item is not a Video");

const DurationinMs: number = ConvertDuration(DurationInString!);

const VideoUrl = response.items[0].type == "video" ? response.items[0].url : console.log("This Result Item is not a Video")

const ReturnData: API_RESPONSE = {
  ID: response.items[0].type == "video" ? response.items[0].id : console.log("This Result Item is not a Video"),
  NAME: response.items[0].type == "video" ? response.items[0].title : console.log("This Result Item is not a Video"),
  DURATION: DurationinMs,
  URL: VideoUrl!

}

return ReturnData;

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