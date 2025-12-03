// select form elements

const userName = document.getElementById('usernameInput');
const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');
const passwordConfirm = document.getElementById('confirmPassword');
const button = document.getElementById('submit');

button.addEventListener('click', createUser);



// Function to run all validation checks, including database checks
async function validateForm(username, userEmail, userPassword, userPasswordConfirm) {
    const errors = {}; 
    
    // Username validation
    if (username.trim() === '') {
        errors.username = 'Username is required.';
    } else if (username.length < 3) {
        errors.username = 'Username must be at least 3 characters.';
    } else if (username.length > 20) {
        errors.username = 'Username must be less than 20 characters.';
    }
    
    // Email validation
    if (userEmail.trim() === '') {
        errors.email = 'Email is required.';
    } else {
        // Email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userEmail)) {
            errors.email = 'Please enter a valid email address.';
        }
    }
    
    // Password validation
    if (userPassword.trim() === '') {
        errors.password = 'Password is required.';
    } else if (userPassword.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(userPassword)) {
        errors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(userPassword)) {
        errors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(userPassword)) {
        errors.password = 'Password must contain at least one number.';
    } else if (!/[!@#$%^&*]/.test(userPassword)) {
        errors.password = 'Password must contain at least one special character (!@#$%^&*).';
    }
    
    // Password confirmation validation
    if (userPasswordConfirm.trim() === '') {
        errors.passwordConfirm = 'Please confirm your password.';
    } else if (userPassword !== userPasswordConfirm) {
        errors.passwordConfirm = 'Passwords do not match.';
    }
    
    // If local checks failed, stop here
    if (Object.keys(errors).length > 0) {
        return errors; 
    }

    // Database existence check
    const checkUrl = `http://localhost:3000/api/users/check-existence?username=${encodeURIComponent(username)}&email=${encodeURIComponent(userEmail)}`;
    
    try {
        const response = await fetch(checkUrl);

        if (!response.ok) {
            throw new Error('Database check failed.');
        }

        const data = await response.json(); 

        if (data.usernameExists) {
            errors.username = 'This username is already taken.';
        }
        if (data.emailExists) {
            errors.email = 'This email is already registered.';
        }

    } catch (error) {
        console.error('Network error during user existence check:', error);
        errors.general = 'Could not verify user existence due to a network error.';
    }

    return errors;
}



async function createUser(event){
    event.preventDefault(); 

    const url = 'http://localhost:3000/api/users/signup';

    const user = userName.value;
    const userEmail = email.value;
    const userPassword = password.value;
    const userPasswordConfirm = passwordConfirm.value;

    // Run validation
    const validationErrors = await validateForm(user, userEmail, userPassword, userPasswordConfirm);

    // Check for errors
    if (Object.keys(validationErrors).length > 0) {
        displayErrors(validationErrors); 
        return;
    }

    // Proceed with fetch if validation passes
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user,
                email: userEmail,
                password: userPassword
            })
        });

        if (!response.ok) {
            throw new Error('Signup failed. Please try again.');
        }

        const data = await response.json();
        
        // Success - redirect or show success message
        console.log('User created successfully:', data);
        alert('Signup successful! Welcome!');
        
        // Optionally redirect to login or dashboard
        // window.location.href = '/login.html';
        
        // Or clear the form
        userName.value = '';
        email.value = '';
        password.value = '';
        passwordConfirm.value = '';
        clearErrors();

    } catch (error) {
        console.error('Signup error:', error);
        displayErrors({ general: 'Signup failed. Please try again later.' });
    }
}

function displayErrors(errors) {
    // Clear any previous error messages
    clearErrors();
    
    // Display username error
    if (errors.username) {
        const usernameError = document.createElement('span');
        usernameError.className = 'error-message';
        usernameError.textContent = errors.username;
        usernameError.style.color = 'red';
        usernameError.style.fontSize = '12px';
        userName.insertAdjacentElement('afterend', usernameError);
        userName.style.borderColor = 'red';
    }
    
    // Display email error
    if (errors.email) {
        const emailError = document.createElement('span');
        emailError.className = 'error-message';
        emailError.textContent = errors.email;
        emailError.style.color = 'red';
        emailError.style.fontSize = '12px';
        email.insertAdjacentElement('afterend', emailError);
        email.style.borderColor = 'red';
    }
    
    // Display password error
    if (errors.password) {
        const passwordError = document.createElement('span');
        passwordError.className = 'error-message';
        passwordError.textContent = errors.password;
        passwordError.style.color = 'red';
        passwordError.style.fontSize = '12px';
        password.insertAdjacentElement('afterend', passwordError);
        password.style.borderColor = 'red';
    }
    
    // Display password confirmation error
    if (errors.passwordConfirm) {
        const confirmError = document.createElement('span');
        confirmError.className = 'error-message';
        confirmError.textContent = errors.passwordConfirm;
        confirmError.style.color = 'red';
        confirmError.style.fontSize = '12px';
        passwordConfirm.insertAdjacentElement('afterend', confirmError);
        passwordConfirm.style.borderColor = 'red';
    }
    
    // Display general errors (network issues, etc.)
    if (errors.general) {
        const generalError = document.createElement('div');
        generalError.className = 'error-message general-error';
        generalError.textContent = errors.general;
        generalError.style.color = 'red';
        generalError.style.padding = '10px';
        generalError.style.marginBottom = '10px';
        generalError.style.backgroundColor = '#ffe6e6';
        generalError.style.border = '1px solid red';
        generalError.style.borderRadius = '4px';
        button.insertAdjacentElement('beforebegin', generalError);
    }
}

function clearErrors() {
    // Remove all error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    // Reset border colors
    userName.style.borderColor = '';
    email.style.borderColor = '';
    password.style.borderColor = '';
    passwordConfirm.style.borderColor = '';
}

