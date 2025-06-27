async function getSongs() {
    const a = await fetch("http://127.0.0.1:3000/songs/");
    const response = await a.text();
    const div = document.createElement("div");
    div.innerHTML = response;
    const as = div.getElementsByTagName("a");

    const songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}


let currentSongUrl = null;
let isPlaying = false;
let currentIndex = -1;
let songsList = [];
window.audioPlayer = new Audio();

function formatSongName(song) {
    return song
        .split("/").pop()
        .replace(".mp3", "")
        .replaceAll("%20", " ")
        .replaceAll("(webmusic.in)_", "")
        .replaceAll(/\d+/g, "")
        .replaceAll(".", " ")
        .trim();
}

function updateFooter(songName) {
    const footerCover = document.querySelector(".footer-cover");
    const footerTitle = document.querySelector(".footer-title");
    const footerMeta = document.querySelector(".footer-meta");

    footerCover.src = "./music.svg";
    footerTitle.textContent = songName;
    footerMeta.textContent = "Album: Unknown";
}

function playSongAt(index) {
    if (index < 0 || index >= songsList.length) return;

    const allLis = document.querySelectorAll(".song-item");
    allLis.forEach(li => li.classList.remove("playing"));

    const selectedLi = allLis[index];
    selectedLi.classList.add("playing");

    const songUrl = songsList[index];
    currentSongUrl = songUrl;
    currentIndex = index;

    window.audioPlayer.src = songUrl;
    window.audioPlayer.play();

    const playPauseImg = document.querySelector(".play-pause img");
    playPauseImg.src = "pause.svg";


    updateFooter(formatSongName(songUrl));
}

document.addEventListener("DOMContentLoaded", () => {
    const playPauseBtn = document.querySelector(".play-pause");
    const playPauseImg = playPauseBtn.querySelector("img");
    const nextBtn = document.querySelector(".play-forward");
    const prevBtn = document.querySelector(".play-previous");
    const libraryBtn = document.querySelector(".liabrary");
    const leftSideBar = document.querySelector(".create-container");
    const suffleBtn = document.querySelector(".suffle");


    playPauseBtn.classList.add("disabled");

    playPauseBtn.addEventListener("click", () => {
        if (!currentSongUrl) return;

        if (window.audioPlayer.paused) {
            window.audioPlayer.play();
            playPauseImg.src = "pause.svg";
        } else {
            window.audioPlayer.pause();
            playPauseImg.src = "play.svg";
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < songsList.length - 1) {
            playSongAt(currentIndex + 1);
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            playSongAt(currentIndex - 1);
        }
    });

    suffleBtn.addEventListener("click", () => {
        if (songsList.length === 0) return;
        const randomIndex = Math.floor(Math.random() * songsList.length);
        playSongAt(randomIndex);
        playPauseBtn.classList.remove("disabled");
    });

    libraryBtn.addEventListener("click", async () => {
        document.querySelector(".playlist-capsule")?.remove();
        document.querySelector(".podcast-capsule")?.remove();

        const songs = await getSongs();
        songsList = songs;

        if (!document.querySelector(".songLists")) {
            const ul = document.createElement("ul");
            ul.classList.add("songLists");

            songs.forEach((song, index) => {
                const li = document.createElement("li");
                li.classList.add("invert", "pointer", "song-item");
                li.style = "display: flex; align-items: center; gap: 12px; margin: 10px 0; ";

                const coverImg = document.createElement("img");
                coverImg.src = "./music.svg";
                coverImg.style = "width: 50px; height: 50px; object-fit: cover;";

                const songName = formatSongName(song);

                const textInfo = document.createElement("div");
                textInfo.innerHTML = `
                    <div style="font-weight: bold;">${songName}</div>
                    <div style="font-size: 12px;">Album: Unknown</div>
                    <div style="font-size: 12px;">Genre: Unknown</div>
                    <div style="font-size: 12px;">Length: 00:00 | Size: 0 MB</div>
                `;

                li.appendChild(coverImg);
                li.appendChild(textInfo);

                li.addEventListener("click", () => {
                    playSongAt(index);
                    playPauseBtn.classList.remove("disabled");
                });

                ul.appendChild(li);
            });

            leftSideBar.appendChild(ul);
        }
    });
});
window.audioPlayer.addEventListener("ended", () => {
    if (currentIndex < songsList.length - 1) {
        playSongAt(currentIndex + 1);
    } else {
        console.log("End of playlist");
        currentIndex = -1;
        currentSongUrl = null;

        const playPauseImg = document.querySelector(".play-pause img");
        playPauseImg.src = "play.svg";

        updateFooter("No song playing");
    }
});
