import express from 'express';

// controllers
import * as postController from '../controllers/posts.js';

const router = express.Router();

router
  .route('/')
  .get(postController.getPosts)
  .post(postController.createPost);

router
  .route('/:id')
  .get(postController.getPost)
  .put(postController.updatePost)
  .delete(postController.deletePost);

export default router;