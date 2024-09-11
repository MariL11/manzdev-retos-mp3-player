document.addEventListener("DOMContentLoaded", function() {

    // Variables para el estado de reproducción
    let count = 0;
    let sound = true;

    // Variables para los datos de las canciones
    let data_songs = [];
    let countSongs;
    let audio;
    const musicTitle = document.querySelector('.title');
    const musicArtist = document.querySelector('.artist');
    const musicImage = document.querySelector('.image');
    let musicAudio;

    // Variables para los elementos de la interfaz
    const prevMusic =  document.querySelector('#prev');
    const nextMusic =  document.querySelector('#next');
    const play = document.querySelector('#play');

    const musicIcon = document.querySelector('#play');
    const iconPlaylist = document.querySelector('.list');
    const playlist = document.querySelector(".playlist");
    const listSongs = document.querySelector('.songs');

    const progressBar =  document.querySelector('.progress-bar');
    const musicTime = document.querySelector('.music-time');
    const durationSong = document.querySelector('.duration');
    let displayed = true;

    // Iconos de reproducción y pausa
    const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#000000" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`;
    const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#000000" d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>`;

    //Animación del volumen
    const canvas = document.querySelector('.volumen');
    const bars = canvas.getContext('2d');
    const numberBar = 80;
    const barWidth = 4;
    const minHeight = 10;
    const maxHeight = 80;
    let volumAnimation = null;


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

            //Guardamos los datos obtenidos en un array
            data_songs = data;

            //Actualizamos los datos de la canción seleccionada del mp3
            updateSongDetails();

        })
        .catch(function(error) {
            console.warn("Error occurred: " + error.message);
        })
        .finally(function() {
            console.log("Complete petition");
        });


        // Actualiza los datos de la canción seleccionada
        function updateSongDetails (){

            // Obtenemos los datos de la canción seleccionada y actualizamos los datos
            musicTitle.innerHTML = data_songs[count]['title'];
            musicArtist.innerHTML = data_songs[count]['artist'];
            musicImage.src = data_songs[count]['image'];
            musicAudio = data_songs[count]['url'];
             
            //Creamos el audio seleccionado
            audio = new Audio(musicAudio);

            // Añade un evento que se dispara cuando la reproducción del audio ha terminado, ejecutando la función `songEnd`
            audio.addEventListener('ended', songEnd);

           //Ponemos la duración de la canción en formato minutos:segundos
            audio.addEventListener('loadedmetadata', () => {
                durationSong.innerHTML = `${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60)}`;
            });

            let information = '<ul>';
            countSongs = 1;

            //Recorremos cada canción y agregamos el número de canción, el artista y el título a la lista creada
            for(let song of data_songs){
                information += '<li>' + countSongs++ + ". " + song.artist + " - " + song.title + '</li>';
            }

            information += '</ul>';
            
            listSongs.innerHTML = information; //Insertamos la lista creada


            // Obtenemos el índice de la canción seleccionada en la playlist y actualizamos la canción del MP3
            let listItems = document.querySelectorAll('.songs ul li');

            listItems.forEach((li, index) => {
                li.addEventListener('click', function() {
                
                    //Obtenemos la índice de la canción seleccionada
                    count = index;

                    //Pausamos la canción actual
                    sound = false;
                    playPauseMusic();

                    //Actualizamos la canción del mp3
                    updateSongDetails();

                    //Reproduccimos la canción seleccionada
                    sound = true;
                    playPauseMusic();
                    
                });
            });


            // Cambiar el estilo del icono para la canción anterior
            if(count === 0){
                prevMusic.classList.add('disabled');
            }else{
                prevMusic.classList.remove('disabled');
            }

            // Cambiar el estilo del icono para la siguiente canción
            if(count === (data_songs.length-1)){
                nextMusic.classList.add('disabled');
            }else{
                nextMusic.classList.remove('disabled');
            }
        
        }

        

        //Reproducimos y pausamos la canción al hacer click sobre el icono de play o pausa
        function playPauseMusic(){
            if(sound){
                audio.play(); //Reproduce la canción
                musicIcon.innerHTML = pauseIcon; //Se cambia al icono de pausa
                sound=false;

                startAnimation(); // Inicia la animación del volumen del mp3

            }else{
                audio.pause(); //Pasa la canción
                musicIcon.innerHTML = playIcon; //Se cambia al icono de play
                sound=true;

                stopAnimation(); // Detiene la animación del volumen del mp3
            }
            
        }

        play.addEventListener("click", playPauseMusic);



        //Pasamos a la siguiente canción cuando se pulsa el icono de la canción siguiente
        function nextSong(){
            if (count < (data_songs.length-1)) {  
                count++;
        
                //Pausa la canción
                sound = false;
                playPauseMusic(); 

                updateSongDetails(); //Actualiza la canción del mp3

                //Reproducimos la canción
                sound = true; 
                playPauseMusic();
            } 
 
        }

        nextMusic.addEventListener("click", nextSong);



        //Pasamos a la anterior canción cuando se pulsa el icono de la canción anterior
        function prevSong(){
            if (count <= (data_songs.length-1) && count > 0) {  
                count--;
              
        
                //Pausa la canción
                sound = false;
                playPauseMusic(); 

                updateSongDetails(); //Actualiza la canción del mp3

                //Reproducimos la canción
                sound = true; 
                playPauseMusic();
            } 

        }

        prevMusic.addEventListener("click", prevSong);


        //Ponemos el tiempo en minutos:segundos
        function formatTime(seconds) {
            let minutes = Math.floor(seconds / 60);
            let secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }


        //Actualizamos el tiempo de reproducción de la canción
        function updateProgress() {
            if (audio) {
                let percentage = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = `${percentage}%`; // Actualiza el ancho de la barra de progreso para reflejar el porcentaje de reproducción

                musicTime.innerHTML = formatTime(audio.currentTime); // Muestra el tiempo transcurrido en formato minutos:segundos

            }
        }

        //Permite al usuario poner en que momento quiere reproducir la canción al hacer click sobre la barra de progreso
        function seekTo(event) {

            // Obtiene el ancho del contenedor de la barra de progreso
            let containerWidth = progressBar.parentElement.clientWidth;

            // Obtiene la posición horizontal del clic en la barra de progreso
            let clickX = event.offsetX;

            // Calcula el nuevo tiempo de reproducción basado en la posición del clic y la duración total de la canción
            let newTime = (clickX / containerWidth) * audio.duration;

            // Actualiza el tiempo actual de la canción
            audio.currentTime = newTime;
        }

        progressBar.parentElement.addEventListener('click', seekTo);

        // Actualiza la barra de progreso cada 100 milisegundos 
        setInterval(updateProgress, 100);


        // Permite avanzar a la siguiente canción o pausar la música cuando la canción actual termine de reproducirse
        function songEnd(){
            //Al terminar la última canción del mp3, el mp3 se pausa
            if(count === (data_songs.length-1)){
                sound = false;
                playPauseMusic();
            }else{
                //Si no se pasa a la siguiente canción y se reproduce
                count++;
                updateSongDetails(); 
                sound = true;
                playPauseMusic();
            }
        }

        //Permite mostrar y ocular la playlist del mp3
        function activePlaylist(){

            //Dependiendo si del dispositivo, la playlist se moverá en vertical o horizontal
            if(window.innerWidth >= 700){
                if(!displayed){
                    playlist.style.transform = 'translateX(-340px)';
                    displayed = true;
                }else{
                    playlist.style.transform = 'translateX(0px)';
                    displayed = false;
                }
            }else{
                if(!displayed){
                    playlist.style.transform = 'translateY(340px)';
                    displayed = true;
                }else{
                    playlist.style.transform = 'translateY(0px)';
                    displayed = false;
                }
            }

        }

        iconPlaylist.addEventListener("click", activePlaylist);


        //Crea las barras que simulan el volumen de la canción
        function drawBars() {
            bars.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < numberBar; i++) {
                const barHeight = Math.random() * (maxHeight - minHeight) + minHeight;
                const x = i * barWidth;
                const y = canvas.height - barHeight;
                bars.fillStyle = 'rgb(255, 255, 255)';
                bars.fillRect(x, y, barWidth - 2, barHeight);
            }
        }

        //Comienza la animación del volumen
        function startAnimation() {
            if (volumAnimation === null) {
                volumAnimation = setInterval(drawBars, 250);
            }
        }

        //Para la animación del volumen
        function stopAnimation() {
            if (volumAnimation !== null) {
                clearInterval(volumAnimation); 
                volumAnimation = null;
            }
        }

       
});
