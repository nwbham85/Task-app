export function createUser(firstName, lastName, username) {
    return {
        firstName,
        lastName,
        username,
        isBanned: false,
        strikes: 0
    };
}

export default createUser;