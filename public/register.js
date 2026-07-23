const registerForm = document.querySelector('#registerForm');
const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const confirmPasswordInput = document.querySelector('#confirmPassword');
const statusMessage = document.querySelector('#statusMessage');
const submitButton = document.querySelector('#submitButton');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    clearStatus();

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!username || !email || !password || !confirmPassword) {
        showStatus('Please complete all required fields.', 'error');
        return;
    }

    if (username.length < 3) {
        showStatus('Username must be at least 3 characters.', 'error');
        usernameInput.focus();
        return;
    }

    if (password.length < 8) {
        showStatus('Password must be at least 8 characters.', 'error');
        passwordInput.focus();
        return;
    }

    if (password !== confirmPassword) {
        showStatus('Passwords do not match.', 'error');
        confirmPasswordInput.focus();
        return;
    }

    setLoading(true);

    try {
        const response = await fetch('/api/v1/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                email,
                password
            })
        });

        const data = await readJsonResponse(response);

        if (!response.ok) {
            throw new Error(
                data.message || 'Account creation failed'
            );
        }

        registerForm.reset();

        showStatus(
            'Account created successfully. Redirecting to login…',
            'success'
        );

        window.setTimeout(() => {
            window.location.href = './login.html';
        }, 1200);
    } catch (error) {
        console.error('Registration error:', error);

        showStatus(
            error.message || 'Unable to connect to the server.',
            'error'
        );
    } finally {
        setLoading(false);
    }
});

async function readJsonResponse(response) {
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
        return {};
    }

    return response.json();
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message is-visible ${type}`;
}

function clearStatus() {
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
}

function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading
        ? 'Creating account…'
        : 'Create account';
}