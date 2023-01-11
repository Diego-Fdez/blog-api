import express from 'express';
import {
  addPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
} from '../controllers/postsController.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', addPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
