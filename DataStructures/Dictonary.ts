import { ReadPromptFile, saveInFile } from "../FileOperations/FileOP";
import { GeneralSettings } from "../Settings/Settings";


var Dictonary: {
    [key: string]: string,
   } = {};



async function ReadPrompsTXT(): Promise<string>{
    const Promps: string = await ReadPromptFile(GeneralSettings.path+"/Promps.txt");

    return Promps;
}

export function SaveInDict(prompt: string, generatedPrompt: string): void{

    Dictonary[prompt] = generatedPrompt;

    return;
}

 export async function saveFilePromps(): Promise<void>{
    const data = await ReadPrompsTXT();
    
    if(data.length > 0){
      Dictonary = JSON.parse(data);
    }
    
    return;
 }

 export async function savePromptsInFile (): Promise<void>{

   console.log("SAVE PROMPS In FILE");
    const StringLDict: string = JSON.stringify(Dictonary);
    await saveInFile(StringLDict);
 }

 export function GetGeneratedPrompt(prompt: string): string | null {
    const GeneratedPromp = Dictonary[prompt];
    return GeneratedPromp;
 }


 saveFilePromps();