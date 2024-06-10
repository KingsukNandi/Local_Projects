let songs = [];
let directories = [];
let songsHTML;
let fetchURL = "http://127.0.0.1:5500/Projects/Local_Music_Player/songs/";
let prevURL;
var currSong = new Audio();
currSong.muted = false;
const jsmediatags = window.jsmediatags;

async function generateSongList() {
  songsHTML = await fetch(`${fetchURL}`);

  let songsHTMLText = await songsHTML.text();

  let div = document.createElement("div");

  div.innerHTML = songsHTMLText;

  let directoriesLinks = div.querySelectorAll(`.icon-directory`);

  for (let i = 1; i < directoriesLinks.length; i++) {
    main_content.innerHTML =
      main_content.innerHTML +
      `<div id=${directoriesLinks[i].title}>${directoriesLinks[i].title}</div>`;
    // console.log(directoriesLinks[i].title);
    directories.push(directoriesLinks[i]);
  }

  let songLinks = div.getElementsByTagName("a");

  songs = []; // this sets an empty list of songs everytime the songs folder is modified

  for (const song of songLinks) {
    if (song.href.endsWith(".mp3")) {
      let newSong = {
        title: song.getAttribute("title"),
        url: song.href,
      };

      let tag = await displayMetadata(newSong);

      newSong.tag = tag;

      // const data = tag.tags.picture.data;
      // const format = tag.tags.picture.format;
      // let base64string = "";

      // for (let i = 0; i < data.length; i++) {
      //   base64string += String.fromCharCode(data[i]);
      // }

      // console.log(tag);

      songs.push(newSong);

      let songPlaceholder = document
        .querySelector(".libraryList")
        .getElementsByTagName("ol")[0];

      songPlaceholder.innerHTML =
        songPlaceholder.innerHTML +
        `<li class="flex">
          <div>
            ${
              /* <img src=url(data:${format};base64,${window.btoa(
              base64string
            )})> */ ``
            }
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
  // console.log(songs);
  return songsHTML;
}

async function setEvents(songsHTML) {
  for (let i = 0; i < directories.length; i++) {
    main_content
      .getElementsByTagName("div")
      [i].addEventListener("dblclick", function () {
        fetchURL = directories[i].href;
        libraryListOL.innerText = ``;
        let splitURL = directories[i].href.split("/");
        prevURL = ``;
        for (let j = 0; j < splitURL.length - 1; j++) {
          prevURL += splitURL[j] + "/";
        }
        main();
      });
  }

  for (let i = 0; i < songs.length; i++) {
    const element = songs[i];

    document
      .getElementsByClassName("libraryList")[0]
      .getElementsByTagName("li")
      [i].addEventListener("dblclick", function () {
        currSong.src = songs[i].url;

        if (!currSong.muted) {
          currSong.play();
          superControl.src = "assets/pauseCircle.svg";
        } else {
          duration.textContent = ``;
        }

        songName.textContent = `${songs[i].tag.tags.title}`;
        artistName.textContent = `${songs[i].tag.tags.artist}`;
      });

    // console.log(i);
  }

  prevPage.addEventListener("click", function previousPage() {
    fetchURL = prevURL;
    libraryListOL.innerText = ``;
    main_content.innerHTML = ``;
    main();
  });
  // console.log("hi");
  superControl.addEventListener("click", function () {
    if (currSong.paused) {
      currSong.play();
      superControl.src = "assets/pauseCircle.svg";
    } else {
      currSong.pause();
      superControl.src = "assets/playCircle.svg";
    }
  });

  libraryRescan.addEventListener("click", async function () {
    libraryListOL.innerText = "";
    main();
  });

  repeat.addEventListener("click", function () {
    if (currSong.loop) {
      currSong.loop = false;
      repeat.src = "assets/repeatOff.svg";
    } else {
      currSong.loop = true;
      repeat.src = "assets/repeatOn.svg";
    }
  });

  currSong.addEventListener("timeupdate", function () {
    currTime.textContent = formatTime(currSong.currentTime);

    if (currSong.duration === `NaN`) {
      duration.textContent = ``;
    } else {
      duration.textContent = formatTime(currSong.duration);
    }

    progress.style.width =
      (100 * currSong.currentTime) / currSong.duration + "%";
  });

  seekBar.addEventListener("mouseover", function () {
    pointer.style.backgroundColor = `rgb(0, 104, 232)`;
    progressBar.style.backgroundColor = `white`;
  });

  seekBar.addEventListener("mouseout", function () {
    pointer.style.backgroundColor = `rgba(0, 104, 232, 0)`;
    progressBar.style.backgroundColor = `rgb(163, 163, 163)`;
  });

  progressBarContainer.addEventListener("click", function (event) {
    currSong.currentTime =
      (currSong.duration * event.offsetX) / progressBarContainer.offsetWidth;
  });

  un_or_mute.addEventListener("click", function mute_unmute() {
    if (currSong.muted) {
      currSong.muted = false;
      currSong.play();
      superControl.src = "assets/pauseCircle.svg";
      un_or_mute.src = "assets/volume.svg";
      muted.style.top = "0px";
      duration.textContent = ``;
    } else {
      currSong.muted = true;
      currSong.pause();
      superControl.src = "assets/playCircle.svg";
      un_or_mute.src = "assets/noVolume.svg";
      muted.style.top = "-105px";
      setTimeout(() => {
        muted.style.top = "0px";
      }, 2500);
    }
  });

  volume.oninput = function () {
    currSong.volume = volume.value / 100;
    if (currSong.volume == 0) {
      mute_unmute();
    }
  };

  return songsHTML;
}

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  return `${minutes}:${padZero(seconds)}`;
}

function padZero(num) {
  return (num < 10 ? "0" : "") + num;
}

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

async function main() {
  songs = [];
  directories = [];
  main_content.innerText = ``;
  libraryListOL.innerHTML = ``;
  let songsHTML = await generateSongList();
  songsHTML = await setEvents(songsHTML);
}

main();
