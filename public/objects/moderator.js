export function moderator(post) {
    let badWords = ['badword'];
    let banned = false;
    console.log('moderator.js loaded');
    // Look in localStorage first. If there's nothing there, start with an empty array []
    let strikes = JSON.parse(localStorage.getItem('strikes')) || [];
    
    // Select HTML elements (Matching the IDs from the previous HTML template)
    post = document.querySelector('.Text'); 
    let submit = document.querySelector('.primary');
    

    submit.addEventListener('click', () => {
        // check to see if user is banned
        if (banned) {
            console.log(user, 'is banned.');
        }
        
        // Grab the current text values from the inputs at the exact moment of the click
        let currentPostText = post.value;
        

        // Reset total strikes to 0 right before counting so the loop math stays accurate
        let totalStrikes = 0; 

        if (currentPostText.includes(badWords)) {
            console.log(`those words are not allowed.`);
            
            // Add a new strike to our array
            strikes.push(1);
            
            // Loop through ALL strikes
            for (let i = 0; i < strikes.length; i++) {
                totalStrikes = totalStrikes + strikes[i];
            }

            console.log(`Total strikes: ${totalStrikes}`);

            // Save the updated array back to localStorage
            localStorage.setItem('strikes', JSON.stringify(strikes));

            // Ban the user if they hit 3 strikes
            if (totalStrikes > 2) {
                console.log(`user has been banned!`);
                banned = true;
                return;
            }
        } else {
            console.log("Post approved! No bad words found.");
        }

        if(currentPostText === 'clear') {
            localStorage.clear();
            strikes = [];
            console.log('storage cleared');
            return;
        }
    });
}

export default moderator;
