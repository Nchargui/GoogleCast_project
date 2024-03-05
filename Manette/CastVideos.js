let currentSession;
let currentMediaSession;
let isPlaying = true;
let currentVideoIndex = 0;
let currentVideoUrl;
let updateInterval;
const seekSlider = document.getElementById('seekSlider');
const currentTimeElement = document.getElementById('currentTime');
const totalTimeElement = document.getElementById('totalTime');
const defaultContentType = 'video/mp4';
const applicationID = '3DDC41A0';
const videoList = [
    'https://transfertco.ca/video/DBillPrelude.mp4',
    'https://transfertco.ca/video/DBillSpotted.mp4',
    'https://transfertco.ca/video/usa23_7_02.mp4'
 
];
 
//Le bouton d'allumage
document.getElementById('power-button').addEventListener('click', () => {
    initializeApiOnly();
 
});
 
 
 
 
document.getElementById('power-button').addEventListener('click', () => {
    if (currentSession) {
        if(localStorage.getItem('currentVideoIndexLS')) {
            loadMedia(videoList[localStorage.getItem('currentVideoIndexLS')]);


        } else {
            loadMedia(videoList[currentVideoIndex]);
        }
        
       
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});
 
 
//commencer la video
 
document.getElementById('controlReplay').addEventListener('click', () => {  ////////!!!!!!!
    if (currentSession) {
        loadMedia(videoList[currentVideoIndex]);
       
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
 
 
});
 
 
//changer de video avec la fleche gauche
document.getElementById('nextVideo').addEventListener('click', () => {
    if (currentSession) {
        currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});

document.getElementById('PreviousVideo').addEventListener('click', () => {
    if (currentSession) {
        currentVideoIndex = (currentVideoIndex - 1) % videoList.length;
        localStorage.setItem('currentVideoIndexLS', currentVideoIndex);
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
});




 
// a revoir avec nadine
document.getElementById('controlStop').addEventListener('click', () => {
    if (currentMediaSession) {
        if (isPlaying) {
            currentMediaSession.pause(null, onMediaCommandSuccess, onError);

 
        } else {
            currentMediaSession.play(null, onMediaCommandSuccess, onError);
            alert("Connectez-vous sur chromecast en premier")
        }
        isPlaying = !isPlaying;
    }
});
 
 
 
function sessionListener(newSession) {
    currentSession = newSession;
    document.getElementById('controlStop').style.display = 'block';
    document.getElementById('nextVideo').style.display = 'block';
    document.getElementById('PreviousVideo').style.display = 'block';
}
 
 
 
function initializeSeekSlider(remotePlayerController, mediaSession) { /// pasdans le code initial ---------------
    currentMediaSession = mediaSession;
    document.getElementById('controlReplay').style.display = 'block';
    // Set max value of seek slider to media duration in seconds
    seekSlider.max = mediaSession.media.duration;
 
    // Update seek slider and time elements on time update
    updateInterval = setInterval(() => {
        const currentTime = mediaSession.getEstimatedTime();
        const totalTime = mediaSession.media.duration;
 
        seekSlider.value = currentTime;
        currentTimeElement.textContent = formatTime(currentTime);
        totalTimeElement.textContent = formatTime(totalTime);
    }, 1000); //chaque 1000 ms... 1 sec
 
    // slider change
    seekSlider.addEventListener('input', () => {
        const seekTime = parseFloat(seekSlider.value);
        remotePlayerController.seek(seekTime);
    });
}
 

function initializeMediaSession(mediaSession) {   ///Ajoutééé________________________________
    currentMediaSession = mediaSession;
    document.getElementById('controlStop').style.display = 'block';
 }




function receiverListener(availability) {
    if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
        document.getElementById('power-button').style.display = 'block';
    } 
    
}
 
 
function onInitSuccess() {
    console.log('Chromecast init success');
}
 
function onError(error) {
    console.error('Chromecast initialization error', error);
}
 
function onMediaCommandSuccess() {
    console.log('Media command success');
}
 
function initializeApiOnly() {
 
    const sessionRequest = new chrome.cast.SessionRequest(applicationID);
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
 
    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}
 
function loadMedia(videoUrl) {
    currentVideoUrl = videoUrl;
    const mediaInfo = new chrome.cast.media.MediaInfo(videoUrl, defaultContentType);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    const remotePlayer = new cast.framework.RemotePlayer();
    const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);
 
    currentSession.loadMedia(request, mediaSession => {
        console.log('Media chargé avec succès');
        initializeSeekSlider(remotePlayerController, mediaSession);
    }, onError);
}
 
 
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
 
 
///volume
/*document.addEventListener("DOMContentLoaded", function() {
    const volumeControl = document.getElementById('volumeControl');
    const volumeBar = document.getElementById('volumeBar');
    const volumeKnob = document.getElementById('volumeKnob');
 
    volumeKnob.addEventListener('mousedown', startDragging);
 
    function startDragging(e) {
        e.preventDefault();
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
    }
 
    function drag(e) {
        const rect = volumeControl.getBoundingClientRect();
        let newX = e.clientX - rect.left;
        newX = Math.max(0, Math.min(newX, rect.width));
        volumeKnob.style.left = newX - volumeKnob.offsetWidth / 2 + 'px';
        volumeBar.style.width = newX + 'px';
    }
 
    function stopDragging(e) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDragging);
    }
});*/
 
 
// document.addEventListener("DOMContentLoaded", function () {
//     const volumeControl = document.getElementById('volumeControl');
//     const volumeBar = document.getElementById('volumeBar');
//     const volumeKnob = document.getElementById('volumeKnob');
//     const volumeInput = document.querySelector('.volume1');
 
//     volumeKnob.addEventListener('mousedown', startDragging);
 
//     function startDragging(e) {
//         e.preventDefault();
//         document.addEventListener('mousemove', drag);
//         document.addEventListener('mouseup', stopDragging);
//     }
 
//     function drag(e) {
//         const rect = volumeControl.getBoundingClientRect();
//         let newY = rect.bottom - e.clientY;
//         newY = Math.max(0, Math.min(newY, rect.height));
//         volumeKnob.style.bottom = newY - volumeKnob.offsetHeight / 2 + 'px';
//         volumeBar.style.height = newY + 'px';
 
//         // Calculer le volume en fonction de la position du bouton de volume
//         const volume = newY / rect.height;
//         // Mettre à jour la valeur de l'élément input de type "range"
//         volumeInput.value = volume * 100;
//         // Mettre à jour le volume de l'élément audio/vidéo
//         // Vous devez remplacer 'audioOrVideoElement' par l'ID ou la référence à votre élément audio/vidéo
//         audioOrVideoElement.volume = volume;
//     }
 
//     function stopDragging(e) {
//         document.removeEventListener('mousemove', drag);
//         document.removeEventListener('mouseup', stopDragging);
//     }
// });