import { Plugin } from "decky-frontend-lib";
import { spawn } from "child_process";

export default class AmazonMusicPlugin extends Plugin {
  onActivate() {
    console.log("Amazon Music Plugin aktiviert");
  }

  async searchSong(query: string) {
    return new Promise((resolve, reject) => {
      const pyProcess = spawn("python3", ["./backend/amazon_music.py", query]);

      let output = "";
      pyProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pyProcess.stderr.on("data", (data) => {
        console.error(data.toString());
      });

      pyProcess.on("close", (code) => {
        if (code === 0) {
          resolve(JSON.parse(output));
        } else {
          reject("Python process error");
        }
      });
    });
  }
}
