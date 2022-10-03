import { Configuration, OpenAIApi} from 'openai';
import { sleep } from '../Libary/Libary';
import { OpenAiSettings } from '../Settings/Settings';
import {distance} from 'fastest-levenshtein';
import { GetPromptApi, SavePromptApi } from '../Api/DataApi';

const OpenAiconfiguration = new Configuration({
    apiKey: OpenAiSettings.apikey
});

const OpenAIRequest = new OpenAIApi(OpenAiconfiguration);

export async function GenerateNewWord (prompt: string): Promise<string | null>{
   
    if(!prompt.includes("?")) prompt+="?";
   
    //Checken ob diser Prompt schon mal verwendet wurde 

    const GeneratedPrompt = await GetPromptApi(prompt);

    if(GeneratedPrompt) return GeneratedPrompt;
    
    //Generate mit der OpenAi Api mehrere neue Promps

    var GeneratedPromps = "";

    var NumOfGeneratedPromps = 0;

    while (NumOfGeneratedPromps < OpenAiSettings.NumPerRun) {
      
        const comp = await OpenAIRequest.createCompletion({model: OpenAiSettings.model, prompt: prompt + "\n"});
         
        await sleep(OpenAiSettings.delayMs);
         
         if(comp){
            
            const NewPrompt: string | undefined = comp.data!.choices![0].text?.toLowerCase() ?? "";
            const isHowTo: boolean = CheckifHowToPrompt(NewPrompt);

            if(isHowTo) {
                GeneratedPromps += comp.data!.choices![0].text?.toLowerCase();
                NumOfGeneratedPromps++;
            }

         }

    }

    const PreprocessedPromps = await PreprocessingData(GeneratedPromps);

    const UsePromptIndex = await CalculateMaxDistance(prompt ,PreprocessedPromps);

    await SavePromptApi(prompt, PreprocessedPromps[UsePromptIndex]);

    if(PreprocessedPromps[UsePromptIndex] === prompt){
        
        const ReSearchedPrompt = await GenerateNewWord(prompt);

        return ReSearchedPrompt;
    }

    return PreprocessedPromps[UsePromptIndex];

}


function CheckifHowToPrompt(prompt: string): boolean{
   if(!prompt.includes("how to")) return false;

   if(!prompt.includes("?")) return false;


   //if(!prompt.includes("->")) return false;

   return true;
}



async function PreprocessingData(UnProcessedString: string): Promise<string[]>{

    const RemoveAllDoubleUmbrueche = UnProcessedString.replaceAll("\n\n", "\n");

    var SplittedData: string[] = RemoveAllDoubleUmbrueche.split("\n");


    for (let SplittedDataIndex = 0; SplittedDataIndex < SplittedData.length; SplittedDataIndex++) {

        if(SplittedData[SplittedDataIndex].includes("->")) console.warn("Achtung SplittedData besitzt ein Pfeil: " + SplittedData[SplittedDataIndex]);

       const IndexOfQuestionMark = SplittedData[SplittedDataIndex].indexOf("?");
       const IndexOfHow = SplittedData[SplittedDataIndex].indexOf("how");
       
       SplittedData[SplittedDataIndex] = SplittedData[SplittedDataIndex].slice(IndexOfHow -1 < 0 ? 0 : IndexOfHow, IndexOfQuestionMark +1);
    }

    SplittedData = [... new Set(SplittedData)];

    const WhiteSpaceIndex = SplittedData.indexOf("");

    if(WhiteSpaceIndex >= 0) SplittedData.removeAtIndex(WhiteSpaceIndex);


    return SplittedData;
}



async function CalculateMaxDistance(prompt: NullSave<string>, GeneratedPrompts : readonly string[]): Promise<number>{
    const Distance = [];
    const Dict : {
        [key: number]: any
    } = {};
    
    for (let index = 0; index < GeneratedPrompts.length; index++) {
         const Dist = distance(prompt, GeneratedPrompts[index]);

         Dict[Dist] = index;

         Distance.push(Dist);
        
    }

    return Dict[Math.max(...Distance)];
}




