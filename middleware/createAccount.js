export function validate(email,username,password){
    if(!email || !username || !password) {
        console.log('field cannot be blank');
    }
}