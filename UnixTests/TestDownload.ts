import { DownloadAndConvertVideo } from "../VideoOps/Download";



function TestDownload(): void {
    DownloadAndConvertVideo("https://www.youtube.com/watch?v=cpIwMZ3cUEc", "Finn", 0);

    return;
}

TestDownload();