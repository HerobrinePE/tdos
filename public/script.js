async function get() {
  let text = document.getElementById("Youtube").value;
  let select = document.getElementById("Format").value;
if(!text) {
  alert("Please paste a valid youtube link")
}
  let format = {
    ytLink: text,
    selection: select
  };
  fetch("/ytdl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(format, null, 2)
  });
  setTimeout(() => {
    fetch("/d").then(res => {
      res.json().then(data => {
        let video = JSON.stringify(data);
        document.getElementById("video").innerHTML = `
        <p>video:${data[0].song}</p>
        <center>
        <iframe width="350" height="200"
src="${data[0].link}">
</iframe>
</center>
<a src="${data[0].path}" download><button style=" position:absolute;left:7%;border-radius: .30em;
 width:100px; height:35px;;background-color:lavender; text-align:center;" onclick="callback()">Download</button></a>
        `;
      });
    });
  }, 2000);
}
function callback(){
  window.open("/download")
}