import express from 'express';
import { body } from 'express-validator';
import apicache from 'apicache';
import {
  addPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
} from '../controllers/postsController.js';

const router = express.Router();
const cache = apicache.middleware;

router.get('/posts', cache('2 minutes'), getPosts);
router.get('/post/:id', getPost);
router.post(
  '/post',
  body('title', 'Post title is required').not().isEmpty(),
  body('body', 'The body of the post is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty(),
  body('createdBy', 'You must enter the name of the user who creates the post')
    .not()
    .isEmpty(),
  addPost
);
router.put(
  '/post/:id',
  body('title', 'Post title is required').not().isEmpty(),
  body('body', 'The body of the post is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty(),
  body('createdBy', 'You must enter the name of the user who creates the post')
    .not()
    .isEmpty(),
  body('EditedBy', 'You must enter the name of the user who edit the post')
    .not()
    .isEmpty(),
  updatePost
);
router.delete('/post/:id', deletePost);

export default router;
