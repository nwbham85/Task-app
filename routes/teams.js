import express from 'express';
import Team from '../models/Team.js';

const router = express.Router();

router.post('/createteam', async (req, res) => {
    try {
        const { name, teamSize, isPrivate, profilePhoto } = req.body;

        // 1. Logic to handle the "Opposites" and "Nesting"
        const teamData = {
            name: name,
            avatar: profilePhoto,           // Mapping 'profilePhoto' to 'avatar'
            isPublic: !isPrivate,           // If it's NOT private, it's public
            settings: {
                maxMembers: teamSize || 10  // Nesting it inside 'settings'
            },
            // IMPORTANT: Your model REQUIRES 'createdBy'. 
            // Usually, this comes from 'req.user._id' (if logged in).
            // For now, I'll use a placeholder ID so it doesn't crash.
            createdBy: "658af1234567890123456789", 
            members: [{
                userId: "658af1234567890123456789", // The creator is the first member
                role: 'owner'
            }]
        };

        // 2. The Inspector checks the work
        const newTeam = new Team(teamData);
        const savedTeam = await newTeam.save();

        res.status(201).json({
            message: 'Team created successfully!',
            team: savedTeam
        });

    } catch (err) {
        // If the 'maxMembers' is less than 2, the Inspector triggers this:
        console.error("❌ Validation Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

export default router;