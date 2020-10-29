
var SIGNALING_SERVER = 'http://localhost:3000/';
// To create a new connection to the signaling server
const socket = io.connect(SIGNALING_SERVER);
//initializes the socket application.



// URL type == "URL/some_path?username=name_of_current_user&room=_id_of_chat"
// User credential which we will get from URL of current page where this file is being loaded
const { username, room, myid, title, friendid } = Qs.parse(location.search, { ignoreQueryPrefix: true })

document.getElementById("title").innerHTML = title
document.getElementById("title").addEventListener('click',function(){
    parent.load_user_profile(friendid)
})

document.getElementById("message").addEventListener('focus',function(){

socket.emit('typing', {
    room,
    username,
    userid:myid,
    type:"focus"
  })
})

document.getElementById("message").addEventListener('blur',function(){
  
socket.emit('typing', {
    room,
    username,
    userid:myid,
    type:"blur"
  })
})
/////The real-time connection is beign established, now just like firebase listners we have to add 
// socket.io emmiters and socket.io listners
socket.on('typing',(data)=>{
  if(data.userid!=myid&&data.type=="focus")
  {
    document.getElementById("status").innerHTML="Typing..."
  }
  if(data.userid!=myid&&data.type=="blur")
  {
    document.getElementById("status").innerHTML="Online"
  }
})


///fuction which get called everytime when the other user(with whome current user is taking) sends a message.
socket.on('new message',(message)=>{
  // Use this function to load each chat bubble in the UI
     
  // you have to use message object to extract name, text_message and timestamp for rendering that in UI
  // structure of the above message object is 
    //  const message = {
        // message : text_message,
        // user : username,
        // time : Date.now()
    // }
    let color
    let align
    
   console.log(message)
   const outer_container = document.createElement('div')
   const text_container = document.createElement('div')
   const text = document.createElement('div')
   const time = document.createElement('div')
   const file = document.createElement('img')
   if(message.filename)
   {
     text_container.appendChild(file)
   }
   file.setAttribute('class',"file-image-format")
   if(message.contentType=="image/png")
   file.setAttribute('src','./download.png')
   else{
    file.setAttribute('src','./pdf.png')
   }
   time.innerHTML = moment(message.time).format("h:mm");
   text.innerHTML = message.message
   text_container.appendChild(time)
   text_container.appendChild(text)
   outer_container.appendChild(text_container)
   if(message.user == myid)
    {
       color= "w3-blue"
       align ="w3-right"
       text_container.setAttribute('style','border-top-left-radius: 10px; border-top-right-radius: 0px;')
    }
    else
   { color = "w3-white"
    align ="w3-left"
    text_container.setAttribute('style','border-top-left-radius: 0px; border-top-right-radius: 10px;')
   }
   text_container.setAttribute('class',''+color+' text_container w3-card '+align )
    
   time.setAttribute('class','time')
   text.setAttribute('class','message_text')
   outer_container.setAttribute('class','outer_container w3-container')
   document.getElementById('text').appendChild(outer_container)

   window.scrollTo(0,document.body.scrollHeight);
})


// document.getElementById("button").addEventListener('click',function(){


//     const message = {
//         text : document.getElementById("input").value,
//         name : username,
//         timestamp : Date.now()
//     }
//    console.log(message)

//    socket.emit('sendMessage', message)
// })


document.getElementById("message").addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      send_message();
    }
  });


/////call this function on clicking send message button, pass text message as an argument to this function
function send_message()
{   

    
     const message = {
         message : document.getElementById("message").value,
         user : myid,
         time : Date.now(),
         room : room,
         type :"one-to-one"
     }
    console.log(message)

    socket.emit('message', message)
    document.getElementById("message").value =""
}









///this function must not be changed, it connects front-end to backend various socket rooms(currently for one-to-one chats)
socket.emit('join',  {type:"one-to-one",username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
