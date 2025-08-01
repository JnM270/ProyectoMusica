import express from 'express';
import { getAllUsers, updateUser,deleteUser, getUserProfile} from '../controllers/userController.js';
import { registerUserController,loginUserController2} from '../controllers/authController.js';
import { verifyToken } from '../middlewareVerif.js';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController2);

router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/profile', verifyToken, getUserProfile);

export default router;
