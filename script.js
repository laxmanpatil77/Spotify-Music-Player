let songs;

let playBtn = document.querySelector('.play-btn');
let playSvg2 = document.querySelector('.song-icon-svg');
let nextBtn = document.querySelector('.next-btn');
let backBtn = document.querySelector('.back-btn');
let playSlider = document.getElementById('play-slider');
let playSvg = document.querySelector('.play-btn-in');
let albumCartDiv = document.querySelector(".album-carts")
let curTime = document.getElementById('cur-time');
let durTime = document.getElementById('dur-time');
let add = document.querySelector('.svg-plus');
let cartIcon;


let counter = 0;
let lastCount = 0;
let checker = false;
let songPlay = "";
let favorite = false;
let loopPlayChecker = false;
let randomPlayChecker = false;
let img = [];
let album = false;
let folderName = "arijit_singh"
let response;




// get a song using fetch function in api
async function getSongs(folder) {
   let a = await fetch(`songs/${folder}/`)
   let res = await a.text();
   let list = document.createElement("div")
   list.innerHTML = res;
   let as = list.getElementsByTagName("a")
   let songs = [];
   let ptr = 0
   for (let index = 0; index < as.length; index++) {
      let elem = as[index].href;
      if (elem.endsWith("mp3")) {
         songs.push(elem.split(`/${folder}/`)[1]);
      }
   }   
   
   document.querySelector(".songs-cart").innerHTML = '';
      let repaint = document.createElement("div")
      for (let i = 0; i < songs.length; i++) {
         repaint.innerHTML += `<div class="cart-song">
         <div id="song-icon" class="play-btns" value=${i}>
         <img class="song-icon-svg" src="./svgs/play1.svg" alt="">
         </div>
         <div class="cart-song-names">
         <span class="song-name">${songs[i].split("%20").join(" ")}</span>
         <span class="play-song">Play Now<span>
         </div>
         </div>`
      }
      document.querySelector(".songs-cart").appendChild(repaint);

   return songs;
}

async function songInfoApi(fld) {
   let a = await fetch(`/songs/${fld}/cover.json`)
   return await a.json();
}


async function displayAlbum(playCartusingCartIcon) {
   let a = await fetch(`/songs/`)
   let res = await a.text();
   let list = document.createElement("div")
   list.innerHTML = res;
   let as = list.getElementsByTagName("a")
   let array = Array.from(as);
   
   for (let idx = 3; idx < array.length; idx++) {
      let folder = array[idx].href.split("/").slice(-1).join();
      response = await songInfoApi(folder)
      albumCartDiv.innerHTML += `<div data-folder="${folder}" class="album-cart">
                                <img src="${response.url}" alt="">
                                <p class="song-name">${response.title}</p>
                                <p class="song-singer">${response.disc}</p>
                                <div class="play-round">
                                    <img class="play-round-img" src="./svgs/play.svg" alt="">
                                </div>
                            </div>`
   }

   document.querySelectorAll(".album-cart").forEach((e) =>{
      e.addEventListener("click", async (item) => {
         let nameOfFolder = item.currentTarget.dataset.folder;
         folderName = nameOfFolder;
         album = true;
         counter = 0;
         songs = await getSongs(nameOfFolder);
         playCartusingCartIcon()
      })
   })
}


async function showSong() {
   let songInfo = document.querySelector(".play-song-info");
   response = await songInfoApi(folderName)
   songInfo.innerHTML = `<div class="img">
                    <img src="${response.url}" alt="">
                </div>
                <span class="song-name">${songs[counter].split("%20").join(" ")}</span>`
}


async function main() {

   songs = await getSongs("arijit_singh");
   displayAlbum(playCartusingCartIcon)
   playCartusingCartIcon()
   showSong()
   
   
   // format the time using song currenttime and duration
   function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
   }
   
   
   
   // this slider function move the slide on song time
   function onSlider() {

      //this function set a max value in slider.
      songPlay.addEventListener('loadedmetadata', function () {
         playSlider.max = songPlay.duration;
      })
   
      songPlay.addEventListener('timeupdate', ()=>{
         playSlider.value = songPlay.currentTime
         playSlider.style.background =  'linear-gradient(to right, #1db954 0%, #1db954 ' + ((songPlay.currentTime / songPlay.duration)*480) + 'px, grey ' + ((songPlay.currentTime / songPlay.duration)*480) + 'px, grey 100%)'
         if(loopPlayChecker){
            if(songPlay.currentTime == songPlay.duration){
               checkersForSongChange()
            }
         }else{
            if(songPlay.currentTime == songPlay.duration){
               img[counter].src = "./svgs/play1.svg"
               randomPlayChecker ? counter = Math.floor(Math.random()*songs.length) : counter = counter+1;
               checkersForSongChange()
            }
         }
         // this function move a slider on click
   
         playSlider.addEventListener("input", (e)=>{
            songPlay.currentTime = e.target.value;
         })

         // show time in web
         curTime.innerText = formatTime(songPlay.currentTime)
         durTime.innerText = formatTime(songPlay.duration || 0)
      })
   
   }
   
   function loopIcons(e) {
      if(e.currentTarget.classList.contains("grey")){
         e.currentTarget.setAttribute('fill', '#1db954');
         e.currentTarget.classList.remove("grey");
      }else{
         e.currentTarget.setAttribute('fill', 'grey');
         e.currentTarget.classList.add("grey");
      }
   }
   
   
   //play this function infinit loop of song
   document.getElementById("infinit-loop-svg").addEventListener("click", (e)=>{
      loopIcons(e)
      loopPlayChecker = !loopPlayChecker;
   })
   
   
   
   // random play a song
   document.getElementById("random-loop-svg").addEventListener("click", (e)=>{
      loopIcons(e);
      randomPlayChecker = !randomPlayChecker;
   })
   
  
   // play a song
   function playSong(track) {
      songPlay = new Audio(`/songs/${folderName}/${songs[counter]}`);
      songPlay.play();
      playSvg.src = "/svgs/pause.svg";
      img[counter].src = "./svgs/pause1.svg"
      checker = true;
      album = false;
      onSlider();
      showSong();
   }

   
   // play a song using play batton 
   const playSongsBtn = () =>{
      if(songPlay.paused && album){
         songPlay.play();
         playSvg.src = "/svgs/pause.svg";
         img[counter].src = "./svgs/pause1.svg"
         checker = true;
         album = false;
      }else{
         playSong()
      }
      lastCount = counter;
      changeCartImg(true)
   }


   function changeCartImg(check) {
      document.querySelectorAll(".album-cart").forEach((e)=>{
         if (e.children[3].children[0].src.split("http://127.0.0.1:5500/")[1] === "svgs/pause.svg" ) {
            e.children[3].children[0].src = "/svgs/play.svg";
         }
         else if (e.dataset.folder === folderName) {
            (check) ? e.children[3].children[0].src = "/svgs/pause.svg" : e.children[3].children[0].src = "/svgs/play.svg"
         }
      })
   }

   // pause a song
   function pauseSongBtn() {
      songPlay.pause()
      playSvg.src = "/svgs/play.svg";
      img[counter].src = "./svgs/play1.svg"
      checker = false
      album = true;
      changeCartImg(false)
   }
   
   // play a song
   playBtn.addEventListener("click", (e) => {
      if(checker){
         pauseSongBtn()
      }else{
         playSongsBtn()
      }  
   })
   
   
   
   
   // next and back a song
   function nextAndBackASong() {
      if(checker){
         songPlay.src = `http://127.0.0.1:5500/songs/${folderName}/${songs[counter]}`
         songPlay.play()
         playSvg.src = "/svgs/pause.svg";
         img[counter].src = "./svgs/pause1.svg"
         checker = true; 
         onSlider()
         changeCartImg(true)
      }else{
         playSongsBtn()
      }
      lastCount = counter
   }
   
   // this function check a value of counter for song loop
   function checkersForSongChange() { 
      if(counter >= songs.length){
         counter = 0;
         nextAndBackASong();
      }else if(counter < 0){
         counter = songs.length-1;
         nextAndBackASong();
         backSongNumber = [];
      }else{
         nextAndBackASong();
      }
   }
   
   // next a song
   nextBtn.addEventListener("click", (e) => {
      img[counter].src = "./svgs/play1.svg"
      console.log(randomPlayChecker);
      if(randomPlayChecker){
         const rnd = Math.floor(Math.random()*songs.length);
         counter = rnd++;
      }else{
         counter++;
         checkersForSongChange()
      }
   
   })
   
   // back a song
   backBtn.addEventListener("click", (e) => {
      img[counter].src = "./svgs/play1.svg"
      counter--;
      checkersForSongChange()
   })

   // check icons and play song using library songs
   function playCartusingCartIcon() {
      img = document.querySelectorAll(".song-icon-svg")
      let dumyUrl = `http://127.0.0.1:5500/songs/${folderName}/${songs[lastCount]}`;
      if (songPlay.src === dumyUrl && checker) {
         img[lastCount].src = "./svgs/pause1.svg"
         checker = true
         counter = lastCount;
         album = !album;
      }

      // loop on library carts to play song
      Array.from(document.querySelectorAll(".play-btns")).forEach((e, val)=>{
         e.addEventListener("click", item=>{
            if(val == counter && !album){
               if(checker){
                  pauseSongBtn()
                  img[val].src = "./svgs/play1.svg"
               }else{
                  playSongsBtn()
                  img[val].src = "./svgs/pause1.svg"
               }
            }else if(checker){
               pauseSongBtn()
               img[counter].src = "./svgs/play1.svg"
               counter = val;
               playSong()
               img[val].src = "./svgs/pause1.svg"
               changeCartImg(true)
            }else{
               counter = val;
               playSongsBtn()
               img[val].src = "./svgs/pause1.svg"
            }
            album = false;
         })
      })
   }


   // volume incress and decress
   let volumeBar = document.querySelector(".volume-range");
   let muteIcon = document.querySelector(".mute-icon")
   volumeBar.addEventListener("input", (e)=>{
      e.target.style.background =  'linear-gradient(to right, #1db954 0%, #1db954 ' + ((e.target.value/100)*100) + 'px, grey ' + ((e.target.value/100)*100) + 'px, grey 100%)'
      if ((e.target.value/100) == 0) {
         songPlay.volume = 0;
         muteIcon.src = "./svgs/mute-icon.svg";
      } else {
         songPlay.volume = (e.target.value/100)
         muteIcon.src = "./svgs/play-icon.svg";
      }
      console.log( ((e.target.value/100)*100) );
   })

   // mute and unmute the song 
   muteIcon.addEventListener("click", (e)=>{
      if (songPlay.volume) {
         songPlay.volume = 0;
         e.target.src = "./svgs/mute-icon.svg";
         volumeBar.value = 0;
         volumeBar.style.background =  'linear-gradient(to right, #1db954 0%, #1db954 ' + 0 + 'px, grey ' + 0 + 'px, grey 100%)'
      }else{
         songPlay.volume = 1;
         e.target.src = "./svgs/play-icon.svg";
         volumeBar.value = 100;
         volumeBar.style.background =  'linear-gradient(to right, #1db954 0%, #1db954 ' + ((volumeBar.value/100)*100) + 'px, grey ' + ((volumeBar.value/100)*100) + 'px, grey 100%)'

      }
      volumeBar.classList.toggle("hover");
   })


}

main();