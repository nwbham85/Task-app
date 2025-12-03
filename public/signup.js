// select form elements

const userName = document.getElementById('usernameInput');
const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');
const passwordConfirm = document.getElementById('confirmPassword');
const button = document.getElementById('submit');

button.addEventListener('submit', createUser);

// validate form
function validateForm(user, userEmail, userPassword, userPasswordConfirm) {
    const errors = {}; 
    
    // --- INSERT ALL YOUR VALIDATION STAGES HERE ---
    if (user.trim() === '') {
        errors.user = 'Username is required.';
    }
    if (userPassword.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
    }
    // ... add all other checks (email format, password match, etc.) ...
    
    return errors;
}

// Function to run all validation checks, including database checks
async function validateForm(username, email) {
    const errors = {}; 
    
    // --- Stage 1: Local Client-Side Validation (Required Fields, Length, Format) ---
    // (Assume you have basic checks here as previously discussed)
    if (username.trim() === '') {
        errors.username = 'Username is required.';
    }
    if (email.trim() === '') {
        errors.email = 'Email is required.';
    }
    // ... other password and format checks ...
    
    // If local checks failed, stop here and return errors
    if (Object.keys(errors).length > 0) {
        return errors; 
    }

    // --- Stage 2: Database Existence Check (Requires new API endpoint) ---
    
    // NOTE: You must create a GET endpoint on your server like /api/users/check-existence
    const checkUrl = `http://localhost:3000/api/users/check-existence?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
    
    try {
        const response = await fetch(checkUrl);

        if (!response.ok) {
            // Handle server errors during the check
            throw new Error('Database check failed.');
        }

        const data = await response.json(); 
        // Expected response data format: { usernameExists: true/false, emailExists: true/false }

        if (data.usernameExists) {
            errors.username = 'This username is already taken.';
        }
        if (data.emailExists) {
            // This is usually checked on the server during POST, but checking here improves UX.
            errors.email = 'This email is already registered.';
        }

    } catch (error) {
        console.error('Network error during user existence check:', error);
        // Add a general network error message if the check fails
        errors.general = 'Could not verify user existence due to a network error.';
    }

    return errors;
}



async function createUser(event){
    // Prevent default form submission if applicable
    // event.preventDefault(); 

    const url = 'http://localhost:3000/api/users/signup';


    const user = userName.value;
    const userEmail = email.value;
    const userPassword = password.value;
    const userPasswordConfirm = passwordConfirm.value;

    // 1. RUN VALIDATION
    const validationErrors = await validateForm(user, userEmail); // Pass relevant inputs

    // 2. CHECK FOR ERRORS
    if (Object.keys(validationErrors).length > 0) {
        // Assume you have a function to show errors on the screen
        displayErrors(validationErrors); 
        return; // STOP EXECUTION if validation fails
    }

    // 3. PROCEED WITH FETCH (If validation and existence checks pass)

    try {
        const response = await fetch(url, {
            method: 'POST', // Use POST method for signup
            // ... include body with user data (username, email, password) ...
        });
        
        // ... rest of your successful POST logic ...

    } catch (error) {
        console.error(error);
    }
}

