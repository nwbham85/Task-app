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

router.post('/helloworld', (request, response) => {
    // 1. receive request from postman
    const {message , sender} = request.body;
    console.log(`incoming message from: ${sender}: ${message}`);

    // 2 send back a response
    response.status(200).json({
        status: 'success',
        received: {
            text: message,
            from: sender
        },
        serverTime: new Date().toLocaleDateString()
    });
});

export default router;