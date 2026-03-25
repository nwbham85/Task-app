import {Router} from 'express';

// create router
export default function testRoutes(db) {
    const router = express.Router();
}

//add the route

router.get('./', (req,res) => {
    res.json({message: 'test route working'});
});

//export it
return router;