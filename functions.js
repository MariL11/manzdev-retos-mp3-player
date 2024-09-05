let musicTitle;
let musicArtist;
let musicImage;
let listSongs;
let play;
let sound=true;

document.addEventListener("DOMContentLoaded", function() {

    // Usamos fetch para obtener los datos del JSON
    fetch('./json/songs.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Request error:' + response.statusText);
            }
            return response.json();
        })
        .then(function(data_songs) {
            console.log(data_songs);

            musicTitle = document.querySelector('.title');
            musicArtist = document.querySelector('.artist');
            musicImage = document.querySelector('.image');


            musicTitle.innerHTML = data_songs[0]['title'];
            musicArtist.innerHTML = data_songs[0]['artist'];
            musicImage.src = data_songs[0]['image'];

            let information = '<ul>';
            let count = 1;

            for(let song of data_songs){
                information += '<li>' + count++ + ". " + song.artist + " - " + song.title + '</li>';
            }

            information += '</ul>';
            listSongs = document.querySelector('.songs');
            listSongs.innerHTML = information;

        })
        .catch(function(error) {
            console.warn("Error occurred: " + error.message);
        })
        .finally(function() {
            console.log("Complete petition");
        });

        /* PRUEBA
        
        const audio = new Audio("https://manzdev.github.io/codevember2017/assets/eye-tiger.mp3");
        audio.volume = 0.5; 
        play = document.getElementById('play');
        play.addEventListener("click", function() {
             
            if(sound){
                console.log(audio.paused);        // true (no se está reproduciendo)
                console.log(audio.currentTime);   // 0
                console.log(audio.duration);      // 17.81551 (17 secs, 815.51 ms)
                audio.currentTime = 5;            // Move to 5 secs
                audio.play(); 

                sound=false;
            }else{
                audio.pause(); 

                sound=true;
            }
            

        });*/

});