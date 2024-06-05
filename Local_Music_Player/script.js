let songs = [];
var currSong = new Audio();
const jsmediatags = window.jsmediatags;

async function generateSongList() {
  let songsHTML = await fetch(
    "http://127.0.0.1:5500/Projects/Local_Music_Player/songs/"
  );

  let songsHTMLText = await songsHTML.text();

  let div = document.createElement("div");

  div.innerHTML = songsHTMLText;

  let songLinks = div.getElementsByTagName("a");

  // songs = []; // this sets an empty list of songs everytime the songs folder is modified

  for (const song of songLinks) {
    if (song.href.endsWith(".mp3")) {
      let newSong = {
        title: song.getAttribute("title"),
        url: song.href,
      };

      let tag = await displayMetadata(newSong);
      const data = tag.tags.picture.data;
      const format = tag.tags.picture.format;
      let base64string = "";
      for (let i = 0; i < data.length; i++) {
        base64string += String.fromCharCode(data[i]);
      }
      let url = console.log(tag);

      songs.push(newSong);

      let songPlaceholder = document
        .querySelector(".libraryList")
        .getElementsByTagName("ol")[0];

      songPlaceholder.innerHTML =
        songPlaceholder.innerHTML +
        `<li class="flex">
          <div>
            <!-- <img src=url(data:${format};base64,${window.btoa(
          base64string
        )})> --> 
          </div>
          <div>
            <div class="title">
              ${tag.tags.title}
            </div>
            <div class="artist">
              ${tag.tags.artist}
            </div>
          </div>
        </li>`;
    }
  }
  console.log(songs);
  return songsHTML;
}
async function setEvent(songsHTML) {
  for (let i = 0; i < songs.length; i++) {
    const element = songs[i];
    document
      .getElementsByClassName("libraryList")[0]
      .getElementsByTagName("li")
      [i].addEventListener("dblclick", function () {
        currSong.src = songs[i].url;
        currSong.play();
        superControl.src = "assets/pauseCircle.svg";
        console.log(i);
      });
    console.log(i);
  }
  superControl.addEventListener("click", function () {
    if (currSong.paused) {
      currSong.play();
      superControl.src = "assets/pauseCircle.svg";
    } else {
      currSong.pause();
      superControl.src = "assets/playCircle.svg";
    }
  });
  return songsHTML;
}
async function main() {
  let songsHTML = await generateSongList();
  songsHTML = await setEvent(songsHTML);
}
main();
function displayMetadata(newSong) {
  return new Promise((resolve, reject) => {
    jsmediatags.read(newSong.url, {
      onSuccess: function (tag) {
        // console.log(tag.tags.title);
        // console.log(tag.tags.artist);
        // console.log(tag.tags.album);
        // console.log(tag.tags.genre);
        resolve(tag);
      },
      onError: function (error) {
        console.log(`error`);
        reject(error);
      },
    });
  });
}
