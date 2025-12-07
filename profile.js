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

// ==== STEP 5: SAVE CHANGES WHEN FORM IS SUBMITTED ====

// When the user clicks "Save Changes":

// Prevent the form from refreshing the page (forms do this by default)
// Collect the data from the form inputs
// Send it to the backend API with a PATCH request
// Update the display with the new data
// Switch back to view mode
// Show a success message

document.getElementById('profileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submitted!');  
    

    //collect data from form inputs
    const updatedData = {
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        profile: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value
        }
    };

    try {
    // send patch request to update profile
    const result = await apiCall('/api/auth/update-profile', {
        method: 'PATCH',
        body: JSON.stringify(updatedData)
    });
    console.log('Result from API:', result);
    // update local storage with new data
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    storedUser.username = result.username;
    storedUser.email = result.email;
    storedUser. profile = result.profile;
    localStorage.setItem('user', JSON.stringify(storedUser));

    //reload profile to show new data
    await loadProfile();

    //switch back to view mode
    // Switch back to view mode
    document.getElementById('editMode').style.display = 'none';
    document.getElementById('viewMode').style.display = 'block';

    // show success message
    const successMsg = document.getElementById('successMessage');
    successMsg.textContent = 'Profile updated successfully.';
    successMsg.style.display = 'block';
    // hide success message after 2 seconds
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 2000);

    } catch(error) {
    console.error('error updating profile', error);
    }
});

loadProfile();