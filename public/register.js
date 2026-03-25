export const register = {

    init(){

        // check for db connection
        this.checkConnection();
    },

    async checkConnection(){
        let isConnected;
        try {
            isConnected = await fetch('./');
            console.log('status', isConnected.status);
    
        }catch (err) {
            console.error('connection failed', err);
            return;
        }
    },  

    async validate() {
        const usernameInput = document.querySelector('.register-username');
        const username = usernameInput.value.trim();

        if(!username) {
            console.log('input username');
            return;
        }

        try {
            const response = await fetch('/users');
            console.log('server response code', response.status);

            if (!response.ok) {
                throw new Error(`http error ${response.status}`);
            }

            const users = await response.json();
            const foundUser = users.find(user => user.username === username);

            if (foundUser) {
                console.log('user exists:', foundUser);
                return false;
            } else {
                console.log('user does not exist');
                return true;
            }
         } catch(err) {
            console.error('did not find user/ request failed'. err);
            return false;
         }
     }

}