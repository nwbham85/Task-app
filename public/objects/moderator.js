import { createUser } from '../objects/user.js';

const currentUser = createUser('Nathan', 'Winslow', 'nwinslow');

export function moderator(postText) {
    const badWords = ['badword', 'badword2'];

    if (currentUser.isBanned) {
        console.log('Post denied - user banned.');
        return {
            approved: false,
            banned: true,
            user: currentUser
        };
    }

    const hasBadWord = badWords.some(word =>
        postText.toLowerCase().includes(word.trim().toLowerCase())
    );

    if (hasBadWord) {
        currentUser.strikes += 1;
        console.log(`${currentUser.username} has received a strike.`);

        return {
            approved: false,
            banned: false,
            user: currentUser
        };
    }

    return {
        approved: true,
        banned: false,
        user: currentUser
    };
}

export default moderator;