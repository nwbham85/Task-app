export const login = {
init() {},

async Validate() {
    const userLogin = document.querySelector('.login-username');
    const userPassword = document.querySelector('.login-password');
    const login = document.querySelector('.loginBtn');

    if(!userLogin || userLogin.length < 2) {
        alert('Thats not a valid username.');
        return;
    } 
    
    try {
        const res = await fetch(`/users?username=${userLogin}`);

        if (!res.ok) {
            throw new Error('server error');
        }

        const data = await res.json();

        if (!data.exists) {
            alert('user does not exist');
            return;
        }

        console.log('user exists:', data.user);

    } catch(err) {
        console.error(err);
        alert('something went wrong.');
    }


 }
};