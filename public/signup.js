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


async function createUser(){

    const url = 'http://localhost:3000/api/users/signup';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('error. cant fetch');
        }

        
        

    } catch (error) {
        console.error(error);
    }


}

