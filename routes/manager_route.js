import express from 'express';
import Manager from './models/Manager.js';

export default function managerRoutes() {
    const router = express.Router();

    router.get('./email-exists', async (req, res) => {
        try {
            const {email} = req.query;

            if(!email) {
                return res.status(400).json({error: 'email is required'});
            }

            const manager = await Manager.findOne({email});

            res.json({exists: !!manager});
        } catch(error) {
            console.error('error', error);
            res.status(500).json({error: 'server error'});
        }

    })
    return router;
}


