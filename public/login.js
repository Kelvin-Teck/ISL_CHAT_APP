'use strict';

const loginForm = document.getElementById('loginForm');
  const errorDisplay = document.getElementById('errorDisplay');
if(loginForm){
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('uname').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorDisplay.innerText = data.msg; // Display the error message
      } else {
        // Handle successful 
        localStorage.setItem('token', data.token);
        localStorage.setItem('uname', data.name);
        localStorage.setItem('admin', data.isAdmin);
        localStorage.setItem('id', data._id);
        window.location.href=`/chat.html`;
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  });
}