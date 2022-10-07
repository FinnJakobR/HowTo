import { GenerateNewWord } from "../AI/OpenAi";




async function TestOpenAi(prompt: string) {

    setTimeout(async ()=>{
        console.log("RUN")
        const data = await GenerateNewWord(prompt);
    
        console.log(data);
    }, 1500)
}

for (let index = 0; index < 1; index++) {
    TestOpenAi("How to play piano");
    
}
