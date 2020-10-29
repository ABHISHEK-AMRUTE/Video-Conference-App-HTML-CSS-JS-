var audio = false
var video = true
var timer 
const { name, room ,friend,friendname} = Qs.parse(location.search, { ignoreQueryPrefix: true })
document.getElementById("my_id").innerHTML = room;
document.getElementById("stop").style.display="none"
document.getElementById("id").value = friend
document.getElementById("my_name").innerHTML = name
const peer = new Peer(room, {
  host: 'localhost',
  port: 3000,
  path: '/peerjs/myapp'
});

const sample_video = document.getElementById("sample")
const my_camera = document.getElementById("my_camera")
const frined_cam = document.getElementById("friend_cam")

const download_link = document.getElementById("download_link")

var recordedBlobs = [];

///////////////////for recording media////////////////////////////
var options = {mimeType: 'video/webm;codecs=vp9,opus'};
if (!MediaRecorder.isTypeSupported(options.mimeType)) {
  console.error(`${options.mimeType} is not supported`);
  options = {mimeType: 'video/webm;codecs=vp8,opus'};
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`);
    options = {mimeType: 'video/webm'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = {mimeType: ''};
    }
  }
}
var mediaRecorder


function start_recording()
{ var time = 0
  timer  = setInterval(()=>{
    time++
    document.getElementById("status").innerHTML = (parseInt(time / 60)) +":"+ time%60 + " Recording..."
  },1000)
  document.getElementById("stop").style.display="inline"
  document.getElementById("record").style.display="none"
  document.getElementById("status").style.display="inline"
  document.getElementById("status").innerHTML = "Recording..."
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`);
    options = {mimeType: 'video/webm;codecs=vp8,opus'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = {mimeType: 'video/webm'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = {mimeType: ''};
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(frined_cam.srcObject, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
 
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stop_recording()
{ 
  clearInterval(timer)
  document.getElementById("status").style.display="none"
  document.getElementById("stop").style.display="none"
  document.getElementById("record").style.display="inline"
  console.log("stop recording up")
  mediaRecorder.stop();
  console.log("stop recording down")
  document.getElementById("status").innerHTML = "Stopping...."
  // let recordedBlo = new Blob(recordedBlobs, { type: 'video/webm' });
  // my_camera.src = window.URL.createObjectURL(recordedBlo);
  // download_link.href = my_camera.src;
  // download_link.download = 'RecordedVideo.webm';

  document.getElementById("download_link").style.display = "inline"
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    console.log("inside handle data")
    recordedBlobs.push(event.data);
    document.getElementById("status").innerHTML = ""
  } 
}




function download() {

  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  my_camera.src =  url
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    document.getElementById("download_link").style.display = "none"
  }, 100);

}

///////////////////////////////////////////

/////copy to clipboard function
function copy_id() {
  var copyText = document.getElementById("my_id");
  var inp = document.createElement('input')
  document.getElementById("body").appendChild(inp)
  inp.value = copyText.innerHTML
  inp.select();
  inp.setSelectionRange(0, 99999);
  document.execCommand("copy");
  inp.remove()
  myFunction(copyText.innerHTML)
}

document.getElementById("title").innerHTML = "Hello " + name + " !"




peer.on('open', function (id) {
  console.log('My peer ID is: ' + id);

});

var call 


peer.on('call', function (calll) {

  document.getElementById("ring").play()

  setTimeout(() => {
   
    var check_it = confirm("Recieve the call")

    if (check_it) {
     
      document.getElementById("ring").pause()
      const startChat = async () => {
        console.log("received")
        calll.answer(sample_video.srcObject);
        w3_open()
        document.getElementById("friend_name").innerHTML = friendname
        calll.on('stream', function (stream) {
          // `stream` is the MediaStream of the remote peer.
          // Here you'd add it to an HTML video/canvas element.0
          frined_cam.srcObject = stream
        
        });
         calll.on('close', function () {
          alert("The videocall has finished");
          w3_close()
         });
         call = calll
      }
      
      startChat();
  
    } else {
      call = calll
      calll.close()
      alert('call decline!');
      w3_close()
      document.getElementById("ring").pause()
    }
    
  }, 2000);


  
 
});



if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video, audio })
    .then(function (stream) {
      sample_video.srcObject = stream;
      my_camera.srcObject = stream;
      // frined_cam.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Something went wrong!");
    });
}

function myFunction(st) {
  // Get the snackbar DIV

  var x = document.getElementById("snackbar");
  x.innerHTML = st + " copied to clipboard."
  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}


function w3_open() {
  document.getElementById("mySidebar").style.width = "100%";
  document.getElementById("mySidebar").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}


document.getElementById("control_bar").addEventListener('click', function () {
  var audio_toggel = document.getElementById("audio").checked
  var video_toggel = document.getElementById("video").checked
  var shareing_toggle = document.getElementById("share").checked
  console.log(audio_toggel + " " + video_toggel + " " + shareing_toggle)
  audio = audio_toggel
  video = video_toggel
  if (shareing_toggle == true) {
    if (navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia({ video, audio })
        .then(function (stream) {
          sample_video.srcObject = stream;

        })
        .catch(function (error) {
          console.log("Something went wrong!");
        });
    }
  } else {

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video, audio })
        .then(function (stream) {

          sample_video.srcObject = stream;
         
        })
        .catch(function (error) {
          console.log("Something went wrong!");
        });
    }
  }

})



function make_call(){
  console.log("in call")
  my_camera.srcObject =  sample_video.srcObject
  var id = document.getElementById("id").value
  console.log(id)
  call = peer.call(id,
  sample_video.srcObject);
  
  call.on('stream', function (stream) {
    // `stream` is the MediaStream of the remote peer.
    // Here you'd add it to an HTML video/canvas element.0
    frined_cam.srcObject = stream
  
  });
  call.on('close', function () {
    alert("The videocall has finished");
    w3_close()
});
}

function hangup(){
  call.close()
  w3_close()
}

function screenshot(){
  const canvas = document.createElement('canvas'); 
  const img = document.getElementById('img'); 
  canvas.width = frined_cam.videoWidth; canvas.height = frined_cam.videoHeight; 
 
   canvas.getContext('2d').drawImage(frined_cam, 0, 0); 
 
  let dataUrl = canvas.toDataURL('image/png');
   img.src = dataUrl; 

   var hrefElement = document.createElement('a'); 
   hrefElement.href = dataUrl; 
   document.body.append(hrefElement);
    hrefElement.download = 'ScreenShot$.png'; 
   
    hrefElement.click();
     hrefElement.remove();
     img.style.display="none"
}
var index=0;

function screen_share()
{ 
  console.log("value of index " + index)
  if(index%2==0){
  if (navigator.mediaDevices.getDisplayMedia) {
    navigator.mediaDevices.getDisplayMedia({ video, audio })
      .then(function (stream) {
        my_camera.srcObject = stream;
        var id = document.getElementById("id").value
  
        call = peer.call(id,
        my_camera.srcObject);
        document.getElementById("share_screen").src="./share (1).png"
        index++
      })
      .catch(function (error) {
        console.log("Something went wrong!" +error);
      });
  }
}else{


  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video, audio })
      .then(function (stream) {
        my_camera.srcObject = stream;
        var id = document.getElementById("id").value
  
        call = peer.call(id,
        my_camera.srcObject);
        document.getElementById("share_screen").src="./share.png"
        index++
      })
      .catch(function (error) {
        console.log("Something went wrong!");
      });
  }
}
  

}