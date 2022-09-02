
const {OpenAiSettings} = require("../Settings/Settings.js")
const { FileSystemOps } = require("../Verschiedenes/FileSystem.js");

const { Configuration, OpenAIApi} = require("openai");
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

const OpenAiconfiguration = new Configuration({
    apiKey: OpenAiSettings.apiKey
});


class OpenAiOp {
    constructor(){
        this.model = OpenAiSettings.model;
    }

   async createNewPrompt(prompt){
     if(!prompt) throw new Error("Der Prompt ist undefined");

     if(!prompt.includes("?")) prompt += "?";

     const searchInModel = new FileSystemOps().AllreadyPrompted(prompt);

     if(searchInModel) return searchInModel; //Fall wenn der Prompt schon einmal generiert wurde
     

     const OpenAIRequest = new OpenAIApi(OpenAiconfiguration);

     var data = "";

     for (let index = 0; index < OpenAiSettings.NumPerRun; index++) {
         const comp = await OpenAIRequest.createCompletion({model: this.model, prompt: prompt + "\n"});
         await Delay(OpenAiSettings.delayMs);
         data += comp.data.choices[0].text.toLowerCase();
     }

     const convData = this.convData(data);


     if(convData.length == 0){ //Es wurde keine How To Frage generiert
        const newData = await this.createNewPrompt(prompt);
        return newData
     }

     const TsOp = new TensorflowOp(prompt);

     const choice = await TsOp.CompareItems(convData);

    return choice;
    }

    getKey(){
      return OpenAiSettings.apiKey;
    }

    convData(data){
        const step1 = data.split("\n"); 
        const step2 = [... new Set(step1)]; //löscht alle gleichen Elemente
        
        const WhiteSpaceIndex = step2.indexOf(""); //löscht alle WhiteSpaces wenn es welche gibt 
        
        step2.splice(WhiteSpaceIndex, 1);

        const step3 = [];

        for (let index = 0; index < step2.length; index++) {
            if(step2[index].length > 7) { //Dafür dass man nur wirkliche Sätze kriegt und nicht nur How To...
                const Step3Data = step2[index].slice(0, step2[index].indexOf("?") + 1).replace("->",""); //Convertiert Strings die so zb: How To play Football? -> How to get a Ball

               if(Step3Data != '' && Step3Data.toLowerCase().includes("how to")) step3.push(Step3Data); //fügt in das neue Array nur Strings die how to in der Frage haben
            }
            
        }

        const step4 = [... new Set(step3)]
    
        return step4;
    }

    getModel(){
     return OpenAiSettings.model
    }

}

const Delay = (ms) =>{
    return new Promise(res => setTimeout(res,ms));
 }


class TensorflowOp {
   constructor(prompt){
    if(!prompt) throw new Error("Der prompt kann nicht undefined sein");
    this.prompt = prompt;
   }

   async CompareItems(Items){
    const Sorting = [];
    var comparision = await use.loadQnA().then((model)=>{
        const input = {
            queries: [this.prompt],
            responses: Items
        };
        var scores; 
        const embeddings = model.embed(input);
        scores = tf.matMul(embeddings['queryEmbedding'],
        embeddings['responseEmbedding'], false, true).dataSync();
 
        for (let index = 0; index < Items.length; index++) {
            Sorting.push({
                "choice": Items[index],
               "score": scores[index]
            });
            var SortedData = this.sort(Sorting);
            const fileOp = new FileSystemOps();
            
             for (let index = 0; index < SortedData.length; index++) {
                if(SortedData[index].choice != this.prompt) {
                    fileOp.createNewModelPrompt(this.prompt, SortedData[index].choice);
                    return SortedData[index].choice;
                }
                
             }
        }
     });

     
     return comparision
   }

   sort(arr){
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {

            if (arr[j + 1].score < arr[j].score) {

                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
            }
        }
    };
    return arr;
   }

}


module.exports = {OpenAiOp};