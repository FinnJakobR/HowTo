import fs from "fs";
import { GeneralSettings } from "../Settings/Settings";


const USERS: USER_DATABASE = {};


export function ChangeTimeStamp(_id: string, newTimeStamp: number): void {
  
    USERS[_id]!.NextTimeStampsMs+=newTimeStamp;

    USERS[_id]!.VideoIndexLengths[ USERS[_id]!.videos] = newTimeStamp;

  return;
}

export function GetIndexLength(_id: string, index: number): number {

  return USERS[_id]!.VideoIndexLengths[index];
}

export function isAllreadyRequested(_id: string, FileName: string): boolean {
  
  if(USERS[_id]!.RequestedFiles[FileName]) return true;

  return false;
}


export function ADD_User(_id: string): void {
  
    USERS[_id] = {
    _id: _id,
    videos: 0,
    NextTimeStampsMs: 0,
    StreamFileStream: null,
    VideoIndexLengths: {},
    RequestedFiles: {}
  }

  return;

}

export function AddVideoToUser(_id: string): void {
  
    USERS[_id]!.videos = USERS[_id]!.videos +1;

  return;

}

export function IsUserConnected(_id: string): boolean {
    
    if(USERS[_id]) return true;

    else return false;
}

export function RemoveUser(_id: string): void {
   
   USERS[_id]?.StreamFileStream?.destroy();
   
    USERS[_id] = null;

   return;
}

export function GETUserData(_id:string): any{
    return USERS[_id];
}

export function AddFileStream(_id: string): void {
  USERS[_id]!.StreamFileStream = fs.createWriteStream(`../${GeneralSettings.VideoDirName}/${_id}/index.m3u8`, { flags: 'a' });
}

export function GetStream(_id: string): fs.WriteStream {
  return USERS[_id]!.StreamFileStream!;
}