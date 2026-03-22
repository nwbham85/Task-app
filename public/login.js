export const login = {
  init() {
    const loginBtn = document.querySelector('.loginBtn');
    console.log('init ran');
    console.log('button found:', loginBtn);

    if (!loginBtn) return;

    loginBtn.addEventListener('click', () => {
      console.log('login button clicked');
      this.validate();
    });
  },

  async validate() {
    console.log('validate ran');

    const username = document.querySelector('.login-username')?.value.trim();
    const password = document.querySelector('.login-password')?.value.trim();

    console.log('username:', username);
    console.log('password:', password);

    if (!username || username.length < 2) {
      alert('Invalid username');
      return;
    }

    const res = await fetch(`/users?username=${username}`);
    console.log('status:', res.status);

    const data = await res.json();
    console.log('data:', data);

    if (!data.exists) {
      alert('User not found');
      return;
    }

    alert('User exists');
  }
};