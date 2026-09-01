import express from 'express';

import {
  getUserAccount, 
  createUserAccount,
  deleteAccount,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/:userId')
  .get(getUserAccount)
  .post(createUserAccount)
  .delete(deleteAccount);


// ---------------------- post -------------------------
router.post('/:userId/comments', (req, res) => {
  res.status(200).json({
    success: true,
    id: `Comments from userId: ${req.params.userId}`
  });
});


      // ------------------- GET  -----------------------



router.get('/:userId/comments', (req, res) => {
  res.status(200).json({
    success: true,
    id: `Comments from userId: ${req.params.userId}`
  });
});
    // --------------------- put ------------------------


router.put('/:userId/comments', (req, res) => {
  res.status(200).json({
    success: true,
    msg: 'Comment edited'
  });
});

  
export default router;