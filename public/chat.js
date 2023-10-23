const socket = io('http://localhost:3000');

socket.on('chat-members', data=>{
  console.log(data)
})