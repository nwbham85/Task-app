export const modal = {
  init() {
    const loginBtn = document.querySelector('.login');
    const registerBtn = document.querySelector('.register');

    const loginModal = document.querySelectorAll('.modal')[0];
    const registerModal = document.querySelectorAll('.modal')[1];

    const closeBtns = document.querySelectorAll('.modal-close');

    // ===== LOGIN =====
    if (loginBtn && loginModal) {
      loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
      });
    }

    // ===== REGISTER =====
    if (registerBtn && registerModal) {
      registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'flex';
      });
    }

    // ===== CLOSE BUTTONS =====
    closeBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal')[index].style.display = 'none';
      });
    });

    // ===== CLICK OUTSIDE =====
    window.addEventListener('click', (e) => {
      if (e.target === loginModal) loginModal.style.display = 'none';
      if (e.target === registerModal) registerModal.style.display = 'none';
    });
  }
};