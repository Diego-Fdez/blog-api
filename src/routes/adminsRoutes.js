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

/**
 * @openapi
 * /api/v1/admins:
 *   get:
 *     tags:
 *       - Admins
 *     parameters:
 *       - in:
 *         name: mode
 *         schema:
 *           type: string
 *         description: Get list of all users
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Admins"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */
router.get('/', cache('60 minutes'), getUsers);
router.get('/:id', getOneUser);
/**
 * @openapi
 * /api/v1/admins:
 *   post:
 *     tags:
 *       - Admins
 *     parameters:
 *       - in: body
 *         name: mode
 *         schema:
 *           type: object
 *         description: Create a new user
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Admins"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: "Some error message"
 */
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
