import { Router, Response } from 'express';
import { Task } from '../Models/index';
import { AuthRequest, authenticateToken } from '../middleware/authMiddlware';

const router = Router();

/**
 * Retrieves tasks for the authenticated user.
 */
router.get('/tasks', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.user!.id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Creates a new operational task for the farmer.
 */
router.post('/tasks', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate } = req.body;
    
    const task = await Task.create({
      userId: req.user!.id,
      title,
      description,
      dueDate: new Date(dueDate)
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;