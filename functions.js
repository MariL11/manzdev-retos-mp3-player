let count = 0;
let data_songs = [];

let musicTitle;
let musicArtist;
let musicImage;
let musicAudio

let listSongs;

let musicIcon;
const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#000000" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`;
const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#000000" d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>`;


let audio;
let prevMusic;
let play;
let nextMusic;
let sound=true;

let progressBar;

document.addEventListener("DOMContentLoaded", function() {

    // Usamos fetch para obtener los datos del JSON
    fetch('./json/songs.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Request error:' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            console.log(data);

            data_songs = data;

            updateSongDetails();

        })
        .catch(function(error) {
            console.warn("Error occurred: " + error.message);
        })
        .finally(function() {
            console.log("Complete petition");
        });

        musicIcon = document.querySelector('#play');
        play =  document.querySelector('#play');
        nextMusic =  document.querySelector('#next');
        prevMusic =  document.querySelector('#prev');

        progressBar =  document.querySelector('.progress-bar');

        function updateSongDetails (){
            musicTitle = document.querySelector('.title');
            musicArtist = document.querySelector('.artist');
            musicImage = document.querySelector('.image');


            musicTitle.innerHTML = data_songs[count]['title'];
            musicArtist.innerHTML = data_songs[count]['artist'];
            musicImage.src = data_songs[count]['image'];
            musicAudio = data_songs[count]['url'];

            audio = new Audio(musicAudio);

            audio.addEventListener('ended', songEnd);

            let information = '<ul>';
            let countSongs = 1;

            for(let song of data_songs){
                information += '<li>' + countSongs++ + ". " + song.artist + " - " + song.title + '</li>';
            }

            information += '</ul>';
            listSongs = document.querySelector('.songs');
            listSongs.innerHTML = information;
        }


        function playPauseMusic(){
            if(sound){
                audio.play(); 
                musicIcon.innerHTML = pauseIcon;
                sound=false;
            }else{
                audio.pause(); 
                musicIcon.innerHTML = playIcon;
                sound=true;
            }
            
        }

        play.addEventListener("click", playPauseMusic);

        function nextSong(){
            if (count < (data_songs.length-1)) {  
                count++;
                nextMusic.classList.remove('disabled');
                prevMusic.classList.remove('disabled');
                console.log(count);
        
                sound = false;
                playPauseMusic();
                updateSongDetails(); 
            } 
            
        
            if (count === (data_songs.length-1)) {
                nextMusic.classList.add('disabled'); 
            }
        }

        nextMusic.addEventListener("click", nextSong);

        function prevSong(){
            if (count <= (data_songs.length-1) && count > 0) {  
                count--;
                nextMusic.classList.remove('disabled');
                prevMusic.classList.remove('disabled');
                console.log(count);
        
                sound = false;
                playPauseMusic();
                updateSongDetails(); 
            } 
            

            if (count === 0) {
                prevMusic.classList.add('disabled');  
            }
        }

        prevMusic.addEventListener("click", prevSong);


        function updateProgress() {
            if (audio) {
                let percentage = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = `${percentage}%`;
            }
        }

        function seekTo(event) {
            let containerWidth = progressBar.parentElement.clientWidth;
            let clickX = event.offsetX;
            let newTime = (clickX / containerWidth) * audio.duration;
            audio.currentTime = newTime;
        }

        progressBar.parentElement.addEventListener('click', seekTo);

        // Actualiza la barra de progreso 
        setInterval(updateProgress, 100);

        function songEnd(){
            count++;
            if (count < data_songs.length) {
                updateSongDetails(); 
                sound = false;
                playPauseMusic();
            }
        }

        

});