const URL = "http://localhost:3000"

//extraction from url
const { userid } = Qs.parse(location.search, { ignoreQueryPrefix: true })
profile.userid = userid

//loading profile in Right sidebar
load_profile(userid)










function load_profile(local_userid)
{  console.log("inside load_profile")
  fetch(URL+"/my_info?userid="+local_userid).then((res)=>{
    res.json().then((data)=>{
      console.log("inner load_profile")
      profile.name = data.name
      profile.phone = data.phone
      profile.account_type = data.account_type
      profile.avatar = data.avatar
      profile.community = data.community
      profile.contacts = data.contacts
      profile.createdAt = data.createdAt
      profile.description = data.description
      profile.email = data.email
      profile.request = data.request
      profile.userid = data.userid
      profile._id = data._id
      console.log(profile)
      
      var arr = profile.avatar.data;
       var data_b = new Uint8Array(arr);

       var base64 = bufferToBase64(data_b);  
      console.log(profile.avatar.data)
      document.getElementById("profile_pic").src = 'data:image/jpeg;base64,' + base64;
      
      document.getElementById("name").innerHTML = data.name
      document.getElementById("userID").innerHTML =data.userid
      document.getElementById("number").innerHTML =data.phone
      document.getElementById("description").innerHTML =data.description
      document.getElementById("account_type").innerHTML =data.account_type
      one_to_one()
    })
   
 }).catch((err)=>{
   console.log(err)
 })
}



function load_profile_after_creation(local_userid)
{  console.log("inside load_profile")
  fetch(URL+"/my_info?userid="+local_userid).then((res)=>{
    res.json().then((data)=>{
      console.log("inner load_profile")
      profile.name = data.name
      profile.phone = data.phone
      profile.account_type = data.account_type
      profile.avatar = data.avatar
      profile.community = data.community
      profile.contacts = data.contacts
      profile.createdAt = data.createdAt
      profile.description = data.description
      profile.email = data.email
      profile.request = data.request
      profile.userid = data.userid
      profile._id = data._id
      
      community()
    })
   
 }).catch((err)=>{
   console.log(err)
 })
}


function bufferToBase64(buf) {
  var binstr = Array.prototype.map.call(buf, function (ch) {
      return String.fromCharCode(ch);
  }).join('');
  return btoa(binstr);
}

function openLeftMenu() {
    document.getElementById("leftMenu").style.display = "block";
  }
  
  function closeLeftMenu() {
    document.getElementById("leftMenu").style.display = "none";
  }
  
  function openRightMenu() {
    document.getElementById("rightMenu").style.display = "block";
  }
  
  function closeRightMenu() {
    document.getElementById("rightMenu").style.display = "none";
  }
   
  function openRightMenu_community() {
    document.getElementById("community_info_side_bar").style.display = "block";
  }
  
  function closeRightMenu_community() {
    document.getElementById("community_info_side_bar").style.display = "none";
  }


function one_to_one(){
  document.getElementById("div_add_community").style.visibility = "hidden"
  document.getElementById("list-title").innerHTML = "Recent Chats"
  document.getElementById("list").innerHTML=""

  profile.contacts.forEach(element => {
         const profile_name = '"'+profile.name+'",'
        const element_chat_id = '"'+element.chat_id+'",'
        const profile_userid = '"'+profile.userid+'",'
        const  element_name = '"'+element.name+'",'
        const  element_userid = '"'+element.userid+'"'
       const outer = document.createElement('div')
       const avatar = document.createElement('img')
       const text = document.createElement('span')
       text.setAttribute('id','list-text')
       text.innerHTML = element.name
       avatar.setAttribute('class','list-avatar')

      

      fetch(URL+"/my_info?userid="+element.userid).then((res)=>{
        res.json().then((data)=>{
          var arr =data.avatar.data;
          var data_b = new Uint8Array(arr);
   
          var base64 = bufferToBase64(data_b);  
         
          avatar.src = 'data:image/jpeg;base64,' + base64;
        })
       
        }).catch((err)=>{
       console.log(err)
        })
       avatar.src = './avatar.png'
       outer.setAttribute('class','list-item')
       outer.appendChild(avatar)
       outer.appendChild(text)

      //  outer.innerHTML=element.name
       outer.setAttribute('onclick',"change_url_ifram("+profile_name+""+element_chat_id+""+profile_userid+""+element_name+""+element_userid+")")
       document.getElementById("list").appendChild(outer)
  });
}

function community(){
  document.getElementById("div_add_community").style.visibility = "visible"
  document.getElementById("list-title").innerHTML = "Communities"
  st =""
  document.getElementById("list").innerHTML=""
  // profile.community.forEach(element => {
  //   const profile_name = '"'+profile.name+'",'
  //   const element_chat_id = '"'+element.chat_id+'",'
  //   const profile_userid = '"'+profile.userid+'",'
  //   const  element_name = '"'+element.name+'"'
  //   const outer = document.createElement('div')
  //   const avatar = document.createElement('img')
  //   const text = document.createElement('span')
  //   text.setAttribute('id','list-text')
  //   text.innerHTML = element.name
  //   avatar.setAttribute('class','list-avatar')

  //        st += "<div class='list-item' onclick='change_url_ifram_community("+profile_name+""+element_chat_id+""+profile_userid+""+element_name+")'>" + element.name +"</div>"

  // });
  // console.log(st)
  // document.getElementById("list").innerHTML = st+st;

  //////////////////////////
  profile.community.forEach(element => {
    const profile_name = '"'+profile.name+'",'
   const element_chat_id = '"'+element.chat_id+'",'
   const profile_userid = '"'+profile.userid+'",'
   const  element_name = '"'+element.name+'",'
  
  const outer = document.createElement('div')
  const avatar = document.createElement('img')
  const text = document.createElement('span')
  text.setAttribute('id','list-text')
  text.innerHTML = element.name
  avatar.setAttribute('class','list-avatar')
  avatar.src = './avatar.png';
  outer.setAttribute('class','list-item')
  outer.appendChild(avatar)
  outer.appendChild(text)

 
  outer.setAttribute('onclick',"change_url_ifram_community("+profile_name+""+element_chat_id+""+profile_userid+""+element_name+")")
  document.getElementById("list").appendChild(outer)
});

  ////////////////////
}

function notifications(){
  document.getElementById("div_add_community").style.visibility = "hidden"
  document.getElementById("list").innerHTML=""
  document.getElementById("list-title").innerHTML = "Notifications"
  st =""
  profile.request.forEach(element => {
         st += "<div class='list-item'>" + "Your request to join<b> "+element.name+"</b> is "+element.status+"</div>"

  });
  document.getElementById("list").innerHTML = st;
}




function load_user_profile(local_userid)
{ 
  console.log("inside load_profile")
  fetch(URL+"/my_info?userid="+local_userid).then((res)=>{
    res.json().then((data)=>{
      var arr = data.avatar.data;
       var data_b = new Uint8Array(arr);

       var base64 = bufferToBase64(data_b);  
      console.log(profile.avatar.data)
      document.getElementById("profile_pic").src = 'data:image/jpeg;base64,' + base64;
      document.getElementById("name").innerHTML = data.name
      document.getElementById("userID").innerHTML = data.userid
      document.getElementById("number").innerHTML = data.phone
      document.getElementById("description").innerHTML = data.description
      document.getElementById("account_type").innerHTML =data.account_type
      openRightMenu()
    })
   
 }).catch((err)=>{
   console.log(err)
 })
}

function change_url_ifram(profile_name,element_chat_id,profile_userid,element_name,element_userid){
 
console.log(profile_name,element_chat_id,profile_userid,element_name,element_userid)
let stt = "http://127.0.0.1:5500/chat_room.html?username="+profile_name+"&room="+element_chat_id+"&myid="+profile_userid+"&title="+element_name+"&friendid="+element_userid
document.getElementById("iframe_id").src = stt

}

function change_url_ifram_community(profile_name,element_chat_id,profile_userid,element_name){

  let stt = "http://127.0.0.1:5500/community.html?username="+profile_name+"&room="+element_chat_id+"&myid="+profile_userid+"&title="+element_name
  document.getElementById("iframe_id").src = stt
  
  }

function w3_open() {
  document.getElementById("main").style.marginLeft = "29%";
  document.getElementById("mySidebar").style.width = "29%";
  document.getElementById("main").style.width = "71%";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
  document.getElementById("body").style.overflowY= "hidden";
}


function w3_close() {
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("main").style.width = "100%";
  document.getElementById("openNav").style.display = "inline-block";
  document.getElementById("body").style.overflowY= "auto";
}

function load_community_info(id,admin_id){
  
  fetch(URL+"/get_community?chat_id="+id).then((res)=>{
    res.json().then((data)=>{
      console.log(data)
      // var arr = data.avatar.data;
      //  var data_b = new Uint8Array(arr);

      //  var base64 = bufferToBase64(data_b);  
      // console.log(profile.avatar.data)
      // document.getElementById("profile_pic").src = 'data:image/jpeg;base64,' + base64;
      document.getElementById("name_community").innerHTML = data.name
    
      document.getElementById("description_community").innerHTML ="Description : "+ data.result.description
      st=""

      
     

    ////////////////////
    fetch(URL+"/my_info?userid="+admin_id).then((res)=>{
      res.json().then((data_user)=>{
        
        data.result.member.forEach(element => {
          if(data_user._id != element.user_id)
          st = st + "<div class='list-item'>"+element.name+"</div>"
          else
          st = st + "<div class='list-item'>"+element.name+"<br><span class='admin-tag'>Admin</span></div>"
       });
       document.getElementById("member-list").innerHTML = st
       openRightMenu_community()


      })
     
   }).catch((err)=>{
     console.log(err)
   })
    //////////////////////


    })
   
 }).catch((err)=>{
   console.log(err)
 })
}



function create_community(){

  console.log("inside community sending")
   var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
   var theUrl = "/json-handler";
   xmlhttp.open("POST", URL+"/create_community?user_id="+profile._id+"&username="+profile.name, true);
   xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   xmlhttp.send(JSON.stringify({
   "name" : document.getElementById("community_name").value,
   "owner" : profile._id,
   "description" :document.getElementById("description_of_community").value
   
}));
xmlhttp.onreadystatechange = function () { 
  if (xmlhttp.readyState === 4 && xmlhttp.status === 200) { 

      // Print received data from server 
      
      document.getElementById('id02').style.display='none'
      load_profile_after_creation(userid)
      
  } 
}; 

}

function add_member_community(community_id,name,user_id,username){

  console.log("inside add_member")
     var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
     xmlhttp.open("POST", URL+"/add_to_community?community_id="+community_id+"&name="+name+"&user_id="+user_id+"&username="+username, true);
     xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
     xmlhttp.send(); 
  }


  function launch_video_call(type,friendid)
  {  

    fetch(URL+"/my_info?userid="+friendid).then((res)=>{
      res.json().then((data_user)=>{
        if(type=="one-to-one")
    window.open("http://127.0.0.1:5500/video_call_start.html?name="+profile.name+"&room="+profile._id+"&friend="+data_user._id+"&friendname="+data_user.name, '_blank');
  
      
      })
     
   }).catch((err)=>{
     console.log(err)
   })

    
  }