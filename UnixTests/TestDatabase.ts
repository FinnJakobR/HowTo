

import axios from "axios";
import { DequeueOpApi, EnqueueOpApi } from "../Api/DataApi";



async function POST(id: string) {
 await EnqueueOpApi("dsiuhfsuhfsf", {_ID: "dsiuhfsuhfsf", URL: null, QUESTION: "WAS GEHT"});
  const Data = await DequeueOpApi("api");

  console.log(Data);
};

POST("UU");
