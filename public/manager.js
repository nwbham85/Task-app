const managerModal = {
  init() {
    const openBtn = document.querySelector('.createAccount');
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.modal-close');

    if (!openBtn || !modal || !closeBtn) return;

    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  managerModal.init();
});


function validate(){
    const invalidEmail = ['gmail.com', 'yahoo.com',]
    const email = document.querySelector('.email');
    const password = document.querySelector('.password');

    if(!email.value || !password.value) {
        alert('Complete all fields.');
        return;
    }
        //check valid email
        invalidEmail.forEach(e => {
        if(email.value.includes(e)) {
            console.log('invalid email.');
            alert('enter a professional email.');
        }
        return;
    });
        //check password length
    if(password.value.length < 5) {
        console.log('password too short.')
        alert('password must be 5 or more.')
        return;
    }
        // check is email exists on server
    
        const exists = emailExists(email.value);

        if(!exists) {
            alert('no manger account with that email.');
            return;
        }
        alert('email exists.');
    
async function emailExists(email) {
    try {
        const response = await fetch(`/api/manager/email-exists?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        console.log('server reponse', data);
        return data.exists;

    } catch(error) {
        console.error('could not fetch.', error);
        return false;
    }


 }

}

    
