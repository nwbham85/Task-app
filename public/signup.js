// select form elements

const userName = document.getElementById('usernameInput');
const email = document.getElementById('emailInput');
const password = document.getElementById('passwordInput');
const passwordConfirm = document.getElementById('confirmPassword');
const button = document.getElementById('submit');

button.addEventListener('submit', createUser);

// validate form


async function createUser(){

    const url = 'http://localhost:3000/api/users/signup';

    const user = userName.value;
    const userEmail = email.value;
    const userPassword = password.value;
    const userPasswordConfirm = passwordConfirm.value;

    // object to collect errors
    const errors = {};

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('error. cant fetch');
        }

        
        

    } catch (error) {
        console.error(error);
    }


}

