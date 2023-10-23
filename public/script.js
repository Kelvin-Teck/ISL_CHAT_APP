'use-strict';

// Connect to the Socket.io server
const socket = io("http://localhost:3000");

// Event handler for when the connection is established
socket.on("connect", () => {
  //console.log("Connected to the Socket.io server");
});

// Handle disconnection
socket.on("disconnect", () => {
  //console.log("Disconnected from the Socket.io server");
});


//users and id.
const adminUsers = [];
const messageUsers = [];
const adminGroups = [];

//user Messages
const userMessages = [];
const groupMessages = [];
// Store {user._id, user.name}

document.addEventListener("DOMContentLoaded", function () {
  //CHAT USERS
  let url = '/user/fetchUsers'; // Replace with your API endpoint URL
let authToken = localStorage.getItem('token'); // Replace with your authentication token
if(!authToken){
  // window.location.href = "/";
}

// Create headers with the authentication token
let headers = new Headers({
  'Authorization': `Bearer ${authToken}`,
});

// Create the request object
let request = new Request(url, {
  method: 'GET',
  headers: headers,
  mode: 'cors', // Consider the CORS policy of your server
});

// Make the GET request
fetch(request)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the response as JSON
  })
  .then(data => {
    // Handle the user data
    data.forEach((user)=>{
      const obj = {};
      obj.id = user._id;
      obj.name = user.name;
      adminUsers.push(obj);
    })
    display();
  })
  .catch(error => {
    // Handle errors
    console.error('There was a problem with the fetch operation:', error);
  });




  //CHAT MESSAGES
    url = '/chat/home'; // Replace with your API endpoint URL
    authToken = localStorage.getItem('token'); // Replace with your authentication token

    // Create headers with the authentication token
    headers = new Headers({
      'Authorization': `Bearer ${authToken}`,
    });

    // Create the request object
    request = new Request(url, {
      method: 'GET',
      headers: headers,
      mode: 'cors', // Consider the CORS policy of your server
    });

    // Make the GET request
    fetch(request)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response as JSON
      })
      .then(data => {
        // individual Chat
        const username = document.querySelector('.greeting span').innerHTML;
        data.individualChats.forEach((chat)=>{
          const obj = {};
          obj.id = chat.users[1]._id;
          obj.chatId = chat._id;
          obj.name = chat.users[1].name;
          obj.lastMessage = chat.latestMessage.content;
          if(obj.name === username){
            obj.name = chat.users[0].name;
            obj.id = chat.users[0]._id;
          }
          messageUsers.push(obj);
        });
        display();

        //individual Group
        data.groupChats.forEach((chat)=>{
          const obj = {};
          obj.chatId = chat._id;
          obj.chatName = chat.chatName;
          obj.lastMessage = chat.latestMessage.content;
          obj.users = chat.users; //An array of users
          adminGroups.push(obj);
        });
        messageClick();
      })
      .catch(error => {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
      });

});



//Close group
document.querySelector('.cgroup .icon-close').addEventListener('click', function(){
  document.querySelector('.float').style.display = "none";
  document.querySelector('.cgroup').style.display = "none";
})

//Remove Users
document.querySelector('.remove-users .icon-close').addEventListener('click', function(){
  document.querySelector('.float').style.display = "none";
  document.querySelector('.remove-users').style.display = "none";
})

//Open Float
document.querySelector('.icon-add').addEventListener('click', function(){
  document.querySelector('.float').style.display = "block";
  document.querySelector('.cgroup').style.display = "flex";
  creategroup();
})

document.querySelector('.icon-remove').addEventListener('click', function(){
  document.querySelector('.float').style.display = "block";
  document.querySelector('.remove-users').style.display = "flex";
  removeuser();
})


//Submit Remove group
document.querySelector('.remove-button').addEventListener('click', function(){
  const url = '/chat/remove'; // Replace with your actual API endpoint
  authToken = localStorage.getItem('token');

  // Create an object with the data you want to send
  const arrNames = [];
  const groupName = document.querySelector('.remove-users h3').innerHTML;
  document.querySelectorAll('.user-name').forEach((e)=>{
    const checkbox = e.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      arrNames.push(checkbox.value);
    }
  })

  const data = {
  usernames: arrNames,
  chatName: groupName
  };

  // Create the request options
  const options = {
    method: 'POST', // HTTP method
    headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(data),
  };

  // Make the POST request using the fetch API
  fetch(url, options)
  .then(response => {
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json(); // Parse the response as JSON
  })
  .then(data => {
  //console.log('Response data:', data);
  // Handle the response data here
  })
  .catch(error => {
  console.error('Error:', error);
  // Handle errors here
  });
  document.querySelector('.float').style.display = "none";
  document.querySelector('.remove-users').style.display = "none";
})



//Submit create group
document.querySelector('.create-button').addEventListener('click', function(){
  const url = '/chat/create'; // Replace with your actual API endpoint
  authToken = localStorage.getItem('token');

  // Create an object with the data you want to send
  const arrNames = [];
  const groupName = document.querySelector('.create-group + input').value;
  document.querySelectorAll('.user-name').forEach((e)=>{
    const checkbox = e.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      arrNames.push(checkbox.value);
    }
  })

  const data = {
  users: arrNames,
  name: groupName
  };

  // Create the request options
  const options = {
    method: 'POST', // HTTP method
    headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(data),
  };

  // Make the POST request using the fetch API
  fetch(url, options)
  .then(response => {
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json(); // Parse the response as JSON
  })
  .then(data => {
  //console.log('Response data:', data);
  // Handle the response data here
  })
  .catch(error => {
  console.error('Error:', error);
  // Handle errors here
  });
  document.querySelector('.float').style.display = "none";
  document.querySelector('.cgroup').style.display = "none";
})



//Logout
document.querySelector('.logout').addEventListener('click', function(e){
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = "/";
})



function creategroup(){
  document.querySelector('.user-list-g').innerHTML = "";
  adminUsers.forEach((e) => {
    document.querySelector('.create-group').innerHTML = "Create Group";
    document.querySelector('.user-list-g').innerHTML += `<div class="user-name">
    <input type="checkbox" id="${e.id}" value="${e.name}">
    <label for="${e.id}">${e.name}</label>
    </div>`;
  })
}

function removeuser(){
  document.querySelector('.user-list-r').innerHTML = "";
  let gname = document.querySelector('.details h2').innerHTML
  document.querySelector('.remove-users h3').innerHTML = gname;
  adminGroups.forEach((e) => {
    if(e.chatName === gname){
      e.users.forEach((user) => {
        document.querySelector('.user-list-r').innerHTML += `<div class="user-name">
        <input type="checkbox" id="${user._id}" value="${user.name}">
        <label for="${user._id}">${user.name}</label>
        </div>`;
      })
    }
  })
}



//Display Allusers for Admin
function display(){
  const uname = localStorage.getItem('uname');
  const isAdmin = localStorage.getItem('admin');
  const chats = document.getElementById('chats');
  const creategroup = document.querySelector('.admin');
  document.querySelector('.greeting span').innerHTML = uname;
  if(isAdmin){
    document.querySelector('.top-section').style.marginBottom = "0";
    creategroup.style.display = "flex";
    chats.innerHTML = "";
    messageUsers.forEach((ob)=>{
      let lastMessage = ob.lastMessage;
      if(lastMessage.length > 17){
        lastMessage = lastMessage.slice(0, 15) + "...";
      }
      chats.innerHTML += `<div id="${ob.chatId}" custom="${ob.id}" class="chat"><img src="profile.png" alt="" width="60px" height="60px"><h2>${ob.name}</h2><span>${ob.lastMessage}</span></div>`;
    });
  }else{

  }
  
}


//Display Groups for Admin.
function groupDisplay(){
  const isAdmin = localStorage.getItem('admin');
  const chats = document.getElementById('chats');
  if(true){
    chats.innerHTML = "";
    adminGroups.forEach((ob)=>{
      const lastMessage = ob.lastMessage;
      if(lastMessage.length > 16){
        lastMessage = lastMessage.slice(0, 15) + "...";
      }
      chats.innerHTML += `<div id="${ob.chatId}" custom="${ob.chatId}" class="chat"><img src="profile.png" alt="" width="60px" height="60px"><h2>${ob.chatName}</h2><span>${ob.lastMessage}</span></div>`;
      });
  }
}


let messageoff = false;
document.querySelectorAll('.section span').forEach((e)=>
  e.addEventListener('click', function(){
    this.classList.add('border-bottom')
    if(this.innerHTML === "MESSAGES"){
      display();
      messageClick();
      messageoff = false;
    }else if(this.innerHTML === "GROUPS"){
      groupDisplay();
      messageoff = true;
      messageClick();
    }
    document.querySelectorAll('.section span').forEach((e)=>{
      if(e !== this){
        if(e.classList.contains('border-bottom')){
          e.classList.toggle('border-bottom');
        }
      }
    })
  })
)


// Message Clicked
let id = "";
let chatId = "";
function messageClick (){
  document.querySelectorAll('.chat').forEach((e) => {
    e.addEventListener('click', function(){
      document.querySelector('.chat-section').classList.add('message-on');
      document.querySelector('.details h2').innerHTML = e.children[1].innerHTML;
      document.querySelector('footer input').value = "";
      document.querySelector('footer input').focus()
      id = e.getAttribute('custom');
      chatId = e.id
      //console.log(chatId)
      if(chatId){
        url = `/message/${chatId}`; // Replace with your API endpoint URL
    authToken = localStorage.getItem('token'); // Replace with your authentication token

    // Create headers with the authentication token
    headers = new Headers({
      'Authorization': `Bearer ${authToken}`,
    });

    // Create the request object
    request = new Request(url, {
      method: 'GET',
      headers: headers,
      mode: 'cors', // Consider the CORS policy of your server
    });

    // Make the GET request
    fetch(request)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response as JSON
      })
      .then(data => {
        // individual Chat Message
        userMessages.length = 0;
        //console.log(data);
        data.forEach((chat)=>{
          const obj = {};
          obj.id = chat._id;
          obj.sender = chat.sender.name;
          obj.content = chat.content;
          userMessages.push(obj);
        });
        document.querySelector('section').innerHTML = "";
        showMessage();
      })
      .catch(error => {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
      });
      }else{
        document.querySelector('section').innerHTML = "";
      }
      
      // console.log(e.children[1].innerHTML);
      
  if(messageoff){
    document.querySelector('.icon-remove').style.display = "block";
  }else{
    document.querySelector('.icon-remove').style.display = "none";
  }

    })
  })
}

messageClick();

//Socket to receive Real time chat.
const userName = localStorage.getItem('uname')
socket.on('message', (msg)=>{
  if(msg.id === chatId){
    if(msg.name !== userName){
      let section = document.querySelector('section');
      section.innerHTML += `<div class="other"><span>${msg.name}:</span><p>${msg.message}</p></div>`
      section.scrollTop = section.scrollHeight;
    }
  }
})


{

    
}

function showMessage(){
  let section = document.querySelector('section');
  document.querySelector('section').innerHTML = "";
  const name = document.querySelector('.greeting span').innerHTML;
  section.scrollTop = section.scrollHeight;
  userMessages.forEach((message) => {
    if(message.sender === name){
      section.innerHTML += `<div class="owner"><span>You:</span><p>${message.content}</p></div>`
    }else{
      section.innerHTML += `<div class="other"><span>${message.sender}:</span><p>${message.content}</p></div>`
    }
  })
    section = document.querySelector('section');
      section.scrollTop = section.scrollHeight;
}

//<div class="owner"><p>How far na? Lorem ipsum dolor sit amet, conse adipisicing </p></div>

document.querySelector('footer button').addEventListener('click', function(){
  let section = document.querySelector('section');
  const content = document.querySelector('footer input').value;
  section.innerHTML += `<div class="owner"><span>You:</span><p>${content}</p></div>`;
  section.scrollTop = section.scrollHeight;
  document.querySelector('footer input').value = '';

  //Post Message
  const checkChat = document.querySelectorAll('.section span')[0].innerHTML;
  const checkRule = document.querySelectorAll('.section span')[0].classList.contains("border-bottom");
if(checkChat.toLowerCase() === "messages" && checkRule){
  url = '/message/individual'
}else{
  url = '/message/'; // Replace with your actual API endpoint
}
  authToken = localStorage.getItem('token');

  const data = {
  content: content,
  chatId: id
  };
  //console.log(id);

  // Create the request options
  const options = {
    method: 'POST', // HTTP method
    headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(data),
  };

  // Make the POST request using the fetch API
  fetch(url, options)
  .then(response => {
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json(); // Parse the response as JSON
  })
  .then(data => {
  // Handle the response data here
  //console.log(data);
  })
  .catch(error => {
  console.error('Error:', error);
  // Handle errors here
  });

  const socketMessage = {
    name: localStorage.getItem('uname'),
    id : chatId,
    message: content,
  }

  // socket IO
  socket.emit("message", socketMessage);
})


// Search Users Button
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
authToken = localStorage.getItem('token');

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;

    if (searchTerm.trim() === '') {
        resultsDiv.style.display = 'none';
    } else {
        // Create headers with the Authorization token
        const headers = new Headers({
            'Authorization': `Bearer ${authToken}`
        });

        // Create the request with headers
        const request = new Request(`/user/fetchUsers/?search=${searchTerm}`, {
            method: 'GET',
            headers: headers
        });

        // Make the API request with the modified request
        fetch(request)
            .then(response => response.json())
            .then(data => {
              //console.log(data)
                displayResults(data);
            })
            .catch(error => {
                console.error('API request error: ' + error);
            });
    }
});

function displayResults(users) {
    // Clear the results
    resultsDiv.innerHTML = '';

    if (users.length === 0) {
        resultsDiv.style.display = 'none';
        return;
    }

    // Display the results in the div
    users.forEach(user => {
      resultsDiv.innerHTML +=  `<p class="search-name" custom=${user._id}>${user.name}</p>`
    });

    resultsDiv.style.display = 'flex';
    searchClick();
}
function searchClick(){
  document.querySelectorAll('.search-name').forEach((e) => {
    e.addEventListener('click', function(){
      //console.log('Tested')
      document.querySelector('.chat-section').classList.add('message-on');
      document.querySelector('.details h2').innerHTML = e.innerHTML;
      document.querySelector('footer input').value = "";
      document.querySelector('footer input').focus()
      messageoff = false;
      id = e.getAttribute('custom');
      let chatId = e.id;
      if(chatId){
        url = `/message/${chatId}`; // Replace with your API endpoint URL
    authToken = localStorage.getItem('token'); // Replace with your authentication token

    // Create headers with the authentication token
    headers = new Headers({
      'Authorization': `Bearer ${authToken}`,
    });

    // Create the request object
    request = new Request(url, {
      method: 'GET',
      headers: headers,
      mode: 'cors', // Consider the CORS policy of your server
    });

    // Make the GET request
    fetch(request)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response as JSON
      })
      .then(data => {
        // individual Chat Message
        userMessages.length = 0;
        data.forEach((chat)=>{
          const obj = {};
          obj.id = chat._id;
          obj.sender = chat.sender.name;
          obj.content = chat.content;
          userMessages.push(obj);
        });
        document.querySelector('section').innerHTML = "";
        showMessage();
      })
      .catch(error => {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
      });
      }else{
        document.querySelector('section').innerHTML = "";
      }
      
      // console.log(e.children[1].innerHTML);
      
  if(messageoff){
    document.querySelector('.icon-remove').style.display = "block";
  }else{
    document.querySelector('.icon-remove').style.display = "none";
  }
  document.getElementById('results').style.display = 'none'
  document.querySelector('input[type = "search"]').value = "";
    })

  }
  )
}
 



