import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '../Models/index';
import dotenv from 'dotenv';
import { AuthRequest, authenticateToken } from '../middleware/authMiddlware';

const router = Router();

/**
 * Registers a new user. Hashes password and saves to MongoDB.
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, role: role || Role.FARMER, phone });

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Authenticates user and returns a JWT token.
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    //generate token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET!, //secret
      { expiresIn: '30d' } //token expires in 30 days
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Returns the profile of the currently authenticated user.
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // find user by id and return all information
    const user = await User.findById(req.user!.id).select('-passwordHash');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Updates the profile of the currently authenticated user.
 */
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user!.id, 
      { name, phone }, 
      { new: true, runValidators: true }
    ).select('-passwordHash');
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;