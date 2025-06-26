async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}
document.addEventListener("DOMContentLoaded", () => {
    const libraryBtn = document.querySelector(".liabrary");
    const leftSideBar = document.querySelector(".create-container");

    libraryBtn.addEventListener("click", async () => {
        const playlistCapsule = document.querySelector(".playlist-capsule");
        if (playlistCapsule) playlistCapsule.remove();

        const podcastCapsule = document.querySelector(".podcast-capsule");
        if (podcastCapsule) podcastCapsule.remove();

        const songs = await getSongs();

        if (!document.querySelector(".songLists")) {
            const ul = document.createElement("ul");
            ul.classList.add("songLists");
            ul.innerHTML=songs.map(song => {
                const fileName = song.split("/").pop();
                return `<li class="invert pointer">${fileName.replaceAll("%20", " ")}</li>`;
            }).join("");

            leftSideBar.appendChild(ul);
        }
    });

 const playPauseBtn = document.querySelector(".play-pause");
    playPauseBtn.addEventListener("click", () => {
        if (!window.audioPlayer.src) return;

        if (window.audioPlayer.paused) {
            window.audioPlayer.play();
        } else {
            window.audioPlayer.pause();
        }
    });
})
async function playSongs() {
    let songs = await getSongs();
    console.log(songs);


}

playSongs();

li.addEventListener("click", () => {
    let playSvg = document.querySelector(".play-pause");
    // Stop existing
    if (!window.audioPlayer) {
        window.audioPlayer = new Audio();
        playSvg.removeChild;
    } else {
        window.audioPlayer.pause();
    }

    // Remove 'playing' from all items
    document.querySelectorAll(".song-item").forEach(item => item.classList.remove("playing"));

    // Mark current as playing
    li.classList.add("playing");

    // Play this song
    window.audioPlayer.src = song;
    window.audioPlayer.play();
});
