//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream;                      //stream from getUserMedia()
var rec;                            //Recorder.js object
var input;                          //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
var convertButton = document.getElementById("convertButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

convertButton.addEventListener("click", convertText);

function convertText(){
    var texto = document.getElementById("texto");
    console.log('teste convert')
    convertButton.disabled = false;
    au = document.getElementById("audioTTS")
    data  = {
        "text": texto.value
    }

    fetch("/convert-text", 
    {method:"post",
    body: JSON.stringify({data})
    }).then(function(response) {
        //console.log(response.body )
        response.text().then(function (text) {
            var data = JSON.parse(text);
            console.log(data.path)
            au.src = data.path;
            au.play();
          });            
      });

    console.log('fim convert test');
}

function generateAudio(blob) {

    var new_url = URL.createObjectURL(blob);
    var new_au = document.createElement('audio');
    var new_li = document.createElement('li');
    var new_link = document.createElement('a');

    //name of .wav file to use during upload and download (without extendion)
    var newfilename = new Date().toISOString();

    //add controls to the <audio> element
    new_au.controls = true;
    new_au.src = new_url;

    //save to disk link
    new_link.href = new_url;
    new_link.download = newfilename+".wav"; //download forces the browser to donwload the file using the  filename
    new_link.innerHTML = "Save to disk";

    //add the new audio element to li
    new_li.appendChild(new_au);

    //add the filename to the li
    new_li.appendChild(document.createTextNode(newfilename+".wav "))

    //add the save to disk link to li
    new_li.appendChild(new_link);

    //upload link
    var newupload = document.createElement('a');
    newupload.href="#";
    newupload.innerHTML = "Upload";
    newupload.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 4) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    new_li.appendChild(document.createTextNode (" "))//add a space in between
    new_li.appendChild(newupload)//add the upload link to li
}



function startRecording() {
    console.log("recordButton clicked");

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video:false }

    /*
        Disable the record button until we get a success or fail from getUserMedia() 
    */

    recordButton.disabled = true;
    stopButton.disabled = false;
    pauseButton.disabled = false

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //update the format 
        document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
        */
        rec = new Recorder(input,{numChannels:1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        recordButton.disabled = false;
        stopButton.disabled = true;
        pauseButton.disabled = true
    });
}

function pauseRecording(){
    console.log("pauseButton clicked rec.recording=",rec.recording );
    if (rec.recording){
        //pause
        rec.stop();
        pauseButton.innerHTML="Resume";
    }else{
        //resume
        rec.record()
        pauseButton.innerHTML="Pause";

    }
}

function stopRecording() {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
    stopButton.disabled = true;
    recordButton.disabled = false;
    pauseButton.disabled = true;

    //reset button just in case the recording is stopped while paused
    pauseButton.innerHTML="Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(sendAudio); //createDownloadLink);
}

function sendAudio(blob) {
    console.log('sendAudio');
    fetch("/convert-speech", 
        {method:"post",
        body: blob
        })
        .then(function (response){
            return response.json();
        }).then(function (obj) {
            console.log(obj)
            showGeneratedText(obj);
        }).catch(function (error){
            console.error('erro ao transcrever');
            console.error(error);
        })
    console.log('fim ajax');
}

function showGeneratedText(obj){
    var txtHTML = document.getElementById('textoAudio');
    txtHTML.innerText = obj.results[0].alternatives[0].transcript;
}

function createDownloadLink(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');

    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //save to disk link
    link.href = url;
    link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
    link.innerHTML = "Save to disk";

    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li
    li.appendChild(document.createTextNode(filename+".wav "))

    //add the save to disk link to li
    li.appendChild(link);

    //upload link
    var upload = document.createElement('a');
    upload.href="#";
    upload.innerHTML = "Upload";
    upload.addEventListener("click", function(event){
          var xhr=new XMLHttpRequest();
          xhr.onload=function(e) {
              if(this.readyState === 4) {
                  console.log("Server returned: ",e.target.responseText);
              }
          };
          var fd=new FormData();
          fd.append("audio_data",blob, filename);
          xhr.open("POST","/",true);
          xhr.send(fd);
    })
    li.appendChild(document.createTextNode (" "))//add a space in between
    li.appendChild(upload)//add the upload link to li
}
