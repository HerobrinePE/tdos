const express = require("express");
const ytdl = require("ytdl-core");
const app = express();
const fs = require("fs");
app.use(express.static("public"));
app.set("view engine", "html");
app.use(express.urlencoded());
app.use(express.json());
let fileInfo = [];
var songInfo = [];
console.log(Math.floor(Math.random() * 16777215).toString(16))
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
app.post("/ytdl", async (req, res) => {
  let val = await { link: req.body.ytLink, selection: req.body.selection };
  loader(val);
});
async function loader(val) {
  console.log(val);
  if (val.selection === ".mp3") {
    console.log("music");
    await ytdl.getBasicInfo(val.link).then(vaw => {
      const file = `download/${vaw.videoDetails.title}${val.selection}`;
      let eInfo = [
        file,
        vaw.videoDetails.embed.iframeUrl,
        vaw.videoDetails.title,
        vaw.videoDetails.videoId,
        vaw.videoDetails.thumbnails[0].url
      ];
      fileInfo.push(eInfo);
      songInfo.push(file);
    });
    let yt = await ytdl(fileInfo[0][3], { filter: "audioonly" }).pipe(
      fs.createWriteStream("download/" + fileInfo[0][2] + ".mp3")
    );
    yt.on(
      "finish",
      () => {
        console.log("fin");
        app.get("/d", (req, res) => {
          console.log(fileInfo);
          let data = {
            song: fileInfo[0][2],
            link: val.link,
            thumbnail:fileInfo[0][4]
          };
          console.log(data);
          res.json(data);
        });
        app.get("/download", async (req, res) => {
          let file = `/app/${songInfo[0].split("'").join("")}`;
          res.download(fileInfo[0][0], fileInfo[0][2], err => {
            if (err) throw err;
            fs.unlink(file, err => {
              if (err) throw err;
            });
          });
          fileInfo.splice(0, fileInfo.length);
          console.log(fileInfo);
        });
      },
      3000
    );
  } else {
    console.log("video");
    
    
  }
}
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
