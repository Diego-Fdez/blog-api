import express from 'express';
import { body } from 'express-validator';
import apicache from 'apicache';
import {
  registerUser,
  getUsers,
  getOneUser,
  loginUser,
  logout,
} from '../controllers/adminController.js';

const router = express.Router();
const cache = apicache.middleware;

router.get('/', cache('60 minutes'), getUsers);
router.get('/:id', getOneUser);
router.post(
  '/',
  body('email', 'email is required').not().isEmpty(),
  body('userName', 'userName is required').not().isEmpty(),
  body('password', 'email is required').not().isEmpty(),
  registerUser
);
router.post('/login', loginUser);
router.post('/logout', logout);

export default router;
