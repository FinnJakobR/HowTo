import { GenerateNewWord } from "../AI/OpenAi";


const TestPromps = ["How to p"]


async function TestOpenAi(prompt: string) {
    console.log("RUN")
    const data = await GenerateNewWord(prompt);

    console.log(data);
}

for (let index = 0; index < 1; index++) {
    TestOpenAi("How to play piano");
    
}
