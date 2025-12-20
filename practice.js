const mongoose = require('mongoose');
const { User, Task, Project, Team } = require('./server.js'); // import models

// --- 1️⃣ Wait for the connection to open ---
mongoose.connection.once('open', async () => {
    console.log('Database connection is open. Running script...');

    try {
        // --- 2️⃣ Create a user ---
        const user = new User({
            email: 'nathan@example.com',
            username: 'nathan',
            passwordHash: 'hashedpassword123',
            profile: { firstName: 'Nathan', lastName: 'Winslow' }
        });

        await user.save();
        console.log('--- User created successfully! ---');
        console.log(user);

    } catch (error) {
        console.error('*** User creation failed: ***');
        console.error(error.message);
    } finally {
        // Close the connection if you want to exit the script
        await mongoose.connection.close();
        console.log('Database connection closed. Script finished.');
    }
});

// --- 3️⃣ Handle connection errors ---
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});
