import { GenerateNewWord } from "../AI/OpenAi";
import { SearchVideo } from "../Api/Api";


async function StartDebug(): Promise<void>{
    console.log("Start Debug....");

    console.log("First Test the Api Response.... Test for How to play football");

    const response = await SearchVideo("How to play Football?");

    console.log("The Response is: " + response);

    console.log("Now Check the AI with the Same Input as the Api Test...");

    const Ai_response = await GenerateNewWord("How to play football");

    console.log("The Response of the AI is " + Ai_response);

    return;
}