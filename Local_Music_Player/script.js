let songs = [];
var currSong;
const jsmediatags = window.jsmediatags;

async function generateSongList() {
  let songsHTML = await fetch(
    "http://127.0.0.1:5500/Projects/Local_Music_Player/songs/"
  );

  let songsHTMLText = await songsHTML.text();

  let div = document.createElement("div");

  div.innerHTML = songsHTMLText;

  let songLinks = div.getElementsByTagName("a");

  songs = [];

  let index = 0;

  for (const song of songLinks) {
    if (song.href.endsWith(".mp3")) {
      let newSong = {
        title: song.getAttribute("title"),
        url: song.href,
      };

      songs.push(newSong);

      let songPlaceholder = document
        .querySelector(".libraryList")
        .getElementsByTagName("ol")[0];

      songPlaceholder.innerHTML =
        songPlaceholder.innerHTML +
        `<li><div class="title">${newSong.title}</div><div class="artist">${newSong.artist}</div></li>`;

      songPlaceholder
        .getElementsByTagName("li")
        [index].addEventListener("dblclick", function () {
          currSong = new Audio(newSong.url);
          currSong.play();
        });

      ++index;
    }
  }
  console.log(songs);
}
generateSongList();
