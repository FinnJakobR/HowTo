
const {OpenAiOp} = require("../AI/OpenAiOp.js");


const Runs = 30; //wie viele Runs möchtest du Simulieren 
const StartQuestion = "How to play uno?" //Mit welcher Frage möchtest du Starten

async function TestOpenAiPrompts(){
    const op = new OpenAiOp();
    var newPrompt = StartQuestion;

    for (let index = 0; index < Runs; index++) {
        console.log(newPrompt + ":");

        var testdata = await op.createNewPrompt(newPrompt);
        
        console.log(testdata);

        console.log("--------------")

        newPrompt = testdata;
    }
}


TestOpenAiPrompts();