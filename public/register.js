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
        }
    }  



}