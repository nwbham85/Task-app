const logoutButton = document.querySelector('#logoutButton');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    window.location.href = './login.html';
});