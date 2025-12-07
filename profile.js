// authorization check - is user logged in?
const token = localStorage.getItem('token');

if(!token) {
    console.log('no token found.');
    window.location.href = 'login.html';
}

// ====== STEP 2  =======

// create api function
async function apiCall(endpoint, options = {}) {
    // make fetch request
    const response = await fetch(`http://localhost:3000${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });

    // check if user is unauthorized (token expired/invalid)
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return;
    }

    // convert response to JSON and return it
    return await response.json();
}
// =====    step 3 load user profile data ====

// call api to get user data from mongo
async function loadProfile() {
    const user = await apiCall('/api/auth/me');

    //update and display user data
    document.getElementById('displayEmail').textContent = user.email;
    document.getElementById('displayUsername').textContent = user.username;
    document.getElementById('displayFirstName').textContent = user.profile?.firstName || '-';
    document.getElementById('displayLastName').textContent = user.profile?.lastName || '-';
}
loadProfile();
// store data in variable

//display on the page