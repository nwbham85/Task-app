// authorization check - is user logged in?

const token = localStorage.getItem('token');

if(!token) {
    console.log('no token found.');
    // redirect user to login page
    window.location.href = 'login.html';
}