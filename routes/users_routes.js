import express from 'express';

export default function userRoutes(db) {
    const router = express.Router();


    router.get('/', async (req,res) => {

    const {username} = req.query;

    if(!username) {
        return res.status(400).json({error: 'Username required'});
    }

    try {
        const user = await db.collection('users').findOne({username});
    
        if (!user) {
            return res.json({exists:false});
        }

        res.json({
            exists: true,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
});
return router;

}

//get /users

