export function moderator(post, user) {
    // FIX 4: Look in localStorage first. If there's nothing there, start with an empty array []
    let strikes = JSON.parse(localStorage.getItem('strikes')) || [];
    
    // FIX 1 & 2: Use 'let' instead of 'const', and start it at 0 so we can do math
    let totalStrikes = 0; 

    if (post.includes('badword')) {
        console.log(`${user}, those words are not allowed.`);
        
        // Add a new strike to our array
        strikes.push(1);
        
        // FIX 3: Use 'strikes.length' instead of '4' so it loops through ALL strikes
        for (let i = 0; i < strikes.length; i++) {
            totalStrikes = totalStrikes + strikes[i];
        }

        console.log(`Total strikes for ${user}: ${totalStrikes}`);

        // Save the updated array back to localStorage
        localStorage.setItem('strikes', JSON.stringify(strikes));

        // Ban the user if they hit 5 strikes
        if (totalStrikes >= 5) {
            console.log(`${user} has been banned!`);
        }
    }
}

// Test it out! (Run this a few times in a browser, and watch the strikes go up)
moderator('this post has a badword in it', 'nate');