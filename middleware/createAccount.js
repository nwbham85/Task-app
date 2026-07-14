export function validate(email,username,password){
    if(!email || !username || !password) {
        console.log('field cannot be blank');
    }

    //search username for symbols
    const symbolRegex = /[^a-zA-Z0-9_-]/;

    if (symbolRegex.test(username)) {
        console.log("Username cannot contain symbols.");
        return;
        // Trigger your validation error here
    }

    if(password.value.length.trim() < 8) {
        console.log('password must be 8 or more characters.');
        return false;
    }

    return {
        message: 'validation successful'
    }

}

export default validate;