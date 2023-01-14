import express from 'express';
import { body } from 'express-validator';
import apicache from 'apicache';
import {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController.js';

const router = express.Router();
const cache = apicache.middleware;

router.get('/', cache('60 minutes'), getCategories);
router.get('/:id', getCategory);
router.post(
  '/',
  body('description', 'Category description is required').not().isEmpty(),
  addCategory
);
router.put(
  '/:id',
  body('description', 'Category description is required').not().isEmpty(),
  updateCategory
);
router.delete('/:id', deleteCategory);

export default router;
