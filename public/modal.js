export const modal = {
  init() {
    const loginBtn = document.querySelector('.login');
    const modalEl = document.querySelector('.modal');
    const closeBtn = document.querySelector('.modal-close');

    if (!loginBtn || !modalEl || !closeBtn) return;

    loginBtn.addEventListener('click', () => {
      modalEl.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
      modalEl.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modalEl) {
        modalEl.style.display = 'none';
      }
    });
  }
};