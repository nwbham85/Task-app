// Step 1: Auth check
const token = localStorage.getItem('token');
let currentUser = null;

if(!token) {
    window.location.href = 'login.html';
}

// Step 2: API function
async function apiCall(endpoint, options = {}) {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return;
    }

    return await response.json();
}

// Step 3: Load profile
async function loadProfile() {
    const user = await apiCall('/api/auth/me');
    currentUser = user;
    
    // Display user data
    document.getElementById('displayEmail').textContent = user.email || '-';
    document.getElementById('displayUsername').textContent = user.username || '-';
    document.getElementById('displayFirstName').textContent = user.profile?.firstName || '-';
    document.getElementById('displayLastName').textContent = user.profile?.lastName || '-';
}

// Step 4: Edit button - OUTSIDE loadProfile function
document.getElementById('editProfileBtn').addEventListener('click', () => {
    document.getElementById('viewMode').style.display = 'none';
    document.getElementById('editMode').style.display = 'block';
    
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('username').value = currentUser.username || '';
    document.getElementById('firstName').value = currentUser.profile?.firstName || '';
    document.getElementById('lastName').value = currentUser.profile?.lastName || '';
});

// Cancel button - OUTSIDE loadProfile function
document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('editMode').style.display = 'none';
    document.getElementById('viewMode').style.display = 'block';
});

// Load profile when page loads
loadProfile();