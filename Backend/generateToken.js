import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateToken = (user) => {  
  return jwt.sign(
    { id: user._id }, 
    config.JWT_SECRET,
    { expiresIn: '2h' }
  );
};
