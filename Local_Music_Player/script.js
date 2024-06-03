let songs = [];
async function generateSongList() {
  let songsHTML = await fetch(
    "http://127.0.0.1:5500/Projects/Local_Music_Player/songs/"
  );
  let songsHTMLText = await songsHTML.text();
  console.log(songsHTMLText);
  let div = document.createElement("div");
  div.innerHTML = songsHTMLText;
  let songLinks = div.getElementsByTagName("a");
  songs = [];
  for (const iterator of songLinks) {
    if (iterator.href.endsWith(".mp3")) {
      let newSong = {
        title: iterator.getAttribute("title"),
        url: iterator.href,
      };
      songs.push(newSong);
    }
  }
  console.log(songs);
}
generateSongList();
