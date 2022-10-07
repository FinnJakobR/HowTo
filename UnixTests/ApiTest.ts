import { SearchVideo } from "../Api/Api";



async function TestApi(request: string): Promise<any> {
  const response = await SearchVideo(request);

   console.log(response);
}


TestApi("How to play cards with friends!");