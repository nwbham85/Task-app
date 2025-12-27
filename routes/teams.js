import express from 'express';
import Team from '../models/Team.js';
import { authenticate } from '../middleware/auth.js'; // 1. Import the guard

const router = express.Router();

// 2. Add 'authenticate' as the second argument to protect this route
router.post('/createteam', authenticate, async (req, res) => {
    try {
        // 3. Instead of req.session.userId, we use req.user.id 
        // (Note: dependening on your middleware, it might be req.user.userId or req.user._id)
        const currentUserId = req.user.id || req.user.userId; 

        if (!currentUserId) {
            return res.status(401).json({ error: "User identity not found in token." });
        }

        const { name, teamSize, isPrivate } = req.body;

        const teamData = {
            name: name,
            isPublic: !isPrivate,
            settings: { maxMembers: teamSize || 10 },
            createdBy: currentUserId, 
            members: [{
                userId: currentUserId,
                role: 'owner'
            }]
        };

        const newTeam = new Team(teamData);
        await newTeam.save();

        res.status(201).json({ message: 'Team created!', team: newTeam });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;