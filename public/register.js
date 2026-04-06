export const register = {
  init() {
    const registerBtn = document.querySelector('.registerBtn');
    if (!registerBtn) return;
    registerBtn.addEventListener('click', () => {
      this.validate();
    });
  },

  async validate() {
    const emailInput = document.querySelector('.register-email');
    const passwordInput = document.querySelector('.register-password');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert('Complete all fields.');
      return;
    }
    if (password.length < 5) {
      alert('Password must be at least 5 characters.');
      return;
    }

    try {
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await registerResponse.json();

      if (!registerResponse.ok) {
        alert(data.message || 'Registration failed.');
        return;
      }

      alert('Registration successful!');

    } catch (err) {
      console.error('Registration error:', err);
      alert('Something went wrong.');
    }
  }
};