"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateNewWord = void 0;
const openai_1 = require("openai");
const Dictonary_1 = require("../DataStructures/Dictonary");
const Libary_1 = require("../Libary/Libary");
const Settings_1 = require("../Settings/Settings");
const fastest_levenshtein_1 = require("fastest-levenshtein");
const OpenAiconfiguration = new openai_1.Configuration({
    apiKey: Settings_1.OpenAiSettings.apikey
});
const OpenAIRequest = new openai_1.OpenAIApi(OpenAiconfiguration);
async function GenerateNewWord(prompt) {
    if (!prompt.includes("?"))
        prompt += "?";
    //Checken ob diser Prompt schon mal verwendet wurde 
    if ((0, Dictonary_1.GetGeneratedPrompt)(prompt))
        return (0, Dictonary_1.GetGeneratedPrompt)(prompt);
    //Generate mit der OpenAi Api mehrere neue Promps
    var GeneratedPromps = "";
    var NumOfGeneratedPromps = 0;
    while (NumOfGeneratedPromps < Settings_1.OpenAiSettings.NumPerRun) {
        const comp = await OpenAIRequest.createCompletion({ model: Settings_1.OpenAiSettings.model, prompt: prompt + "\n" });
        await (0, Libary_1.sleep)(Settings_1.OpenAiSettings.delayMs);
        if (comp) {
            const NewPrompt = comp.data.choices[0].text?.toLowerCase() ?? "";
            const isHowTo = CheckifHowToPrompt(NewPrompt);
            if (isHowTo) {
                GeneratedPromps += comp.data.choices[0].text?.toLowerCase();
                NumOfGeneratedPromps++;
            }
        }
    }
    const PreprocessedPromps = await PreprocessingData(GeneratedPromps);
    const UsePromptIndex = await CalculateMaxDistance(prompt, PreprocessedPromps);
    (0, Dictonary_1.SaveInDict)(prompt, PreprocessedPromps[UsePromptIndex]);
    return PreprocessedPromps[UsePromptIndex];
}
exports.GenerateNewWord = GenerateNewWord;
function CheckifHowToPrompt(prompt) {
    if (!prompt.includes("how to"))
        return false;
    if (!prompt.includes("?"))
        return false;
    //if(!prompt.includes("->")) return false;
    return true;
}
async function PreprocessingData(UnProcessedString) {
    const RemoveAllDoubleUmbrueche = UnProcessedString.replaceAll("\n\n", "\n");
    var SplittedData = RemoveAllDoubleUmbrueche.split("\n");
    for (let SplittedDataIndex = 0; SplittedDataIndex < SplittedData.length; SplittedDataIndex++) {
        if (SplittedData[SplittedDataIndex].includes("->"))
            console.warn("Achtung SplittedData besitzt ein Pfeil: " + SplittedData[SplittedDataIndex]);
        const IndexOfQuestionMark = SplittedData[SplittedDataIndex].indexOf("?");
        const IndexOfHow = SplittedData[SplittedDataIndex].indexOf("how");
        SplittedData[SplittedDataIndex] = SplittedData[SplittedDataIndex].slice(IndexOfHow - 1 < 0 ? 0 : IndexOfHow, IndexOfQuestionMark + 1);
    }
    SplittedData = [...new Set(SplittedData)];
    const WhiteSpaceIndex = SplittedData.indexOf("");
    if (WhiteSpaceIndex >= 0)
        SplittedData.removeAtIndex(WhiteSpaceIndex);
    return SplittedData;
}
async function CalculateMaxDistance(prompt, GeneratedPrompts) {
    const Distance = [];
    const Dict = {};
    for (let index = 0; index < GeneratedPrompts.length; index++) {
        const Dist = (0, fastest_levenshtein_1.distance)(prompt, GeneratedPrompts[index]);
        Dict[Dist] = index;
        Distance.push(Dist);
    }
    return Dict[Math.max(...Distance)];
}
