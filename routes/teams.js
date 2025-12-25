import express from 'express';
import Team from '../models/Team.js';

const router = express.Router();

router.post('/createteam', async (req, res) => {
    try {
        // 1. Check if the user has a "wristband"
        if (!req.session.userId) {
            return res.status(401).json({ error: "You must be logged in!" });
        }

        const { name, teamSize, isPrivate } = req.body;

        const teamData = {
            name: name,
            isPublic: !isPrivate,
            settings: { maxMembers: teamSize || 10 },
            
            // 2. Use the ID stored in the session!
            createdBy: req.session.userId, 
            members: [{
                userId: req.session.userId,
                role: 'owner'
            }]
        };

        const newTeam = new Team(teamData);
        await newTeam.save();

        res.status(201).json({ message: 'Team created!' });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// routes/teams.js

router.post('/helloworld', async (req, res) => {
    try {
        // 1. The "Try" - attempting the logic
        const { message, sender } = req.body;

        // Intentional check: What if the user didn't send a message?
        if (!message) {
            // We "throw" an error to jump straight to the catch block
            throw new Error("No message was provided in the request body.");
        }

        res.status(200).json({
            status: "Success",
            reply: `Hello ${sender}, I received your message: ${message}`
        });

    } catch (error) {
        // 2. The "Catch" - the safety net
        console.error("❌ Route Error:", error.message);

        // Tell Postman/Browser exactly what went wrong
        res.status(400).json({
            status: "Error",
            message: error.message
        });
    }
});
export default router;