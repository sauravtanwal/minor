console.log('lets write javaScript')
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "Invalid input";

    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds =Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {

        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}


const playMusic = (track,pause=false)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src ="/songs/"+track
    if(!pause){
        currentSong.play()
        play.src ="logo/pause.svg"
    }
    // currentSong.play()
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:4/0"
}

async function main() {

    let songs = await getSongs();
    // console.log(songs)
    playMusic(songs[0],true)
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="logo/music.svg" alt="">
        <div class="info">

            <div>${song.replaceAll("%20", " ")}</div>
            <div>saurav</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="logo/play.svg" alt="">
        </div>
    </li>`

    }
    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    });
    //Attach an event listener to play next and pause
    const playB = document.querySelector("#play")
    playB.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            playB.src ="logo/pause.svg"
        }
        else{
            currentSong.pause()
            playB.src = "logo/play.svg"
        }
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}:${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left =(currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    //Add an event to seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let persent =(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=persent +"%";
        currentSong.currentTime =((currentSong.duration)* persent)/100
    })


}
main()