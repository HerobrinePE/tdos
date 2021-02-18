const express = require("express");
const ytdl = require("ytdl-core");
const app = express();
const fs = require("fs");
app.use(express.static("public"));
app.set("view engine", "html");
app.use(express.urlencoded());
app.use(express.json());
let fileInfo = [];
let y = app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
app.post("/ytdl", async (req, res) => {
  let dir = await req.body;
  await ytdl.getBasicInfo(dir.ytLink).then(vaw => {
    const file = `download/${vaw.videoDetails.title}${dir.selection}`;
    var name = vaw.videoDetails.title;
    let eInfo = {
      file: file,
      link: vaw.videoDetails.embed.iframeUrl,
      song: `${vaw.videoDetails.title}`
    };
    nu(eInfo);
    app.get("/d", (req, res) => {
      res.json(eInfo);
    });
    if (dir.selection === ".mp3") {
      ytdl(vaw.videoDetails.videoId, {
        filter: "audioonly"
      }).pipe(
        fs.createWriteStream("download/" + vaw.videoDetails.title + ".mp3")
      );
    }
  });
});
function nu(eInfo) {
  app.get("/download", async (req, res) => {
    setTimeout(() => {
      res.download(eInfo.file, eInfo.name, err => {
        if (err) throw err;
        fs.unlink("/app/" + eInfo.file, err => {
          if (err) throw err;
        });
      });
    }, 2000);
    fileInfo.splice(0, fileInfo.length);
  });
}

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
